import {Map} from "../components/map/Map.tsx";
import "../css/route-css/newMapPage.css";
//import AdminPageNavBar from "../components/navigation-bar/AdminPageNavBar.tsx";
import axios from "axios";
import {NodeDataBase} from "../../../backend/src/DataBaseClasses/NodeDataBase.ts";
import ExitButton from "../components/buttons/ExitButton.tsx";
import AdminMapNavBar from "../components/navigation-bar/AdminMapNavBar.tsx";
import {useState} from "react";
import {Buildings, Node, NodeType} from "../../../backend/src/algorithms/Graph/Node.ts";


const nullNode:Node = {
    building: Buildings.UNDEFINED,
    coordinate: {x:-100,y:-100},
    edges: [],
    floor: "",
    id: "NULL",
    longName: "",
    nodeType: NodeType.UNDEFINED,
    shortName: ""

};

function NewMapPage() {

    const [startNode, setStartNode] = useState(nullNode);
    const [endNode, setEndNode] = useState(nullNode);
    const [selectedFloorIndex, setSelectedFloorIndex] = useState();
    const [drawPath, setDrawPath] = useState(false);


    return (
        //TODO BNBN implement backend feature to populate SELECTS for each floor node/edge
        //located in div "sidenav" , id for each is under each select

        //TODO BNBN implement toggle function to reset selected node

        <div className={"newMapPage-container"}>
            {/* where navbar needs to be */}
            <div>
                <AdminMapNavBar/>
            </div>
            <div className={"wholeNewMapPageBody"}>
                <div className={"sidenav"}>
                    <div className={"sidenav-elements"}>
                        <div className={"populatingNodes"} id={"populating-nodes"}>
                            {/* THIS IS BEING POPULATED BY DATABASE */}
                        </div>
                    </div>
                </div>
                <div className={"mapSide"}>
                    <Map/>
                    <div className={"start-end-typing-navigation"}>
                        <label className={"mapSide-label"}>
                            START AT: <input type={"text"} className={"newMapPage-input-fields"}/>
                        </label>
                        <label className={"mapSide-label"}>
                            END AT: <input type={"text"} className={"newMapPage-input-fields"}/>
                        </label>

                        <button className={"reset-location-button"}>Reset Locations</button>
                        <button className={"go-button"}>GO!</button>
                        {/* implement go button */}
                        {/* BNBN NEED TO CONNECT THIS TO NODES */}
                    </div>
                </div>
            </div>
            <ExitButton/>
        </div>


    );
}

populateNodes().then();

async function populateNodes() {

    //Loading database
    const nodeData = await axios.get<NodeDataBase[]>("/api/load-nodes");

    //This is the div collection of div's
    const divCollection = document.getElementById("populating-nodes");
    console.log(divCollection);

    //for each loop to go through each node
    nodeData.data.forEach(function (newNode: NodeDataBase) {

        //taking full name of floor location
        const nodeDiv = document.createElement("div");
        nodeDiv.textContent = newNode.nodeID;
        nodeDiv.setAttribute("class", "level-location");


        //base case
        if (divCollection == null) {
            return;
        }

        //adding to main div of all locations combined
        divCollection.appendChild(nodeDiv);
    });
}

export default NewMapPage;
