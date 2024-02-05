import { Map } from "../components/map/Map.tsx";
import "../css/route-css/newMapPage.css";
import AdminPageNavBar from "../components/navigation-bar/AdminPageNavBar.tsx";
import axios from "axios";
import {NodeDataBase} from "../../../backend/src/DataBaseClasses/NodeDataBase.ts";

function NewMapPage() {
    return (
        //TODO BNBN implement backend feature to populate SELECTS for each floor node/edge
        //located in div "sidenav" , id for each is under each select

        //TODO BNBN implement toggle function to reset selected node

        <div className={"newMapPage-container"}>
            <AdminPageNavBar/>
            <div className={"wholeNewMapPageBody"}>
                <div className={"sidenav"}>
                    <div className={"sidenav-elements"}>
                        <div className={"populatingNodes"} id={"populating-nodes"}>
                               <div className={"level-location"} id={"levelLocation"}>CCFONL1</div>
                        </div>

                        <button className={"reset-location-button"}>Reset Current Location</button>
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

                        {/* BNBN NEED TO CONNECT THIS TO NODES */}
                        <div className={"button-div"}>
                            <button className={"go-button"}>GO!</button>
                        </div>
                    </div>
                </div>
            </div>
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


        if (divCollection == null) {
            return;
        }

        divCollection.appendChild(nodeDiv);
    });
}
export default NewMapPage;
