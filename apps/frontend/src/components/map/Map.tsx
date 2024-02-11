import axios from "axios";

import {FloorToIndex, floorToNumber, Node, NULLNODE} from "../../../../backend/src/algorithms/Graph/Node.ts";

import "../../css/component-css/Map.css";
import {Edge} from "../../../../backend/src/algorithms/Graph/Edge.ts";
import {Graph} from "../../../../backend/src/algorithms/Graph/Graph.ts";
import {onNodeHover, onNodeLeave,} from "../../event-logic/circleNodeEventHandlers.ts";
import {NodeDataBase, nodeDataBaseToNode,} from "../../../../backend/src/DataBaseClasses/NodeDataBase.ts";
import {EdgeDataBase, edgeDataBasetoEdge,} from "../../../../backend/src/DataBaseClasses/EdgeDataBase.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {AStar} from "../../../../backend/src/algorithms/Search/AStar.ts";


/**
 * @param startNodeID the ID of the starting node to path find from
 * @param endNodeID the ID of the goal node
 *
 * Creates a path from startNode to endNode on the map if the path exists
 *
 */



//get graph from database
let graph: Graph | null = null;



let veiwbox:Array<number> = [1040,590];



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
 * sets the path to the path to be displaued on the page
 * */
function updatePathEdges(startingNode:Node,
                         endingNode:Node,
                         setPathEdges:Dispatch<SetStateAction<Edge[]>>,
                         floorIndex:number,
                         drawAllEdges:boolean,
                         setPathFloorTransitionNodes:Dispatch<SetStateAction<Edge[]>>){

    if(startingNode == NULLNODE || endingNode == NULLNODE){
        setPathEdges([]);
        setPathFloorTransitionNodes([]);
        return;
    }

    if(drawAllEdges){
        //set all edges that start and end on this floor to be drawn
        const allFloorEdges:Array<Edge> = [];
        graph?.getEdges().forEach((edge)=>{
            if(floorToNumber(edge.startNode.floor) == floorIndex && floorToNumber(edge.endNode.floor) == floorIndex){
                allFloorEdges.push(edge);
            }
        });
        setPathEdges(allFloorEdges);
        return;
    }


    if (graph == null) {
        console.error("Graph has not been created yet - updatePathEdges");
        return;
    }


    //the nodes in startNode and endNode ARE NOT CONNECTED to any edge so we need to get the same connected ones in the graph
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
    const pathEdges:Array<Edge> =[];
    const pathTranistionEdges:Array<Edge> =[];

    for (let i = 0; i < rawpath.length -1; i++) {
        const start = rawpath.at(i) ?? null;
        const end = rawpath.at(i + 1) ?? null;

        //edge starts and ends on this floor
        if (floorToNumber(start!.floor) == floorIndex && floorToNumber(end!.floor) == floorIndex) {
            //find edge that connects start and end node and add it
            start!.edges.forEach((edge)=>{
                if(edge.endNode==end){
                    pathEdges.push(edge);
                }
            });
        }
        //one node of the edge in on the current floor
        else if (floorToNumber(start!.floor) == floorIndex || floorToNumber(end!.floor) == floorIndex){
            //find edge that connects start and end node and add it
            start!.edges.forEach((edge)=>{
                if(edge.endNode==end){
                    pathTranistionEdges.push(edge);
                }
            });
        }
    }
    console.log("edges on this floor");
    console.log(pathEdges);
    console.log("tranision edges on this floor");
    console.log(pathTranistionEdges);
    setPathFloorTransitionNodes(pathTranistionEdges);
    setPathEdges(pathEdges);

}



//todo move this to a new file -stryder
export interface MapStates{
    startNode:Node;
    setStartNode: Dispatch<SetStateAction<Node>>;
    endNode:Node;
    setEndNode: Dispatch<SetStateAction<Node>>;
    selectedFloorIndex:FloorToIndex;
    setSelectedFloorIndex: Dispatch<SetStateAction<FloorToIndex>>;
    drawEntirePath:boolean;
    setDrawEntirePath: Dispatch<SetStateAction<boolean>>;
    locations:Node[];
    setLocations:Dispatch<SetStateAction<Node[]>>;
}

export function Map({startNode:startNode,setStartNode:setStartNode,endNode:endNode,setEndNode:setEndNode
                        ,selectedFloorIndex:selectedFloorIndex,setSelectedFloorIndex:setSelectedFloorIndex,
                        drawEntirePath:drawEntirePath,setDrawEntirePath:setDrawEntirePath,
                        locations:locations, setLocations:setLocations}:MapStates) {

    //todo remove these
    console.log(setSelectedFloorIndex,setLocations);

    useEffect(() => {
        updatePathEdges(startNode,endNode,setPathDrawnEdges,selectedFloorIndex,drawEntirePath,setPathFloorTransitionEdges);
    }, [drawEntirePath, endNode, selectedFloorIndex, startNode]);
    const [pathDrawnEdges, setPathDrawnEdges] = useState<Array<Edge>>([]);
    const [pathFloorTransitionEdges, setPathFloorTransitionEdges] = useState<Array<Edge>>([]);

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

                <a className={"clickableAtag"} onClick={handleMapToggle}>
                    <circle cx={veiwbox[0]} cy={veiwbox[1]} r={100} fill={"blue"}>

                    </circle>
                    <text x={veiwbox[0]-50} y={veiwbox[1]+10} className={"heavy"}>ALL</text>
                </a>

                {
                    pathDrawnEdges.map((edge)=>{
                        return drawEdge(edge);

                        }
                    )

                }

                {
                    /**
                     * creates the node objects on the map
                     * */
                    locations.map((node)=>{
                        return drawNode(node);
                    })


                }


            </svg>
        </div>
    );

    function drawEdge(edge:Edge){
        if(drawEntirePath){
            return <line key={"line_"+edge.id} className={"pathLineAll"}
                         x1={edge.startNode.coordinate.x.toString()}
                         y1={edge.startNode.coordinate.y.toString()}
                         x2={edge.endNode.coordinate.x.toString()}
                         y2={edge.endNode.coordinate.y.toString()}></line>;


        }
        else{
            return <line key={"line_"+edge.id} className={"pathLine"}
                         x1={edge.startNode.coordinate.x.toString()}
                         y1={edge.startNode.coordinate.y.toString()}
                         x2={edge.endNode.coordinate.x.toString()}
                         y2={edge.endNode.coordinate.y.toString()}></line>;
        }
    }

    function drawNode(node:Node){

        if(node.id==startNode.id){
            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={()=> onNodeClick(node.id)}
                   onMouseOver={()=> onNodeHover(node.id)}
                   onMouseLeave={()=> onNodeLeave(node.id)}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"startSelected"}></circle>
                </a>
            );
        }
        else if(node.id==endNode.id){
            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={()=> onNodeClick(node.id)}
                   onMouseOver={()=> onNodeHover(node.id)}
                   onMouseLeave={()=> onNodeLeave(node.id)}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"endSelected"}></circle>
                </a>
            );
        }
        else if(inTranistionEdge(node.id)){
            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={()=> onNodeClick(node.id)}
                   onMouseOver={()=> onNodeHover(node.id)}
                   onMouseLeave={()=> onNodeLeave(node.id)}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"transitionNode"}></circle>
                </a>
            );
        }
        else{
            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={()=> onNodeClick(node.id)}
                   onMouseOver={()=> onNodeHover(node.id)}
                   onMouseLeave={()=> onNodeLeave(node.id)}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"normalNode"}></circle>
                </a>
            );
        }

    }

    function inTranistionEdge(nodeID:string){
        let isATranistionNode = false;
        pathFloorTransitionEdges.forEach((edge)=>{
            if(edge.startNode.id == nodeID || edge.endNode.id == nodeID){
                isATranistionNode=true;
            }
        });

        return isATranistionNode;
    }



    function handleMapToggle(){
        if(!drawEntirePath){
            setDrawEntirePath(true);
        }
        else{
            setDrawEntirePath(false);
        }
    }



    /**
     * sets the maps image based on selectedFloorIndex
     * */
    function setMapImage():string{

        switch (selectedFloorIndex) {
            case FloorToIndex.LowerLevel2:

                return "/src/images/00_thelowerlevel2.png";
            case FloorToIndex.LowerLevel1:

                return "/src/images/00_thelowerlevel1.png";
            case FloorToIndex.Ground:

                return "/src/images/00_thegroundfloor.png";
            case FloorToIndex.Level1:

                return "/src/images/01_thefirstfloor.png";
            case FloorToIndex.Level2:

                return "/src/images/02_thesecondfloor.png";
            case FloorToIndex.Level3:

                return "/src/images/03_thethirdfloor.png";
            default: return "/src/images/00_thelowerlevel1.png";
        }

    }

    /**
     * sets the maps view box based on selectedFloorIndex
     * */
    function setMapViewBox():string{

        switch (selectedFloorIndex) {
            case FloorToIndex.LowerLevel2:
                veiwbox = [1040,590];
                return "940 490 3000 2700";
            case FloorToIndex.LowerLevel1:
                veiwbox = [1040,590];
                return "940 490 2160 1900";
            case FloorToIndex.Ground:
                veiwbox = [600,100];
                return "500 0 5000 3400";
            case FloorToIndex.Level1:
                veiwbox = [1040,590];
                return "940 490 3000 2900";
            case FloorToIndex.Level2:
                veiwbox = [1040,390];
                return "940 290 3500 2900";
            case FloorToIndex.Level3:
                veiwbox = [1040,590];
                return "940 490 3000 2700";
            default: return "940 490 2160 1900";
        }

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

//code below runs on page load
updateGraph().then(() => {
    //makeNodes().then();
    //makePath("CCONF003L1", "CHALL014L1").then();
    //resetSelectedNodes();
});
