import axios from "axios";

import {FloorToIndex, floorToNumber, Node, NULLNODE} from "../../../../backend/src/algorithms/Graph/Node.ts";

import "../../css/component-css/Map.css";
import {Edge, NULLEDGE} from "../../../../backend/src/algorithms/Graph/Edge.ts";
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
                         setPathFloorTransitionNodes:Dispatch<Array<{startTranNode:Node, endTranNode:Node} >>){

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


    if(startingNode == NULLNODE || endingNode == NULLNODE){
        setPathEdges([]);
        setPathFloorTransitionNodes([]);
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
    const pathTranistions:Array<{startTranNode:Node, endTranNode:Node} > =[];

    for (let i = 0; i < rawpath.length -1; i++) {
        const start = rawpath.at(i)!;
        const end = rawpath.at(i + 1)!;

        //edge starts and ends on this floor
        if (floorToNumber(start!.floor) == floorIndex && floorToNumber(end!.floor) == floorIndex) {
            //find edge that connects start and end node and add it
            start!.edges.forEach((edge)=>{
                if(edge.endNode==end){
                    pathEdges.push(edge);
                }
            });
        }
        //if edge leaves the current floor
        else if (floorToNumber(start!.floor) == floorIndex){
            //go forwards to find the tranistion node it ends at
            const newTranistion:{startTranNode:Node, endTranNode:Node} = {startTranNode:start, endTranNode:end};

            let currentNode = end;

            while( i < rawpath.length -2){
                currentNode = rawpath.at(i + 1)!;
                const nextNode = rawpath.at(i + 2)!;
                let connectingEdge:Edge = {endNode: end, id: "BAD", startNode: start, weight: 0};
                //find edge to next node in tranistion
                currentNode!.edges.forEach((edge)=>{
                    if(edge.endNode==nextNode){
                        connectingEdge=edge;
                    }
                });
                if(connectingEdge==NULLEDGE){
                    console.error("connecting edge not found");
                    break;
                }

                //if edge has a floor tranistion weight then keep going if not break;
                if(connectingEdge.weight==Graph.getElevatorAndStairsEdgeWeight()){
                    newTranistion.endTranNode = nextNode;
                }
                else{
                    break;
                }

                i++;
            }


            pathTranistions.push(newTranistion);
        }
        //if edge ends at current floor
        else if(floorToNumber(end!.floor) == floorIndex){
            //go backwards to find the tranistion node it started from
            const newTranistion:{startTranNode:Node, endTranNode:Node} = {startTranNode:start, endTranNode:end};

            let currentNode = start;
            const startingI=i;

            while( i > 0){
                currentNode = rawpath.at(i)!;
                const prevNode = rawpath.at(i - 1)!;
                let connectingEdge:Edge = NULLEDGE;
                //find edge to next node in tranistion
                currentNode!.edges.forEach((edge)=>{
                    if(edge.endNode==prevNode){
                        connectingEdge=edge;
                    }
                });
                if(connectingEdge==NULLEDGE){
                    console.error("connecting edge not found");
                    break;
                }

                //if edge has a floor tranistion weight then keep going if not break;
                if(connectingEdge.weight==Graph.getElevatorAndStairsEdgeWeight()){
                    newTranistion.startTranNode = prevNode;
                }
                else{
                    break;
                }

                i++;
            }

            //go back to starting i to advoid recaluations
            i=startingI;

            pathTranistions.push(newTranistion);
        }
    }
    console.log("edges on this floor");
    console.log(pathEdges);
    console.log("tranisions on this floor");
    console.log(pathTranistions);
    setPathFloorTransitionNodes(pathTranistions);
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
        updatePathEdges(startNode,endNode,setPathDrawnEdges,selectedFloorIndex,drawEntirePath,setPathFloorTransitions);
    }, [drawEntirePath, endNode, selectedFloorIndex, startNode]);
    const [pathDrawnEdges, setPathDrawnEdges] = useState<Array<Edge>>([]);
    const [pathFloorTransitions, setPathFloorTransitions] =
        useState<Array<{startTranNode:Node, endTranNode:Node} >>([]);

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
                {
                    pathFloorTransitions.map((tranistion)=>{
                        return drawTranistionText(tranistion);
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
        else if(inTranistion(node.id)){

            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={() => onNodeClick(node.id)}
                   onMouseOver={() => onNodeHover(node.id)}
                   onMouseLeave={() => onNodeLeave(node.id)}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"transitionNode"}></circle>
                </a>
            );
        }
        else if(drawEntirePath){

            const height = 30;
            const width = node.longName.length*12.5+10;

            const xTranform = -width/2;
            const xTextTranform = -width/2+5;
            const yTranform = +15;
            const yTextTranform = 35;


            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={() => onNodeClick(node.id)}
                   onMouseOver={() => onNodeHover(node.id)}
                   onMouseLeave={() => onNodeLeave(node.id)}
                >
                    {/* todo maybe remove this text it looks bad and i think the other info show statifies the requerment*/}
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"normalNode"}></circle>
                    <rect x={node.coordinate.x + xTranform}
                          y={node.coordinate.y + yTranform} height={height}
                          width={width}
                          className={"floorLinkRect"}/>
                    <text x={node.coordinate.x + xTextTranform}
                          y={node.coordinate.y + yTextTranform}
                          className={"showAllText"}>
                        {node.longName}</text>
                </a>
            );
        }
        else {
            return (
                <a key={node.id} id={node.id} className={"clickableAtag"}
                   onClick={() => onNodeClick(node.id)}
                   onMouseOver={()=> onNodeHover(node.id)}
                   onMouseLeave={()=> onNodeLeave(node.id)}
                >
                    <circle cx={node.coordinate.x} cy={node.coordinate.y} className={"normalNode"}></circle>
                    <span className={"spanNodeInfo"}> HIIIIIII </span>
                </a>
            );
        }

    }

    function inTranistion(nodeID:string){
        let isATranistionNode = false;
        pathFloorTransitions.forEach((tranistion)=>{
            if(tranistion.startTranNode.id == nodeID || tranistion.endTranNode.id == nodeID){
                isATranistionNode=true;
            }
        });

        return isATranistionNode;
    }


    function drawTranistionText(tranistion:{startTranNode:Node, endTranNode:Node}){

        const floorStart =floorToNumber(tranistion!.startTranNode.floor);
        const floorEnd =floorToNumber(tranistion!.endTranNode.floor);

        const xTranform = -225;
        const xTextTranform = -220;
        const yTranform = -10;
        const yTextTranform = 35;
        const height = 60;
        const width =210;

        if(floorStart==selectedFloorIndex){
            return (
                <a key={"tranistion_" + tranistion.startTranNode.id}>
                    <rect x={tranistion.startTranNode.coordinate.x + xTranform} y={tranistion.startTranNode.coordinate.y + yTranform} height={height}
                          width={width}
                          className={"floorLinkRect"}/>
                    <text x={tranistion.startTranNode.coordinate.x + xTextTranform} y={tranistion.startTranNode.coordinate.y + yTextTranform}
                          className={"floorLinkText"}>
                        {"Go to " + tranistion!.endTranNode.floor}</text>
                </a>

            );
        } else if (floorEnd == selectedFloorIndex) {
            return (
                <a key={"tranistion_" + tranistion.startTranNode.id}>
                    <rect x={tranistion.endTranNode.coordinate.x + xTranform} y={tranistion.endTranNode.coordinate.y + yTranform} height={height}
                          width={width}
                          className={"floorLinkRect"}/>
                    <text x={tranistion.endTranNode.coordinate.x + xTextTranform} y={tranistion.endTranNode.coordinate.y + yTextTranform}
                          className={"floorLinkText"}>
                        {"From " + tranistion!.startTranNode.floor}</text>
                </a>

            );
        }

        return <a>error</a>;

    }


    function handleMapToggle() {
        if (!drawEntirePath) {
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
            default: return "/src/images/maps/00_thelowerlevel1.png";
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
