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

/**
 * @param startNodeID the ID of the starting node to path find from
 * @param endNodeID the ID of the goal node
 *
 * Creates a path from startNode to endNode on the map if the path exists
 *
 */

//get graph from database
let graph: Graph | null = null;
const panSpeed: number = 2;
const zoomSpeed: number = 0.1;

/**
 * gets the nodes and edges for the map and creates the graph for searching.
 */
async function updateGraph() {
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

    /* generate a graph from the data */
    graph = new Graph(nodes, edges);
    // console.log(graph.getEdges());
}

function createZoomEvent(viewbox: { x: number, y: number, width: number, height: number },
                         setViewbox: Dispatch<{ x: number, y: number, width: number, height: number }>,
                         setScale: Dispatch<number>) {

    const svgElement = document.getElementById("map")!;
    const svgSize: { width: number, height: number } = {width: svgElement.clientWidth, height: svgElement.clientHeight};


    document.getElementById("map-test")!.addEventListener("wheel", event => {
        event.preventDefault();
        const mouseX = event.offsetX; //in relation to the Div
        const mouseY = event.offsetY;
        //console.log("hihihhi");
        //console.log(mouseX,mouseY);
        const zoomAmount = event.deltaY;//how far was the wheel scrolled up/down in pixels
        const inverseZoomAmount = -zoomAmount;

        //calculate change in width and height of the box based on zoom direction
        /* zoomAmount negated to follow conventional scrolling */
        const changeInWidth = viewbox.width * Math.sign(inverseZoomAmount) * zoomSpeed;
        const changeInHeight = viewbox.height * Math.sign(inverseZoomAmount) * zoomSpeed;

        //keep mouse in the center of the zoom and get new x and y
        const newX = viewbox.x + (changeInWidth * mouseX) / svgSize.width;
        const newY = viewbox.y + (changeInHeight * mouseY) / svgSize.height;

        //set scale for proper panning
        setScale(svgSize.width / viewbox.width);
        //set new viewbox
        setViewbox({
            x: newX, y: newY,
            width: viewbox.width - changeInWidth, height: viewbox.height - changeInHeight
        });
    });
}

/**
 * sets the path to the path to be displayed on the page
 * */
function updatePathEdges(startingNode: Node,
                         endingNode: Node,
                         setPathEdges: Dispatch<SetStateAction<Edge[]>>,
                         floorIndex: number,
                         drawAllEdges: boolean,
                         setPathFloorTransitionNodes: Dispatch<Array<{ startTranNode: Node, endTranNode: Node }>>) {

    if (drawAllEdges) {
        //set all edges that start and end on this floor to be drawn
        const allFloorEdges: Array<Edge> = [];
        graph?.getEdges().forEach((edge) => {
            if (floorToNumber(edge.startNode.floor) == floorIndex && floorToNumber(edge.endNode.floor) == floorIndex) {
                allFloorEdges.push(edge);
            }
        });
        setPathEdges(allFloorEdges);
        return;
    }

    if (startingNode == NULLNODE || endingNode == NULLNODE) {
        setPathEdges([]);
        setPathFloorTransitionNodes([]);
        return;
    }

    if (graph == null) {
        console.error("Graph has not been created yet - updatePathEdges");
        return;
    }

    //the nodes in startNode and endNode ARE NOT CONNECTED to any edge, so we need to get the same connected ones in the graph
    console.log("THIS IS START");
    console.log(startingNode);
    console.log("THIS IS END");
    console.log(endingNode);

    //find path with bfs
    const rawpath: Array<Node> | null = AStar(graph.idToNode(startingNode.id), graph.idToNode(endingNode.id), graph);
    console.log("rawpath");
    console.log(rawpath);

    //error is no path could be found
    if (rawpath == null) {
        console.error(
            "no path could be found between " + startingNode?.id + " and " + endingNode?.id,
        );
        return;
    }

    //get path on this floor
    const pathEdges: Array<Edge> = [];
    const pathTransitions: Array<{ startTranNode: Node, endTranNode: Node }> = [];

    for (let i = 0; i < rawpath.length - 1; i++) {
        const start = rawpath.at(i)!;
        const end = rawpath.at(i + 1)!;

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
            const newTransition: { startTranNode: Node, endTranNode: Node } = {startTranNode: start, endTranNode: end};

            let currentNode = end;

            while (i < rawpath.length - 2) {
                currentNode = rawpath.at(i + 1)!;
                const nextNode = rawpath.at(i + 2)!;
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
            const newTransition: { startTranNode: Node, endTranNode: Node } = {startTranNode: start, endTranNode: end};

            let currentNode = start;
            const startingI = i;

            while (i > 0) {
                currentNode = rawpath.at(i)!;
                const prevNode = rawpath.at(i - 1)!;
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
    console.log("edges on this floor");
    console.log(pathEdges);
    console.log("transitions on this floor");
    console.log(pathTransitions);
    setPathFloorTransitionNodes(pathTransitions);
    setPathEdges(pathEdges);

}

export interface MapStates {
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
    viewbox: { x: number, y: number, width: number, height: number },
    setViewbox: Dispatch<SetStateAction<{ x: number, y: number, width: number, height: number }>>
    zoomScale: number,
    setZoomScale: Dispatch<SetStateAction<number>>
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
        useState<Array<{ startTranNode: Node, endTranNode: Node }>>([]);


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
        //create event lisenter in raw js for zoom as reacts onWheel React event does not allow the preventDefault() option
        // to work, reacts dev solution was "just use non react event lisensers"
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
                    pathFloorTransitions.map((tranistion) => {
                        return drawTransitionText(tranistion);
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
                   onClick={() => onNodeClick(node.id)}
                   onMouseOver={() => onNodeHover(node.id)}
                   onMouseLeave={() => onNodeLeave(node.id)}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"startSelected"}></circle>
                </a>
            );
        } else if (node.id == endNode.id) {
            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={() => onNodeClick(node.id)}
                   onMouseOver={() => onNodeHover(node.id)}
                   onMouseLeave={() => onNodeLeave(node.id)}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"endSelected"}></circle>
                </a>
            );
        } else if (inTransition(node.id)) {

            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={() => onNodeClick(node.id)}
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
                   onClick={() => onNodeClick(node.id)}
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
                   onClick={() => onNodeClick(node.id)}
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

    function drawTransitionText(transition: { startTranNode: Node, endTranNode: Node }) {

        const floorStart = floorToNumber(transition!.startTranNode.floor);
        const floorEnd = floorToNumber(transition!.endTranNode.floor);

        const xTransform = -225;
        const xTextTransform = -220;
        const yTransform = -10;
        const yTextTransform = 35;
        const height = 60;
        const width = 210;

        if (floorStart == selectedFloorIndex) {
            return (
                <a key={"transition_" + transition.startTranNode.id}>
                    <rect x={transition.startTranNode.coordinate.x + xTransform}
                          y={transition.startTranNode.coordinate.y + yTransform} height={height}
                          width={width}
                          className={"floorLinkRect"}/>
                    <text x={transition.startTranNode.coordinate.x + xTextTransform}
                          y={transition.startTranNode.coordinate.y + yTextTransform}
                          className={"floorLinkText"}>
                        {"Go to " + transition!.endTranNode.floor}</text>
                </a>

            );
        } else if (floorEnd == selectedFloorIndex) {
            return (
                <a key={"transition_" + transition.startTranNode.id}>
                    <rect x={transition.endTranNode.coordinate.x + xTransform}
                          y={transition.endTranNode.coordinate.y + yTransform} height={height}
                          width={width}
                          className={"floorLinkRect"}/>
                    <text x={transition.endTranNode.coordinate.x + xTextTransform}
                          y={transition.endTranNode.coordinate.y + yTextTransform}
                          className={"floorLinkText"}>
                        {"From " + transition!.startTranNode.floor}</text>
                </a>

            );
        }

        return <a>error</a>;

    }


    /**
     * sets the maps image based on selectedFloorIndex
     * */
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

    function leftMapArea() {
        setCurrentlyPanning(false);
    }

    /**
     * @param nodeClickedID - the id of the node clicked on the screen
     *
     * This function fires when a node is clicked on the map.
     * if only one node is selected it turns that node green and notes the node as the starting node
     * if two nodes are selected it turn the newly selected node red (end node) and attempts to draw a path
     * between them
     * if another node is selected while a path is draw it clears the path then sets the newly selected node
     * as the start node.
     *
     */
    function onNodeClick(nodeClickedID: string) {
        //find node obj in graph
        const nodeClicked = graph?.idToNode(nodeClickedID);

        if (nodeClicked == null) {
            console.error("Graph has not been created yet");
            return;
        }

        //if no nodes selected
        if (startNode == NULLNODE && endNode == NULLNODE) {
            //set start node
            setStartNode(nodeClicked);
            //debug
            console.log("start selected");
            console.log(startNode);
        }
        //if start node has been selected
        else if (endNode == NULLNODE) {
            //set end node
            setEndNode(nodeClicked);
            //debug
            console.log("end selected");
            console.log(endNode);

        }
        //if both nodes were selected
        else {

            //set new start node and clear end node
            setStartNode(nodeClicked);
            setEndNode(NULLNODE);

            console.log("new path requested");
            console.log(startNode);
            console.log(endNode);
        }
    }
}

/* Code is defined at the top of this file but runs here.*/
updateGraph().then(() => {
    //makeNodes().then();
    //makePath("CCONF003L1", "CHALL014L1").then();
    //resetSelectedNodes();
});
