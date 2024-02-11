import {Map} from "../components/map/Map.tsx";
import "../css/route-css/newMapPage.css";
import axios from "axios";
import {multipleNodeDataBaseToNode, NodeDataBase} from "../../../backend/src/DataBaseClasses/NodeDataBase.ts";

import {useEffect, useState} from "react";
import { FloorToIndex, NULLNODE} from "../../../backend/src/algorithms/Graph/Node.ts";

import {Node} from "../../../backend/src/algorithms/Graph/Node.ts";
import AdminMapNavBar from "../components/navigation-bar/AdminMapNavBar.tsx";
import {onNodeHover, onNodeLeave} from "../event-logic/circleNodeEventHandlers.ts";




const defaultFloor = FloorToIndex.LowerLevel1;

 function NewMapPageAdmin() {

     const [startNode, setStartNode] = useState(NULLNODE);
     const [endNode, setEndNode] = useState(NULLNODE);
     const [selectedFloorIndex, setSelectedFloorIndex] = useState(defaultFloor);
     const [drawEntirePath, setDrawEntirePath] = useState(false);
     const [locations, setLocations] = useState([] as Array<Node>);

    //todo need drawALL for dawing all edges and node on the graph


    //useEffect for start up
    useEffect(() => {
        let queryDone = false;

        if (!queryDone) {
            getNodes(selectedFloorIndex).then(result=>{ setLocations(result);});
        }
        return ()=>{
            queryDone = true;
        };

    }, [selectedFloorIndex]);

     const handleNodeClick = (node: Node) => {

         if(startNode == NULLNODE && endNode == NULLNODE){
             document.getElementById("startingNodeInput")?.setAttribute("value", node.longName);
             setStartNode(node);
         }
         else if (endNode == NULLNODE){
             document.getElementById("endingNodeInput")?.setAttribute("value", node.longName);
             setEndNode(node);

         }
         else{
             document.getElementById("startingNodeInput")?.setAttribute("value", node.longName);
             document.getElementById("endingNodeInput")?.setAttribute("value", "");
            setStartNode(node);
            setEndNode(NULLNODE);
         }


     };


    return (
        //TODO BNBN implement backend feature to populate SELECTS for each floor node/edge
        //located in div "sidenav" , id for each is under each select

        //TODO BNBN implement toggle function to reset selected node

        <div className={"newMapPage-container"}>
            {/* where navbar needs to be */}
            <div>
                <AdminMapNavBar selectedFloorIndex={selectedFloorIndex} setSelectedFloorIndex={setSelectedFloorIndex}/>
            </div>
            <div className={"wholeNewMapPageBody"}>
                <div className={"sidenav"}>
                    <div className={"sidenav-elements"}>
                        <div className={"populatingNodes"} id={"populating-nodes"}>
                            {/* THIS IS BEING POPULATED BY DATABASE */}
                            {
                                //id's are startingNodeInput and endingNodeInput
                                locations.map((node) => {
                                    return (
                                            <div className={"level-location"}
                                                 onClick={() => handleNodeClick(node)}
                                                 onMouseOver={()=> onNodeHover(node.id)}
                                                 onMouseLeave={()=> onNodeLeave(node.id)}

                                            >{node.longName}</div>

                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={"mapSide"}>
                    <Map startNode={startNode} setStartNode={setStartNode} endNode={endNode} setEndNode={setEndNode}
                         selectedFloorIndex={selectedFloorIndex} setSelectedFloorIndex={setSelectedFloorIndex}
                         drawEntirePath={drawEntirePath} setDrawEntirePath={setDrawEntirePath} locations={locations} setLocations={setLocations}
                    />
                    <div className={"start-end-typing-navigation"}>
                        <label className={"mapSide-label"}>
                            START AT: <input type={"text"} id={"startingNodeInput"} className={"newMapPage-input-fields"}/>
                        </label>
                        <label className={"mapSide-label"}>
                            END AT: <input type={"text"} id={"endingNodeInput"} className={"newMapPage-input-fields"}/>
                        </label>

                        <button className={"reset-location-button"}>Reset Locations</button>
                        <button className={"go-button"}>GO!</button>
                        {/* implement go button */}
                        {/* BNBN NEED TO CONNECT THIS TO NODES */}
                    </div>
                </div>
            </div>

        </div>


    );

    async function getNodes(floor:number){
        const res =await axios.get<NodeDataBase[]>("/api/load-nodes/floor", {params: {floor: floor}});
        console.log("HHH "+res.config.params.floor);
        return multipleNodeDataBaseToNode(res.data);

    }

    // async function populateNodes(floor: number) {
    //
    //     //Loading database
    //     const nodeData = await axios.get<NodeDataBase[]>("/api/load-nodes", {params: {floor: floor}});
    //
    //     //This is the div collection of div's
    //     const divCollection = document.getElementById("populating-nodes");
    //     console.log(divCollection);
    //
    //     //for each loop to go through each node
    //     nodeData.data.forEach(function (newNode: NodeDataBase) {
    //
    //         //taking full name of floor location
    //         const nodeDiv = document.createElement("div");
    //         nodeDiv.textContent = newNode.nodeID;
    //         nodeDiv.setAttribute("class", "level-location");
    //
    //
    //         //base case
    //         if (divCollection == null) {
    //             return;
    //         }
    //
    //         //adding to main div of all locations combined
    //         divCollection.appendChild(nodeDiv);
    //     });
    // }
    //
    // function cleanLocations() {
    //     const divCollection = document.getElementById("populating-nodes");
    //
    //     if (divCollection == null) {
    //         console.log("populating-nodes id does not exist");
    //         return;
    //     }
    //
    //
    //     while (divCollection.firstChild) {
    //         divCollection.removeChild(divCollection.lastChild!);
    //     }
    //
    // }


}
export default NewMapPageAdmin;
