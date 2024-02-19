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

/* - - - global variables - - - */
let graph: Graph | null = null;
const panSpeed: number = 2;
const zoomSpeed: number = 0.1;

/* - - - functions - - - */
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
        // console.error("Graph has not been created yet, but updatePathEdges was called");
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

                /* ROFLMAO */
                i++;
            }

            /* we found the transition 😻 */
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

                /* ROFLMAO 2 */
                i++;
            }

            /* we found the transition 😻 */
            i = startingI; //go back to starting i to avoid recalculations
            pathTransitions.push(newTransition);
        }
    }

    /* caught gooning in 3840x2160 */
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
export function Map({
                        startNode: startNode, setStartNode: setStartNode,
                        endNode: endNode, setEndNode: setEndNode,
                        selectedFloorIndex: selectedFloorIndex,
                        drawEntirePath: drawEntirePath, locations: locations,
                        viewbox: viewbox, setViewbox: setViewbox,
                        zoomScale: zoomScale, setZoomScale: setZoomScale
                    }: MapState) {

    /* when the page updates, update the edges */
    useEffect(() => {
        updatePathEdges(startNode, endNode, setPathDrawnEdges, selectedFloorIndex, drawEntirePath, setPathFloorTransitions);
    }, [drawEntirePath, endNode, selectedFloorIndex, startNode]);

    /* some bs useStates */
    const [pathDrawnEdges, setPathDrawnEdges] = useState<Array<Edge>>([]);
    const [pathFloorTransitions, setPathFloorTransitions] =
        useState<Array<Transition>>([]);
    const [currentlyPanning, setCurrentlyPanning] =
        useState(false);
    const [startOfClick, setStartOfClick] =
        useState<Coordinate>({x: 0, y: 0});
    const [endOfClick, setEndOfClick] =
        useState<Coordinate>({x: 0, y: 0});

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

    /* THE THING YOU SEE */
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
                    locations.map((node) => {
                        return drawNode(node);
                    })
                }
                {   /* draw the hover node info on the map */
                    locations.map((node) => {
                        return drawNodeInfo(node);
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
            return drawNodeHTML(node, tag, "normalNode");
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
        return (
            <a key={node.id} id={node.id} className={tagClass}
               onClick={() => markNodeOnClick(node.id)}
               onMouseOver={() => onNodeHover(node.id)}
               onMouseLeave={() => onNodeLeave(node.id)}
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
            return drawTransitionTextToHTML(transition.startTranNode, transition.endTranNode, style);
        }

        /* if we're on the floor that pathfinding ends on */
        else if (floorEnd == selectedFloorIndex) {
            return drawTransitionTextFromHTML(transition.startTranNode, transition.endTranNode, style);
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
    //makeNodes().then();
    //makePath("CCONF003L1", "CHALL014L1").then();
    //resetSelectedNodes();
});