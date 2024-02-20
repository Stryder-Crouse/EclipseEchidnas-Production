import axios from "axios";
import {FloorToIndex, floorToNumber, Node, NodeType, NULLNODE} from "../../../../backend/src/algorithms/Graph/Node.ts";
import "../../css/component-css/Map.css";
import {Edge, NULLEDGE} from "../../../../backend/src/algorithms/Graph/Edge.ts";
import {Graph} from "../../../../backend/src/algorithms/Graph/Graph.ts";
import {onNodeHover, onNodeLeave, onNodeRightClick,} from "../../event-logic/circleNodeEventHandlers.ts";
import {NodeDataBase, nodeDataBaseToNode,} from "../../../../backend/src/DataBaseClasses/NodeDataBase.ts";
import {EdgeDataBase, edgeDataBasetoEdge,} from "../../../../backend/src/DataBaseClasses/EdgeDataBase.ts";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Coordinate} from "../../../../backend/src/algorithms/Graph/Coordinate.ts";
import {SearchContext} from "../../../../backend/src/algorithms/Search/Strategy/SearchContext.ts";
import {AStarStrategy} from "../../../../backend/src/algorithms/Search/Strategy/AStarStrategy.ts";
import {BFSStrategy} from "../../../../backend/src/algorithms/Search/Strategy/BFSStrategy.ts";
import {DFSStrategy} from "../../../../backend/src/algorithms/Search/Strategy/DFSStrategy.ts";
import {ServiceRequest} from "../../../../backend/src/algorithms/Requests/Request.ts";

/* - - - types - - - */
/**
 * Struct to hold every possible state of the map.
 */
export type MapState = {
    startNode: Node;
    setStartNode: Dispatch<SetStateAction<Node>>;
    endNode: Node;
    setEndNode: Dispatch<SetStateAction<Node>>;
    selectedFloorIndex: FloorToIndex;
    setSelectedFloorIndex: Dispatch<SetStateAction<FloorToIndex>>;
    drawEntirePath: boolean;
    setDrawEntirePath: Dispatch<SetStateAction<boolean>>;
    locationsWithHalls: Node[];
    pathFindingType:string;
    viewbox: Viewbox,
    setViewbox: Dispatch<SetStateAction<Viewbox>>;
    zoomScale: number,
    setZoomScale: Dispatch<SetStateAction<number>>
    drawEntirePathOptions:boolean[]
}

/**
 * Type to hold the two nodes of a transition.
 */
type Transition = {
    startTranNode: Node;
    endTranNode: Node;
}

/**
 * Type to hold edges and transitions for pathfinding
 */
type edgesAndTransitions = {
    edges: Array<Edge>;
    transitions: Array<Transition>;
}

/**
 * Type to hold the style information for the floor-to-floor transition text
 */
type TransitionTextStyle = {
    xTransform: number;
    xTextTransform: number;
    yTransform: number;
    yTextTransform: number;
    height: number;
    width: number;
}

/**
 * Type to hold the information needed in a viewbox.
 */
export type Viewbox = {
    x: number;
    y: number;
    width: number;
    height: number
}

/* - - - global variables - - - */
let graph: Graph | null = null;
const panSpeed: number = 2;
const zoomSpeed: number = 0.1;

let previousSelectedLevel = FloorToIndex.LowerLevel1;

const nodeIDtoServiceRequest:Map<string,ServiceRequest[]> = new Map<string, ServiceRequest[]>();

/* - - - functions - - - */
/**
 * Create the global graph from nodes and edges gathered from the database.
 */
async function createGraph() {
    /* ask axios for nodes and edges */
    const edgesDB = await axios.get<EdgeDataBase[]>("/api/load-edges");
    const nodesDB = await axios.get<NodeDataBase[]>("/api/load-nodes/all");

    /* allocate some space for the nodes and edges */
    const edges: Array<Edge> = [];
    const nodes: Array<Node> = [];

    /* populate edges */
    edgesDB.data.forEach((edgeDB) => {
        edges.push(edgeDataBasetoEdge(edgeDB));
    });

    /* populate nodes */
    nodesDB.data.forEach((nodeDB) => {
        nodes.push(nodeDataBaseToNode(nodeDB));
    });

    /* construct a graph from the data */
    graph = new Graph(nodes, edges);
    // console.log(graph.getEdges());
}


async function getNodeServiceRequests(){

    //setup map with empty strings for every node

    graph?.getNodes().forEach((node)=>{
        nodeIDtoServiceRequest.set(node.id,[]);
    });


    //get all service requests
    const serviceRequestsRes =
        await axios.get<ServiceRequest[]>("/api/serviceRequests/serviceReq");
    const serviceRequests =serviceRequestsRes.data;

    //add service requests to graph
    serviceRequests.forEach((request)=>{
        if(nodeIDtoServiceRequest.get(request.reqLocationID)!=undefined){
            nodeIDtoServiceRequest.get(request.reqLocationID)?.push(request);
        }
    });



}

/**
 * Enable zoom with a mouse event
 * @param viewbox a Viewbox that holds coordinate information
 * @param setViewbox a Dispatch that transforms the coordinate information
 * @param setScale a Dispatch that sets the map scale
 */
function createZoomEvent(viewbox: Viewbox, setViewbox: Dispatch<Viewbox>, setScale: Dispatch<number>
                         ) {
    /* grab the map and its current size */
    const svgElement = document.getElementById("map")!;
    const svgSize: { width: number, height: number } = {width: svgElement.clientWidth, height: svgElement.clientHeight};

    /* listen to the mouse wheel and transform the map image */
    document.getElementById("map-test")!.addEventListener("wheel", event => {
        /* prevent the page from scrolling */
        event.preventDefault();

        /* see where on the map div the wheel has scrolled */
        const mouseX = event.offsetX; // in relation to the Div
        const mouseY = event.offsetY;

        /* see how far the scroll was */
        const zoomAmount = event.deltaY; // how far was the wheel scrolled up/down in pixels
        const inverseZoomAmount = -zoomAmount; // invert it for convention

        /* zoomAmount negated to follow conventional scrolling */
        // calculate change in width and height of the box based on zoom direction
        const changeInWidth = viewbox.width * Math.sign(inverseZoomAmount) * zoomSpeed;
        const changeInHeight = viewbox.height * Math.sign(inverseZoomAmount) * zoomSpeed;

        // keep mouse in the center of the zoom and get new x and y
        const newX = viewbox.x + (changeInWidth * mouseX) / svgSize.width;
        const newY = viewbox.y + (changeInHeight * mouseY) / svgSize.height;

        // set scale for proper panning
        setScale(svgSize.width / viewbox.width);

        // set new viewbox
        setViewbox({
            x: newX,
            y: newY,
            width: viewbox.width - changeInWidth,
            height: viewbox.height - changeInHeight
        });
    });
}



/**
 * sets the path to the path to be displayed on the page
 */
function updatePathEdges(startingNode: Node,
                         endingNode: Node,
                         setPathEdges: Dispatch<SetStateAction<Edge[]>>,
                         floorIndex: number,
                         drawAllEdges: boolean,
                         setPathFloorTransitionNodes: Dispatch<Array<Transition>>,
                         pathFindingType:string) {

    /* actually first: check if the graph is ready */
    if (graph == null) {
        // console.error("Graph has not been created yet, but updatePathEdges was called");
        return;
    }

    /* first, check if we want to draw EVERY edge  */
    if (drawAllEdges) {
        /* allocate some space for the edges on this floor */
        const thisFloorEdges: Array<Edge> = [];

        /* get the edges on this floor */
        graph?.getEdges().forEach((edge) => {
            if (floorToNumber(edge.startNode.floor) == floorIndex && floorToNumber(edge.endNode.floor) == floorIndex) {
                thisFloorEdges.push(edge);
            }
        });

        /* draw them */
        setPathEdges(thisFloorEdges);
        return;
    }

    /* next, if neither of the nodes are selected, stop drawing any edges */
    if (startingNode == NULLNODE || endingNode == NULLNODE) {
        setPathEdges([]);
        setPathFloorTransitionNodes([]);
        return;
    }

    /* use a pathfinding algorithm to find the path to draw */


    let algo:SearchContext;
    let rawPath: Array<Node> | null;

    switch (pathFindingType){
        case "A*":
            algo = new SearchContext(new AStarStrategy());
            rawPath = algo.search(graph.idToNode(startingNode.id)!, graph.idToNode(endingNode.id)!, graph);
            break;
        case "BFS":
            algo = new SearchContext(new BFSStrategy());
            rawPath = algo.search(graph.idToNode(startingNode.id)!, graph.idToNode(endingNode.id)!, graph);
            break;
        case "DFS":
            algo = new SearchContext(new DFSStrategy());
            rawPath = algo.search(graph.idToNode(startingNode.id)!, graph.idToNode(endingNode.id)!, graph);
            break;

        default:
            algo = new SearchContext(new AStarStrategy());
            rawPath = algo.search(graph.idToNode(startingNode.id)!, graph.idToNode(endingNode.id)!, graph);
            break;

    }



    if (rawPath == null) {
        console.error("no path could be found between " + startingNode?.id + " and " + endingNode?.id);
        return;
    }

    /* calculate the edges and transitions just on this floor */
    const floorEdgesAndTransitions: edgesAndTransitions = calculateFloorPath(rawPath, floorIndex);

    /* set the changes */
    setPathFloorTransitionNodes(floorEdgesAndTransitions.transitions);
    setPathEdges(floorEdgesAndTransitions.edges);
}

/**
 * Find the subset of edges on a given path that exist on the current floor,
 * while also including the edges that transition between floors.
 * @param rawPath the raw path to search in
 * @param floorIndex the floor to look at
 */
function calculateFloorPath(rawPath: Array<Node>, floorIndex: number): edgesAndTransitions {
    /* find the subset of edges from that path on this floor */
    const pathEdges: Array<Edge> = [];
    const pathTransitions: Array<Transition> = [];

    /* for every node in the path */
    for (let i = 0; i < rawPath.length - 1; i++) {
        /* store this node and the next node */
        const start = rawPath.at(i)!;
        const end = rawPath.at(i + 1)!;

        /* if both nodes are on this floor */
        if (floorToNumber(start!.floor) == floorIndex && floorToNumber(end!.floor) == floorIndex) {
            /* find the edge that connects start to end and add it to pathEdges */
            start!.edges.forEach((edge) => {
                if (edge.endNode == end) {
                    pathEdges.push(edge);
                }
            });
        }

        /* if start is on this floor, but end is on a different floor */
        else if (floorToNumber(start!.floor) == floorIndex) {
            /* find which node on this floor causes the transition between floors */
            const newTransition: Transition = {startTranNode: start, endTranNode: end};

            /* iterate forward through the path */
            let currentNode = end;
            while (i < rawPath.length - 2) {
                currentNode = rawPath.at(i + 1)!;
                const nextNode = rawPath.at(i + 2)!;

                /* find edge between transition floors */
                let connectingEdge: Edge = NULLEDGE;
                currentNode!.edges.forEach((edge) => {
                    if (edge.endNode == nextNode) {
                        connectingEdge = edge;
                    }
                });

                /* if we didn't find it */
                if (connectingEdge == NULLEDGE) {
                    console.error("connecting edge between floor transition not found");
                    break;
                }

                /* double check that the weight of the edge corresponds to a floor transition */
                if (connectingEdge.weight == Graph.getElevatorAndStairsEdgeWeight()) {
                    newTransition.endTranNode = nextNode;
                } else {
                    break;
                }


                i++;
            }

            /* we found the transition  */
            pathTransitions.push(newTransition);
        }

        /* if instead end is on this floor, but start is on a different floor */
        else if (floorToNumber(end!.floor) == floorIndex) {
            /* find edge between transition floors */
            const newTransition: Transition = {startTranNode: start, endTranNode: end};

            /* iterate backward through the path */
            let currentNode = start;
            const startingI = i;
            while (i > 0) {
                currentNode = rawPath.at(i)!;
                const prevNode = rawPath.at(i - 1)!;

                /* find edge between transition floors */
                let connectingEdge: Edge = NULLEDGE;
                currentNode!.edges.forEach((edge) => {
                    if (edge.endNode == prevNode) {
                        connectingEdge = edge;
                    }
                });

                /* if we didn't find it */
                if (connectingEdge == NULLEDGE) {
                    console.error("connecting edge not found");
                    break;
                }

                /* double check that the weight of the edge corresponds to a floor transition */
                if (connectingEdge.weight == Graph.getElevatorAndStairsEdgeWeight()) {
                    newTransition.startTranNode = prevNode;
                } else {
                    break;
                }


                i++;
            }

            /* we found the transition  */
            i = startingI; //go back to starting i to avoid recalculations
            pathTransitions.push(newTransition);
        }
    }


    return {edges: pathEdges, transitions: pathTransitions};
}

/**
 * Draw the map to the screen.
 * @param startNode part of a MapState
 * @param setStartNode part of a MapState
 * @param endNode part of a MapState
 * @param setEndNode part of a MapState
 * @param selectedFloorIndex part of a MapState
 * @param drawEntirePath part of a MapState
 * @param locations part of a MapState
 * @param viewbox part of a MapState
 * @param setViewbox part of a MapState
 * @param zoomScale part of a MapState
 * @param setZoomScale part of a MapState
 */
export function HospitalMap({
                        startNode: startNode, setStartNode: setStartNode,
                        endNode: endNode, setEndNode: setEndNode,
                        selectedFloorIndex: selectedFloorIndex,
                        drawEntirePath: drawEntirePath, locationsWithHalls: locationsWithHalls,
                        pathFindingType:pathFindingType,
                        viewbox: viewbox, setViewbox: setViewbox,
                        zoomScale: zoomScale, setZoomScale: setZoomScale
                        ,drawEntirePathOptions
                    }: MapState) {



    /* when the page updates, update the edges */
    useEffect(() => {
        updatePathEdges(startNode, endNode, setPathDrawnEdges, selectedFloorIndex, drawEntirePath,
            setPathFloorTransitions, pathFindingType);
    }, [drawEntirePath, endNode, selectedFloorIndex, startNode,pathFindingType]);

    const [pathDrawnEdges, setPathDrawnEdges] = useState<Array<Edge>>([]);
    const [pathFloorTransitions, setPathFloorTransitions] =
        useState<Array<Transition>>([]);
    const [currentlyPanning, setCurrentlyPanning] =
        useState(false);
    const [startOfClick, setStartOfClick] =
        useState<Coordinate>({x: 0, y: 0});
    const [endOfClick, setEndOfClick] =
        useState<Coordinate>({x: 0, y: 0});


    //set map to zoom level for each level. Only do this when a diffrent floor is selected
    if(previousSelectedLevel!=selectedFloorIndex){
        setViewBoxForLevel();
        previousSelectedLevel=selectedFloorIndex;
    }

    /*
     * Create the event listener in raw JavaScript for zooming in and out,
     * as React's onWheel React event does not allow
     * the preventDefault() option to work.
     *
     * React-Dev's solution was "just use non react event listeners."
     */
    useEffect(() => {
        createZoomEvent(viewbox, setViewbox, setZoomScale);
    }, [setViewbox, setZoomScale, viewbox, zoomScale]);

    /* Main map html*/
    return (
        /* overarching div with panning functionality */
        <div id={"map-test"}
             onMouseLeave={leftMapArea}
             onMouseDown={(e) => {
                 startPan(e);
             }}
             onMouseMove={(e) => {
                 whilePanning(e);
             }}
             onMouseUp={(e) => {
                 stopPan(e);
             }}
        >
            {/* entire everything */}
            <svg
                id="map"
                className={"map-test"}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={viewbox.x.toString() + " " + viewbox.y.toString() +
                    " " + viewbox.width.toString() + " " + viewbox.height.toString()}
            >
                <use xmlnsXlink="http://www.w3.org/1999/xlink"></use>
                {/* render the map image png */}
                <image
                    width="5000"
                    height="3400"
                    href={setMapImage()}
                ></image>
                {   /* draw the edges on the map */
                    pathDrawnEdges.map((edge) => {
                        return drawEdge(edge);
                    })
                }
                {   /* draw the nodes on the map */
                    locationsWithHalls.map((node) => {
                        return drawNode(node);
                    })
                }
                { // draw location names when needed
                    locationsWithHalls.map((node)=>{
                        return drawNodeLocationName(node);
                    })
                }
                {   /* draw the hover node info on the map */
                    locationsWithHalls.map((node) => {
                        return drawNodeInfo(node);
                    })
                }
                {
                    locationsWithHalls.map((node)=>{
                        return drawNodeServiceRequests(node);
                    })
                }
                {   /* draw the transition text on the map */
                    pathFloorTransitions.map((transition) => {
                        return drawTransitionText(transition);
                    })
                }
            </svg>
        </div>
    );

    /**
     * Graphically draw an edge.
     * @param edge the edge to draw
     */
    function drawEdge(edge: Edge) {



        /* draw the solid edge for everything */
        if (drawEntirePath) {

            //if user has elected not to draw the edges
            if(!drawEntirePathOptions[1]){
                return;
            }

            return drawEdgeHTML(edge, "pathLineAll");
        }

        /* draw the moving, dotted edge for the pathfinding path */
        return drawEdgeHTML(edge, "pathLine");
    }

    /**
     * Draw the edge's rendered HTML.
     * @param edge the edge to draw
     * @param edgeClass the type of the edge (dotted or solid)
     */
    function drawEdgeHTML(edge: Edge, edgeClass: string) {

        return (<line key={"line_" + edge.id} className={edgeClass}
                      x1={edge.startNode.coordinate.x.toString()}
                      y1={edge.startNode.coordinate.y.toString()}
                      x2={edge.endNode.coordinate.x.toString()}
                      y2={edge.endNode.coordinate.y.toString()}></line>);
    }

    /**
     * Graphically draw a node.
     * @param node the node to draw
     */
    function drawNode(node: Node) {
        /* symbols */
        const tag: string = "clickableAtag";

        //if all nodes should not be drawn
        if(!drawEntirePathOptions[0] && drawEntirePath){
            return;
        }

        /* if the node is a start node, draw it green */
        if (node.id == startNode.id) {
            return drawNodeHTML(node, tag, "startSelected");
        }

        /* if the node is an end node, draw it red */
        else if (node.id == endNode.id) {
            return drawNodeHTML(node, tag, "endSelected");
        }

        /* if the node is a transition node, draw it orange */
        else if (inTransition(node.id)) {
            return drawNodeHTML(node, tag, "transitionNode");
        }

        /* if we want to draw the whole path, draw it blue?? */
        else if (drawEntirePath) {
            //make hallways visable with diffrent cloor to other nodes
            if(node.nodeType == NodeType.HALL){
                return drawNodeHTML(node, tag, "hallwayNodeVisible");
            }
            return drawNodeHTML(node, tag, "normalNode");
        }

        //if node is a hallway
        else if (node.nodeType == NodeType.HALL) {
            //show hallway if in the path
            if(inPathDrawnEdges(node.id)){
                return drawNodeHTML(node, tag, "hallwayNodeVisible");
            }
            return drawNodeHTML(node, tag, "hallwayNodeHidden");
        }

        /* finally, draw the node blue */
        return drawNodeHTML(node, tag, "normalNode");
    }

    /**
     * Draw the node's rendered HTML.
     * @param node the node to draw
     * @param tagClass the tag, generally clickableAtag
     * @param nodeClass the class of the node
     */
    function drawNodeHTML(node: Node, tagClass: string, nodeClass: string) {

        if(node.id == startNode.id) {
            return(
                <a key={node.id} id={node.id} className={tagClass}
                   onClick={() => markNodeOnClick(node.id)}
                   onMouseOver={() => onNodeHover(node.id)}
                   onMouseLeave={() => onNodeLeave(node.id)}
                   onContextMenu={(e)=>{
                       e.preventDefault();
                       onNodeRightClick(node.id);
                   }}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={nodeClass}></circle>
                    <image
                        x={node.coordinate.x - 25}
                        y={node.coordinate.y - 50}
                        width="50"
                        height="50"
                        href={"/src/images/MapFunctions/mapPinGreen.png"}
                    ></image>

                </a>
            );
        }
        else if(node.id == endNode.id) {
            return(
                <a key={node.id} id={node.id} className={tagClass}
                   onClick={() => markNodeOnClick(node.id)}
                   onMouseOver={() => onNodeHover(node.id)}
                   onMouseLeave={() => onNodeLeave(node.id)}
                   onContextMenu={(e)=>{
                       e.preventDefault();
                       onNodeRightClick(node.id);
                   }}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={nodeClass}></circle>
                    <image
                        x={node.coordinate.x - 25}
                        y={node.coordinate.y - 50}
                        width="50"
                        height="50"
                        href={"/src/images/MapFunctions/mapPinRed.png"}
                    ></image>

                </a>
            );
        }



        return (
            <a key={node.id} id={node.id} className={tagClass}
               onClick={() => markNodeOnClick(node.id)}
               onMouseOver={() => onNodeHover(node.id)}
               onMouseLeave={() => onNodeLeave(node.id)}
               onContextMenu={(e)=>{
                   e.preventDefault();
                   onNodeRightClick(node.id);
               }}
            >
                <circle cx={node.coordinate.x} cy={node.coordinate.y} className={nodeClass}></circle>
            </a>
        );
    }

    /**
     * Draw the info of a node when it is highlighted.
     * @param node the node to draw
     */
    function drawNodeInfo(node: Node) {
        /* make sure the graph and serviceRequest map exists before getting the nodes */
        if (graph == null || nodeIDtoServiceRequest == null) {
            return;
        }

        /* grab the node that is connected */
        const connectedNode = graph.idToNode(node.id);
        if (connectedNode == null || undefined) {
            console.error("could not find node " + node.id);
            return;
        }

        /* generate the edges for this node */
        let edgeConnections: string = " ";
        connectedNode!.edges.forEach((edge) => {
            edgeConnections += edge.endNode.id + ", ";
        });
        edgeConnections = edgeConnections.substring(0, edgeConnections.length - 2);

        /* draw the floating div */
        return drawNodeInfoHTML(node, connectedNode, edgeConnections);
    }

    /**
     * Return the actual div to render for drawNodeInfo
     * @param node the node to print info for
     * @param connectedNode the node adjacent to node
     * @param edgeConnections the edges connected to node
     */
    function drawNodeInfoHTML(node: Node, connectedNode: Node, edgeConnections: string) {
        return (
            <foreignObject key={"nodeInfo_" + node.id} id={"nodeInfo_" + node.id}
                           className={"foreignObjectNode"} x={node.coordinate.x + 20}
                           y={node.coordinate.y - 250}



            >
                    <span className={"spanNodeInfo"}
                          onMouseDown={(e)=>{e.stopPropagation(); }}
                    >
                        <ul className={"ulNodeinfo"}>
                            <li><b>ID: </b>{node.id}</li>
                            <li>
                                <b>Coordinate (x,y): </b>{"(" + node.coordinate.x.toString() + ","
                                + node.coordinate.y.toString() + ")"}
                            </li>
                            <li><b>Long name: </b>{node.longName}</li>
                            <li><b>Short name: </b>{node.shortName}</li>
                            <li><b>Type: </b>{node.nodeType}</li>
                            <li><b>Building: </b>{node.building}</li>
                            <li><b>Floor: </b>{node.floor}</li>
                            <li><b>Heuristic: </b>{connectedNode.heuristic.toPrecision(3)}</li>
                            <li><b>Connected to: </b>{edgeConnections}</li>
                        </ul>
                    </span>
            </foreignObject>
        );
    }


    function drawNodeServiceRequests(node: Node) {

        if (nodeIDtoServiceRequest.get(node.id) == undefined) {
            return;
        }
        //if no service requests dont draw anything expect skeliton so that the hover event still works
        if(nodeIDtoServiceRequest.get(node.id)!.length==0){
            return (
                <foreignObject key={"nodeService_" + node.id} id={"nodeService_" + node.id}
                               className={"foreignObjectNode"} x={0}
                               y={0}
                >
                    <span className={"spanNodeInfo"}>

                    </span>
                </foreignObject>
            );
        }

        return (
            <foreignObject key={"nodeService_" + node.id} id={"nodeService_" + node.id}
                           className={"foreignObjectNode"} x={node.coordinate.x - 420}
                           y={node.coordinate.y-250}

            >
                    <span className={"spanNodeInfo"}
                          onMouseDown={(e)=>{e.stopPropagation(); }}
                    >
                        <ul className={"ulNodeinfo"}>
                            <li><b>Service Requests</b></li>
                            {
                                nodeIDtoServiceRequest.get(node.id)?.map((request) => {
                                        return (
                                            <li>
                                                <ul className={"ulNodeRequestInfo"}>
                                                    <li><b>ID: </b>{request.reqID}</li>
                                                    <li><b>Type: </b>{request.reqType}</li>
                                                    <li><b>Status: </b>{request.status}</li>
                                                    <li><b>Priority: </b>{request.reqPriority}</li>
                                                    <li><b>Assigned User: </b>{request.assignedUName}</li>
                                                </ul>
                                            </li>
                                        );
                                    }
                                )

                            }
                        </ul>
                    </span>
            </foreignObject>
        );
    }


    function drawNodeLocationName(node: Node){
        if(drawEntirePathOptions[2] && drawEntirePath && node.nodeType!=NodeType.HALL){
            return (
                <foreignObject key={"nodeLongName_" + node.id} id={"nodeLongName_" + node.id}
                               className={"foreignObjectNodeLongName"}
                               x={node.coordinate.x+10} y={node.coordinate.y -10}
                >
                    <text className={"nodeLongNameText"}>{node.longName}</text>
                </foreignObject>

            );
        }
        return;
    }




    /**
     * Find out if a given node is a transition node.
     * @param nodeID string ID of node to check
     */
    function inTransition(nodeID: string) {

        for (let i: number = 0; i < pathFloorTransitions.length; i++) {
            if (pathFloorTransitions[i].startTranNode.id == nodeID ||
                pathFloorTransitions[i].endTranNode.id == nodeID) {
                return true;
            }
        }
        return false;
    }

    /**
     * Find out if a given node is in the drawn path.
     * @param nodeID string ID of node to check
     */
    function inPathDrawnEdges(nodeID: string) {

        for (let i: number = 0; i < pathDrawnEdges.length; i++) {
            if (pathDrawnEdges[i].startNode.id == nodeID ||
                pathDrawnEdges[i].endNode.id == nodeID) {
                return true;
            }
        }
        return false;
    }

    /**
     * Draw the text that says "Go to Floor {floor}" and "From Floor {floor}"
     * @param transition a Transition that holds the two nodes that we are transitioning between
     */
    function drawTransitionText(transition: Transition) {
        /* find the starting and ending floors */
        const floorStart = floorToNumber(transition!.startTranNode.floor);
        const floorEnd = floorToNumber(transition!.endTranNode.floor);

        /* define the style for the boxes */
        const style: TransitionTextStyle = {
            xTransform: -375,
            xTextTransform: -370,
            yTransform: -10,
            yTextTransform: 35,
            height: 60,
            width: 360,
        };

        /* if we're on the floor that pathfinding started on */
        if (floorStart == selectedFloorIndex) {
            return drawTransitionTextToHTML(transition.startTranNode, transition.endTranNode, style);
        }

        /* if we're on the floor that pathfinding ends on */
        else if (floorEnd == selectedFloorIndex) {
            return drawTransitionTextFromHTML(transition.startTranNode, transition.endTranNode, style);
        }


        return <a key={"error a tag"}>error: wrong floor</a>;
    }

    /**
     * Draw the text box containing the instruction of which floor you arrived from
     * @param startNode the starting node from pathfinding
     * @param endNode the ending node from pathfinding
     * @param style the struct containing the style information
     */
    function drawTransitionTextToHTML(startNode: Node, endNode: Node, style: TransitionTextStyle) {
        return (
            <a key={"transition_" + startNode.id}>
                <rect x={startNode.coordinate.x + style.xTransform}
                      y={startNode.coordinate.y + style.yTransform}
                      height={style.height}
                      width={style.width}
                      className={"floorLinkRect"}/>
                <text x={startNode.coordinate.x + style.xTextTransform}
                      y={startNode.coordinate.y + style.yTextTransform}
                      className={"floorLinkText"}>
                    {"Go to Floor " + endNode.floor}</text>
            </a>

        );
    }

    /**
     * Draw the text box containing the instruction of which floor you arrived from
     * @param startNode the starting node from pathfinding
     * @param endNode the ending node from pathfinding
     * @param style the struct containing the style information
     */
    function drawTransitionTextFromHTML(startNode: Node, endNode: Node, style: TransitionTextStyle) {
        return (
            <a key={"transition_" + startNode.id}>
                <rect x={endNode.coordinate.x + style.xTransform}
                      y={endNode.coordinate.y + style.yTransform}
                      height={style.height}
                      width={style.width}
                      className={"floorLinkRect"}/>
                <text x={endNode.coordinate.x + style.xTextTransform}
                      y={endNode.coordinate.y + style.yTextTransform}
                      className={"floorLinkText"}>
                    {"From Floor " + startNode.floor}</text>
            </a>
        );
    }

    /**
     * Set the specific map image based on the specified floor index.
     */
    function setMapImage(): string {
        switch (selectedFloorIndex) {
            case FloorToIndex.LowerLevel2:
                return "/src/images/maps/00_thelowerlevel2.png";
            case FloorToIndex.LowerLevel1:
                return "/src/images/maps/00_thelowerlevel1.png";
            case FloorToIndex.Ground:
                return "/src/images/maps/00_thegroundfloor.png";
            case FloorToIndex.Level1:
                return "/src/images/maps/01_thefirstfloor.png";
            case FloorToIndex.Level2:
                return "/src/images/maps/02_thesecondfloor.png";
            case FloorToIndex.Level3:
                return "/src/images/maps/03_thethirdfloor.png";
            default:
                return "/src/images/maps/00_thelowerlevel1.png";
        }
    }

    /**
     * Set the specific view box based on the specified floor index.
     */
    function setViewBoxForLevel(){
        switch (selectedFloorIndex) {
            case FloorToIndex.LowerLevel2:
                setViewbox({x:730, y:518,width:2719,height:2392});
                break;
            case FloorToIndex.LowerLevel1:
                setViewbox({x:704, y:348,width:2236,height:1967});
                break;
            case FloorToIndex.Ground:
                setViewbox({x:579, y:412,width:3161,height:2780});
                break;
            case FloorToIndex.Level1:
                setViewbox({x:579, y:412,width:3161,height:2780});
                break;
            case FloorToIndex.Level2:
                setViewbox({x:613, y:219,width:3129,height:2753});
                break;
            case FloorToIndex.Level3:
                setViewbox({x:474, y:493,width:2946,height:2591});
                break;
            default:
                setViewbox({x:474, y:493,width:2946,height:2591});
                break;
        }
    }

    /**
     * Initiate map viewbox panning.
     * @param event the mouse event that caused the panning
     */
    function startPan(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        setCurrentlyPanning(true);
        setStartOfClick({x: event.movementX, y: event.movementY});
    }

    /**
     * Transform the map's viewbox while it is panning.
     * @param event the mouse event that caused the panning
     */
    function whilePanning(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (currentlyPanning) {
            setEndOfClick({x: event.movementX, y: event.movementY});
            const movementX = ((startOfClick.x - endOfClick.x) / zoomScale) * panSpeed;
            const movementY = ((startOfClick.y - endOfClick.y) / zoomScale) * panSpeed;
            setViewbox({
                x: viewbox.x + movementX, y: viewbox.y + movementY,
                width: viewbox.width, height: viewbox.height
            });
        }
    }

    /**
     * Stop panning the map for a general mouse event.
     * @param event the mouse event that caused the map to stop panning
     */
    function stopPan(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (currentlyPanning) {
            whilePanning(event);
            setCurrentlyPanning(false);
        }
    }

    /**
     * Stop panning the map when the cursor leaves the area.
     */
    function leftMapArea() {
        setCurrentlyPanning(false);
    }

    /**
     * Formerly onNodeClick()
     *
     * This function fires when a node is clicked on the map.
     * if only one node is selected it turns that node green and notes the node as the starting node
     * if two nodes are selected it turn the newly selected node red (end node) and attempts to draw a path
     * between them
     * if another node is selected while a path is draw it clears the path then sets the newly selected node
     * as the start node.
     *
     * @param nodeClickedID - the id of the node clicked on the screen
     */
    function markNodeOnClick(nodeClickedID: string) {
        /* make sure the graph is ready */
        if (graph == null) {
            console.error("Graph has not been created yet");
            return;
        }

        /* look up the node that was clicked */
        const nodeClicked = graph.idToNode(nodeClickedID);
        if (nodeClicked == null) {
            console.error("Node " + nodeClickedID + " not found");
            return;
        }

        /* if no node has been selected so far, set the start node */
        if (startNode == NULLNODE && endNode == NULLNODE) {
            setStartNode(nodeClicked);
        }

        /* if just a start node has been selected, set the end node */
        else if (endNode == NULLNODE) {
            setEndNode(nodeClicked);
        }

        /* finally, if both nodes have already been selected, set a new start node and clear the end node */
        else {
            setStartNode(nodeClicked);
            setEndNode(NULLNODE);
        }
    }
}

/* Code is defined at the top of this file but runs here. */
createGraph().then(() => {
    getNodeServiceRequests().then();
});
