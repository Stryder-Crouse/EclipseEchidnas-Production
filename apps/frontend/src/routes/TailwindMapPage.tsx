import SideNavBarComponent, {SideBarItem} from "../components/SideNavBarComponent.tsx";
import MapIcon from "../images/SideBar/map.png";
import ServiceRequestIcon from "../images/SideBar/requestIcon.png";
import EmployeeIcon from "../images/SideBar/user.png";
import CSVIcon from "../images/SideBar/table.png";
import LogIcon from "../images/SideBar/log-in.png";
import TopMapButtons from "../components/TopMapButtons.tsx";
import MapFeatureButtons from "../components/MapFeatureButtons.tsx";
import {Map} from "../components/map/Map.tsx";
import {multipleNodeDataBaseToNode, NodeDataBase} from "../../../backend/src/DataBaseClasses/NodeDataBase.ts";
import axios from "axios";
import {FloorToIndex, Node, NULLNODE} from "../../../backend/src/algorithms/Graph/Node.ts";
import {useEffect, useState} from "react";
import AboutPageIcon from "../images/SideBar/about-pageIcon.png";


const defaultFloor = FloorToIndex.LowerLevel1;


function TailwindMapPage() {


    const [startNode, setStartNode] = useState(NULLNODE);
    const [endNode, setEndNode] = useState(NULLNODE);

    const [selectedFloorIndex, setSelectedFloorIndex] = useState(defaultFloor);
    const [drawEntirePath, setDrawEntirePath] = useState(false);

    const [locations, setLocations] = useState([] as Array<Node>);

    const [veiwbox, setVeiwbox] =
        useState<{x:number, y:number, width:number, height:number}>({x:940,y:490, width:2160, height:1900});
    const [zoomScale, setZoomScale] = useState(1);


    // let mapPageLink = "";
    // console.log("Hello");
    // console.log(window.location.pathname);


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


    return(
        <div className="flex">
            <div className="flex absolute w-screen h-screen">
                <SideNavBarComponent>
                    <SideBarItem icon={MapIcon} text="Map" link={window.location.pathname}/>
                    <SideBarItem icon={ServiceRequestIcon} text="Services" link="ServiceRequest"/>
                    <SideBarItem icon={EmployeeIcon} text="Employees" link="/EmployeeTable"/>
                    <SideBarItem icon={CSVIcon} text=".CSV" link="/NodeEdgeTable"/>
                    <hr className="my-3"/>
                    {/*NEED THIS FIXED OR SUM */}
                    <SideBarItem icon={LogIcon} text="Login" link={"/ServiceRequest"}/>
                    <SideBarItem icon={AboutPageIcon} text="About" link="/AboutPage"/>
                </SideNavBarComponent>


                <TopMapButtons setSelectedFloorIndex={setSelectedFloorIndex} endNode={endNode}
                               locations={locations} setEndNode={setEndNode} setStartNode={setStartNode}
                               startNode={startNode}/>

                <MapFeatureButtons veiwbox={veiwbox} setVeiwbox={setVeiwbox}
                                   setDrawEntirePath={setDrawEntirePath} drawEntirePath={drawEntirePath}
                                   setZoomScale={setZoomScale} setEndNode={setEndNode}
                                   setStartNode={setStartNode}/>
            </div>
            <Map startNode={startNode} setStartNode={setStartNode} endNode={endNode} setEndNode={setEndNode}
                 selectedFloorIndex={selectedFloorIndex} setSelectedFloorIndex={setSelectedFloorIndex}
                 drawEntirePath={drawEntirePath} setDrawEntirePath={setDrawEntirePath} locations={locations}
                 setLocations={setLocations} setVeiwbox={setVeiwbox} veiwbox={veiwbox} setZoomScale={setZoomScale}
                 zoomScale={zoomScale}
             />

        </div>

    );
}

async function getNodes(floor:number){
    const res =await axios.get<NodeDataBase[]>("/api/load-nodes/floor", {params: {floor: floor}});
    console.log("HHH "+res.config.params.floor);
    return multipleNodeDataBaseToNode(res.data);

}

export default TailwindMapPage;
