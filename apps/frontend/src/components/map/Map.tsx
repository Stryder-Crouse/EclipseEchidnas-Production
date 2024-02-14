import axios from "axios";

import {FloorToIndex, floorToNumber, Node, NULLNODE} from "../../../../backend/src/algorithms/Graph/Node.ts";

import "../../css/component-css/Map.css";
import {Edge, NULLEDGE} from "../../../../backend/src/algorithms/Graph/Edge.ts";
import {Graph} from "../../../../backend/src/algorithms/Graph/Graph.ts";
import {onNodeHover, onNodeLeave,} from "../../event-logic/circleNodeEventHandlers.ts";
import {NodeDataBase, nodeDataBaseToNode,} from "../../../../backend/src/DataBaseClasses/NodeDataBase.ts";
import {EdgeDataBase, edgeDataBasetoEdge,} from "../../../../backend/src/DataBaseClasses/EdgeDataBase.ts";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {AStar} from "../../../../backend/src/algorithms/Search/AStar.ts";
import {Coordinate} from "../../../../backend/src/algorithms/Graph/Coordinate.ts";

export type MapStates = {
    startNode: Node;
    setStartNode: Dispatch<SetStateAction<Node>>;
    endNode: Node;
    setEndNode: Dispatch<SetStateAction<Node>>;
    selectedFloorIndex: FloorToIndex;
    setSelectedFloorIndex: Dispatch<SetStateAction<FloorToIndex>>;
    drawEntirePath: boolean;
    setDrawEntirePath: Dispatch<SetStateAction<boolean>>;
    locations: Node[];
    setLocations: Dispatch<SetStateAction<Node[]>>;
    viewbox: Viewbox,
    setViewbox: Dispatch<SetStateAction<Viewbox>>;
    zoomScale: number,
    setZoomScale: Dispatch<SetStateAction<number>>
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

/** global variables */
let graph: Graph | null = null;
const panSpeed: number = 2;
const zoomSpeed: number = 0.1;

/**
 * Create the global graph from nodes and edges gathered from the database.
 */
async function createGraph() {
    /* ask axios for nodes and edges */
    const edgesDB = await axios.get<EdgeDataBase[]>("/api/load-edges");
    const nodesDB = await axios.get<NodeDataBase[]>("/api/load-nodes");

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

/**
 * Enable zoom with MAGIC (a mouse event)
 * @param viewbox a Viewbox that holds coordinate information
 * @param setViewbox a Dispatch that transforms the coordinate information
 * @param setScale a Dispatch that sets the map scale
 */
function createZoomEvent(viewbox: Viewbox, setViewbox: Dispatch<Viewbox>, setScale: Dispatch<number>) {
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
                         setPathFloorTransitionNodes: Dispatch<Array<Transition>>) {

    /* actually first: check if the graph is ready */
    if (graph == null) {
        console.error("Graph has not been created yet - updatePathEdges");
        return;
    }

    /* first, check if we want to draw EVERY edge (for Wong) */
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
    // TODO: select between three search algorithms: a*, bfs, dfs
    const rawPath: Array<Node> | null = AStar(graph.idToNode(startingNode.id), graph.idToNode(endingNode.id), graph);
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

    for (let i = 0; i < rawPath.length - 1; i++) {
        const start = rawPath.at(i)!;
        const end = rawPath.at(i + 1)!;

        //edge starts and ends on this floor
        if (floorToNumber(start!.floor) == floorIndex && floorToNumber(end!.floor) == floorIndex) {
            //find edge that connects start and end node and add it
            start!.edges.forEach((edge) => {
                if (edge.endNode == end) {
                    pathEdges.push(edge);
                }
            });
        }
        //if edge leaves the current floor
        else if (floorToNumber(start!.floor) == floorIndex) {
            //go forwards to find the transition node it ends at
            const newTransition: Transition = {startTranNode: start, endTranNode: end};

            let currentNode = end;

            while (i < rawPath.length - 2) {
                currentNode = rawPath.at(i + 1)!;
                const nextNode = rawPath.at(i + 2)!;
                let connectingEdge: Edge = {endNode: end, id: "BAD", startNode: start, weight: 0};
                //find edge to next node in transition
                currentNode!.edges.forEach((edge) => {
                    if (edge.endNode == nextNode) {
                        connectingEdge = edge;
                    }
                });
                if (connectingEdge == NULLEDGE) {
                    console.error("connecting edge not found");
                    break;
                }

                //if edge has a floor transition weight then keep going if not break;
                if (connectingEdge.weight == Graph.getElevatorAndStairsEdgeWeight()) {
                    newTransition.endTranNode = nextNode;
                } else {
                    break;
                }

                i++;
            }
            pathTransitions.push(newTransition);
        }
        //if edge ends at current floor
        else if (floorToNumber(end!.floor) == floorIndex) {
            //go backwards to find the transition node it started from
            const newTransition: Transition = {startTranNode: start, endTranNode: end};

            let currentNode = start;
            const startingI = i;

            while (i > 0) {
                currentNode = rawPath.at(i)!;
                const prevNode = rawPath.at(i - 1)!;
                let connectingEdge: Edge = NULLEDGE;
                //find edge to next node in transition
                currentNode!.edges.forEach((edge) => {
                    if (edge.endNode == prevNode) {
                        connectingEdge = edge;
                    }
                });
                if (connectingEdge == NULLEDGE) {
                    console.error("connecting edge not found");
                    break;
                }

                //if edge has a floor transition weight then keep going if not break;
                if (connectingEdge.weight == Graph.getElevatorAndStairsEdgeWeight()) {
                    newTransition.startTranNode = prevNode;
                } else {
                    break;
                }

                i++;
            }

            //go back to starting i to avoid recalculations
            i = startingI;

            pathTransitions.push(newTransition);
        }
    }
    return {edges:pathEdges, transitions:pathTransitions};
}


export function Map({
                        startNode: startNode, setStartNode: setStartNode,
                        endNode: endNode, setEndNode: setEndNode,
                        selectedFloorIndex: selectedFloorIndex, drawEntirePath: drawEntirePath,
                        locations: locations, viewbox: viewbox, setViewbox: setViewbox, zoomScale: zoomScale,
                        setZoomScale: setZoomScale
                    }: MapStates) {

    /* when the page updates, update the edges */
    useEffect(() => {
        updatePathEdges(startNode, endNode, setPathDrawnEdges, selectedFloorIndex, drawEntirePath, setPathFloorTransitions);
    }, [drawEntirePath, endNode, selectedFloorIndex, startNode]);

    /* some bs useStates */
    const [pathDrawnEdges, setPathDrawnEdges] = useState<Array<Edge>>([]);
    const [pathFloorTransitions, setPathFloorTransitions] =
        useState<Array<Transition>>([]);


    //panStates
    const [currentlyPanning, setCurrentlyPanning] =
        useState(false);
    const [startOfClick, setStartOfClick] =
        useState<Coordinate>({x: 0, y: 0});
    const [endOfClick, setEndOfClick] =
        useState<Coordinate>({x: 0, y: 0});
    // let endOfClick:Coordinate = {x:0,y:0};
    // let startOfClick:Coordinate = {x:0,y:0};
    // let scale:number =1;

    useEffect(() => {
        //create event listener in raw js for zoom as reacts onWheel React event does not allow the preventDefault() option
        // to work, reacts dev solution was "just use non react event listeners"
        createZoomEvent(viewbox, setViewbox, setZoomScale);

    }, [setViewbox, setZoomScale, viewbox, zoomScale]);


    //the html returned from the component
    return (
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
            <svg
                id="map"
                className={"map-test"}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={viewbox.x.toString() + " " + viewbox.y.toString() +
                    " " + viewbox.width.toString() + " " + viewbox.height.toString()}
            >
                <use xmlnsXlink="http://www.w3.org/1999/xlink"></use>
                <image
                    width="5000"
                    height="3400"
                    href={setMapImage()}
                ></image>

                {
                    pathDrawnEdges.map((edge) => {
                        return drawEdge(edge);

                    })
                }
                {
                    /**
                     * creates the node objects on the map
                     * */
                    locations.map((node) => {
                        return drawNode(node);
                    })
                }
                {
                    locations.map((node) => {
                        return drawNodeInfo(node);
                    })
                }
                {
                    pathFloorTransitions.map((transition) => {
                        return drawTransitionText(transition);
                    })
                }


            </svg>
        </div>
    );

    function drawEdge(edge: Edge) {
        if (drawEntirePath) {
            return <line key={"line_" + edge.id} className={"pathLineAll"}
                         x1={edge.startNode.coordinate.x.toString()}
                         y1={edge.startNode.coordinate.y.toString()}
                         x2={edge.endNode.coordinate.x.toString()}
                         y2={edge.endNode.coordinate.y.toString()}></line>;


        } else {
            return <line key={"line_" + edge.id} className={"pathLine"}
                         x1={edge.startNode.coordinate.x.toString()}
                         y1={edge.startNode.coordinate.y.toString()}
                         x2={edge.endNode.coordinate.x.toString()}
                         y2={edge.endNode.coordinate.y.toString()}></line>;
        }
    }

    function drawNode(node: Node) {
        if (node.id == startNode.id) {
            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={() => markNodeOnClick(node.id)}
                   onMouseOver={() => onNodeHover(node.id)}
                   onMouseLeave={() => onNodeLeave(node.id)}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"startSelected"}></circle>
                </a>
            );
        } else if (node.id == endNode.id) {
            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={() => markNodeOnClick(node.id)}
                   onMouseOver={() => onNodeHover(node.id)}
                   onMouseLeave={() => onNodeLeave(node.id)}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"endSelected"}></circle>
                </a>
            );
        } else if (inTransition(node.id)) {

            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={() => markNodeOnClick(node.id)}
                   onMouseOver={() => onNodeHover(node.id)}
                   onMouseLeave={() => onNodeLeave(node.id)}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"transitionNode"}></circle>
                </a>
            );
        } else if (drawEntirePath) {
            // const height = 30;
            // const width = node.longName.length*12.5+10;
            //
            // const xTranform = -width/2;
            // const xTextTranform = -width/2+5;
            // const yTranform = +15;
            // const yTextTranform = 35;

            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={() => markNodeOnClick(node.id)}
                   onMouseOver={() => onNodeHover(node.id)}
                   onMouseLeave={() => onNodeLeave(node.id)}
                >
                    {/* removed some code here */}
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"normalNode"}></circle>
                </a>
            );
        } else {

            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={() => markNodeOnClick(node.id)}
                   onMouseOver={() => onNodeHover(node.id)}
                   onMouseLeave={() => onNodeLeave(node.id)}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"normalNode"}></circle>
                </a>
            );
        }

    }

    /**
     * Draw the info of a node when it is highlighted.
     * @param node
     */
    function drawNodeInfo(node: Node) {
        /* make sure the graph exists before getting the nodes */
        if (graph == null) {
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
        return drawNodeGraphic(node, connectedNode, edgeConnections);
    }

    function drawNodeGraphic(node: Node, connectedNode: Node, edgeConnections: string) {
        return (
            <foreignObject key={"nodeInfo_" + node.id} id={"nodeInfo_" + node.id}
                           className={"foreignObjectNode"} x={node.coordinate.x + 20} y={node.coordinate.y - 250}
            >
                    <span className={"spanNodeInfo"}>
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

    /**
     * Find out if a given node is a transition node.
     * @param nodeID string ID of node to check
     */
    function inTransition(nodeID: string) {
        /* funny */
        for (let i: number = 0; i < pathFloorTransitions.length; i++) {
            if (pathFloorTransitions[i].startTranNode.id == nodeID ||
                pathFloorTransitions[i].endTranNode.id == nodeID) {
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
            return drawTransitionTextTo(transition.startTranNode, transition.endTranNode, style);
        }

        /* if we're on the floor that pathfinding ends on */
        else if (floorEnd == selectedFloorIndex) {
            return drawTransitionTextFrom(transition.startTranNode, transition.endTranNode, style);
        }

        /* LOL */
        return <a key={"error a tag"}>error: wrong floor</a>;
    }

    /**
     * Draw the text box containing the instruction of which floor you arrived from
     * @param startNode the starting node from pathfinding
     * @param endNode the ending node from pathfinding
     * @param style the struct containing the style information
     */
    function drawTransitionTextTo(startNode: Node, endNode: Node, style: TransitionTextStyle) {
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
    function drawTransitionTextFrom(startNode: Node, endNode: Node, style: TransitionTextStyle) {
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

    function startPan(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        setCurrentlyPanning(true);
        setStartOfClick({x: event.movementX, y: event.movementY});
        //console.log("start");
        //console.log(startOfClick);
    }

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

    function stopPan(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (currentlyPanning) {
            setEndOfClick({x: event.movementX, y: event.movementY});
            //console.log("start");
            //console.log(endOfClick);
            const movementX = ((startOfClick.x - endOfClick.x) / zoomScale) * panSpeed;
            const movementY = ((startOfClick.y - endOfClick.y) / zoomScale) * panSpeed;
            setViewbox({
                x: viewbox.x + movementX, y: viewbox.y + movementY,
                width: viewbox.width, height: viewbox.height
            });
            setCurrentlyPanning(false);
            // console.log("stoped pan");
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
    //makeNodes().then();
    //makePath("CCONF003L1", "CHALL014L1").then();
    //resetSelectedNodes();
});
