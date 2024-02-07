import axios from "axios";

import {FloorToIndex, Node} from "../../../../backend/src/algorithms/Graph/Node.ts";

import "../../css/component-css/Map.css";
import {Edge} from "../../../../backend/src/algorithms/Graph/Edge.ts";
import {Graph} from "../../../../backend/src/algorithms/Graph/Graph.ts";
//import {BFS} from "../../../../backend/src/algorithms/Search/BFS.ts";
import {onNodeHover, onNodeLeave,} from "../../event-logic/circleNodeEventHandlers.ts";
import {NodeDataBase, nodeDataBaseToNode,} from "../../../../backend/src/DataBaseClasses/NodeDataBase.ts";
import {EdgeDataBase, edgeDataBasetoEdge,} from "../../../../backend/src/DataBaseClasses/EdgeDataBase.ts";
import {Dispatch, SetStateAction} from "react";
import {AStar} from "../../../../backend/src/algorithms/Search/AStar.ts";
//import {Coordinate} from "../../../../backend/src/algorithms/Graph/Coordinate.ts";

/**
 * @param startNodeID the ID of the starting node to path find from
 * @param endNodeID the ID of the goal node
 *
 * Creates a path from startNode to endNode on the map if the path exists
 *
 */

//stores
let startNode: Node | null = null;
let endNode: Node | null = null;

//get graph from database
let graph: Graph | null = null;
//let pathCordnates:Array<Array<Coordinate>> = [];



/**
 * gets the nodes and edges for the map and creates the graph for searching.
 * */
async function updateGraph() {
    //load edges and node from database
    const edgesDB = await axios.get<EdgeDataBase[]>("/api/load-edges");
    const nodesDB = await axios.get<NodeDataBase[]>("/api/load-nodes");

    const edges: Array<Edge> = [];
    const nodes: Array<Node> = [];

    edgesDB.data.forEach((edgeDB) => {
        edges.push(edgeDataBasetoEdge(edgeDB));
    });

    nodesDB.data.forEach((nodeDB) => {
        nodes.push(nodeDataBaseToNode(nodeDB));
    });

    graph = new Graph(nodes, edges);
    console.log(graph.getEdges());
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
    if (startNode == null && endNode == null) {
        //set start node
        startNode = nodeClicked;
        //debug
        console.log("start selected");
        console.log(startNode);

        //change to start node css
        console.log(document.getElementById(nodeClickedID)?.children.item(0));
        document
            .getElementById(nodeClickedID)
            ?.children.item(0)
            ?.setAttribute("class", "startSelected");
    }
    //if start node has been selected
    else if (endNode == null) {
        //set end node
        endNode = nodeClicked;
        //debug
        console.log("end selected");
        console.log(endNode);
        //change node color to red
        console.log(document.getElementById(nodeClickedID)?.children.item(0));
        document
            .getElementById(nodeClickedID)
            ?.children.item(0)
            ?.setAttribute("class", "endSelected");

        //attempt to draw path (! asserts that start node is not null)
        makePath(startNode!, endNode);
    }
    //if both nodes were selected
    else {
        //change color of old nodes back to default
        document
            .getElementById(startNode?.id as string)
            ?.children.item(0)
            ?.setAttribute("class", "normalNode");
        document
            .getElementById(endNode?.id as string)
            ?.children.item(0)
            ?.setAttribute("class", "normalNode");

        //delete old path
        deletePath();

        //set new start node and clear end node
        startNode = nodeClicked;
        endNode = null;

        //change to start node css
        console.log(document.getElementById(nodeClickedID)?.children.item(0));
        document
            .getElementById(nodeClickedID)
            ?.children.item(0)
            ?.setAttribute("class", "startSelected");

        //debug
        console.log("new path requested");
        console.log(startNode);
        console.log(endNode);
    }
}

/**
 * helper function to delete the current path on the screen
 * */
function deletePath() {
    //get map element
    const map = document.getElementById("map");
    //get maps children
    const childrenOfMap = map?.children;
    if (childrenOfMap == undefined) {
        console.error("map has no children");
        return;
    }

    //for each child check if it is a line element if it is delete it
    for (let i = 0; i < childrenOfMap?.length; i++) {
        if (childrenOfMap.item(i)?.tagName == "line") {
            map?.removeChild(childrenOfMap.item(i)!);
            i--; // dont iterate to not miss elements
        }
    }
}

/**
 *
 * @param startNode - starting node obj of the path
 * @param endNode - end node / target node for the search
 *
 * helper function that does the bfs search to find a path between startNode and endNode.
 * once a path is found it draws lines between all the nodes in the path to show it to the user.
 *
 */
function makePath(startNode: Node, endNode: Node) {
    if (graph == null) {
        console.error("Graph has not been created yet - makepath");
        return;
    }

    //find path with bfs
    const path: Array<Node> | null = AStar(startNode, endNode, graph);

    //error is no path could be found
    if (path == null) {
        console.error(
            "no path could be found between " + startNode?.id + " and " + endNode?.id,
        );
        return;
    }

    //find svg map element
    const map = document.getElementById("map");

    //for each node in the path draw a line to the next node
    for (let i = 0; i < path.length - 1; i++) {
        //create new svg line obj
        const newLine = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line",
        );

        //get node at start of line and end of line
        const start = path.at(i) ?? null;
        const end = path.at(i + 1) ?? null;

        if (start == null || end == null) {
            console.error("a node is the path in null ");
            return;
        }

        //add node cordnates to the line obj
        newLine.setAttribute("class", "pathLine");
        //start node cordnates
        newLine.setAttribute("x1", start.coordinate.x.toString());
        newLine.setAttribute("y1", start.coordinate.y.toString());
        //end node cordnates
        newLine.setAttribute("x2", end.coordinate.x.toString());
        newLine.setAttribute("y2", end.coordinate.y.toString());
        if (map == null) {
            console.error("map html obj could not be fond");
            return;
        }
        //add line onto map
        map.appendChild(newLine);
    }
}




//todo move this to a new file -stryder
export interface MapStates{
    startNode:Node;
    setStartNode: Dispatch<SetStateAction<Node>>;
    endNode:Node;
    setEndNode: Dispatch<SetStateAction<Node>>;
    selectedFloorIndex:FloorToIndex;
    setSelectedFloorIndex: Dispatch<SetStateAction<FloorToIndex>>;
    drawPath:boolean;
    setDrawPath: Dispatch<SetStateAction<boolean>>;
    locations:Node[];
    setLocations:Dispatch<SetStateAction<Node[]>>;
}

export function Map({startNode:startNode,setStartNode:setStartNode,endNode:endNode,setEndNode:setEndNode
                        ,selectedFloorIndex:selectedFloorIndex,setSelectedFloorIndex:setSelectedFloorIndex,
                        drawPath:drawPath,setDrawPath:setDrawPath,
                        locations:locations, setLocations:setLocations}:MapStates) {

    //todo remove these
    console.log(startNode,setStartNode,endNode,setEndNode,selectedFloorIndex,setSelectedFloorIndex,drawPath,setDrawPath,setLocations);

    // if(drawPath){
    //
    // }


    //the html returned from the component
    return (
        <div id={"map-test"}>
            <svg
                id="map"
                className={"map-test"}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={setMapViewBox()}
            >
                <use xmlnsXlink="http://www.w3.org/1999/xlink"></use>
                <image
                    width="5000"
                    height="3400"
                    href={setMapImage()}
                ></image>
                {
                    /**
                     * creates the node objects on the map
                     * */
                    locations.map((node)=>{
                        return (
                            <a id={node.id} className={"clickableAtag"}
                               onClick={()=>onNodeClick(node.id)}
                               onMouseOver={()=> onNodeHover(node.id)}
                               onMouseLeave={()=> onNodeLeave(node.id)}
                            >
                                <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"normalNode"}></circle>
                            </a>
                        );
                    })


                }


            </svg>
        </div>
    );

    // {
    //     /**
    //      * draws the path on the current floor
    //      * */
    //     pathCordnates.map((lineCord)=>{
    //         return(
    //             <line className={""}></line>
    //         );
    //     })
    //
    // }

    /**
     * sets the maps image based on selectedFloorIndex
     * */
    function setMapImage():string{

        switch (selectedFloorIndex) {
            case FloorToIndex.LowerLevel2: return "/src/images/00_thelowerlevel2.png";
            case FloorToIndex.LowerLevel1: return "/src/images/00_thelowerlevel1.png";
            case FloorToIndex.Ground: return "/src/images/00_thegroundfloor.png";
            case FloorToIndex.Level1: return "/src/images/01_thefirstfloor.png";
            case FloorToIndex.Level2: return "/src/images/02_thesecondfloor.png";
            case FloorToIndex.Level3: return "/src/images/03_thethirdfloor.png";
            default: return "/src/images/00_thelowerlevel1.png";
        }

    }

    /**
     * sets the maps view box based on selectedFloorIndex
     * */
    function setMapViewBox():string{

        switch (selectedFloorIndex) {
            case FloorToIndex.LowerLevel2: return "940 490 3000 2700";
            case FloorToIndex.LowerLevel1: return "940 490 2160 1900";
            case FloorToIndex.Ground: return "500 0 5000 3400";
            case FloorToIndex.Level1: return "940 490 3000 2900";
            case FloorToIndex.Level2: return "940 290 3500 2900";
            case FloorToIndex.Level3: return "940 490 3000 2700";
            default: return "940 490 2160 1900";
        }

    }

    /**
     * sets the path to the path to be displaued on the page
     * */
    // function updatePath(){
    //
    //
    //
    //     //zero out the path
    //     pathCordnates = [];
    //
    //     if (graph == null) {
    //         console.error("Graph has not been created yet - makepath");
    //         return;
    //     }
    //
    //     //find path with bfs
    //     const rawpath: Array<Node> | null = BFS(startNode, endNode, graph);
    //
    //     //error is no path could be found
    //     if (rawpath == null) {
    //         console.error(
    //             "no path could be found between " + startNode?.id + " and " + endNode?.id,
    //         );
    //         return;
    //     }
    //
    //     //get path(s) on floor
    //
    //     const floorPaths :Array<Array<Node>> = [];
    //
    //     for (let i = 0; i < rawpath.length; i++) {
    //         const node = rawpath[i];
    //         if (floorToNumber(node.floor) == selectedFloorIndex) {
    //             pathCordnates.push();
    //         }
    //     }
    //
    //
    //
    // }



}

//code below runs on page load
updateGraph().then(() => {
    //makeNodes().then();
    //makePath("CCONF003L1", "CHALL014L1").then();
    //resetSelectedNodes();
});
