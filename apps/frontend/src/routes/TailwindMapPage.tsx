import SideNavBarComponent, {SideBarItem} from "../components/SideNavBarComponent.tsx";
import MapIcon from "../images/SideBar/map.png";
import ServiceRequestIcon from "../images/SideBar/requestIcon.png";
import EmployeeIcon from "../images/SideBar/user.png";
import CSVIcon from "../images/SideBar/table.png";
import LogIcon from "../images/SideBar/log-in.png";
import TopMapButtons from "../components/TopMapButtons.tsx";
import MapFeatureButtons from "../components/MapFeatureButtons.tsx";
import {HospitalMap} from "../components/map/HospitalMap.tsx";
import {multipleNodeDataBaseToNode, NodeDataBase} from "../../../backend/src/DataBaseClasses/NodeDataBase.ts";
import axios from "axios";
import {FloorToIndex, Node, NULLNODE} from "../../../backend/src/algorithms/Graph/Node.ts";
import {useEffect, useState} from "react";



/* Set the default floor to LL1 */
const defaultFloor = FloorToIndex.LowerLevel1;

/**
 * Wrapper for the Map.tsx function that includes the navigation and feature buttons.
 */
function TailwindMapPage() {

    const [startNode, setStartNode] = useState(NULLNODE);
    const [endNode, setEndNode] = useState(NULLNODE);

    const [selectedFloorIndex, setSelectedFloorIndex] = useState(defaultFloor);

    const [drawEntirePath, setDrawEntirePath] = useState(false);
    const [drawEntirePathOptions, setDrawEntirePathOptions] =
        useState([true,true,false]);

    const [locations, setLocations] = useState([] as Array<Node>);
    const [locationsWithHalls, setLocationsWithHalls] = useState([] as Array<Node>);
    const [pathFindingType, setPathFindingType] = useState("A*");

    const [viewbox, setViewbox] =
        useState<{ x: number, y: number, width: number, height: number }>({x: 940, y: 490, width: 2160, height: 1900});
    const [zoomScale, setZoomScale] = useState(1);


    //useEffect for start up
    useEffect(() => {

            getNodes(selectedFloorIndex).then(result => {
                setLocations(result);
            });
        getNodesWithHallways(selectedFloorIndex).then(result=>{
            setLocationsWithHalls(result);
        });


    }, [selectedFloorIndex]);


    return (
        <div className="flex">
            <div className="flex absolute w-screen h-screen">
                <SideNavBarComponent>
                    <SideBarItem icon={MapIcon} text="Map" link={window.location.pathname}/>
                    <SideBarItem icon={ServiceRequestIcon} text="Services" link="ServiceRequest"/>
                    <SideBarItem icon={EmployeeIcon} text="Employees" link="/EmployeeTable"/>
                    <SideBarItem icon={CSVIcon} text=".CSV" link="/NodeEdgeTable"/>
                    <hr className="my-3"/>
                    {/*NEED THIS FIXED OR SUM */}
                    <SideBarItem icon={LogIcon} text="Login" link={"/RegisterPage"}/>
                </SideNavBarComponent>

                    <TopMapButtons
                        setSelectedFloorIndex={setSelectedFloorIndex}
                        endNode={endNode}
                        locations={locations}
                        setEndNode={setEndNode}
                        setStartNode={setStartNode}
                        startNode={startNode}
                        setPathFindingType={setPathFindingType}
                    />

                    <MapFeatureButtons viewbox={viewbox} setViewbox={setViewbox}
                                       setDrawEntirePath={setDrawEntirePath} drawEntirePath={drawEntirePath}
                                       setZoomScale={setZoomScale} setEndNode={setEndNode}
                                       setStartNode={setStartNode} drawEntirePathOptions={drawEntirePathOptions}
                                       setDrawEntirePathOptions={setDrawEntirePathOptions}/>


            </div>
            <HospitalMap startNode={startNode} setStartNode={setStartNode} endNode={endNode} setEndNode={setEndNode}
                         selectedFloorIndex={selectedFloorIndex} setSelectedFloorIndex={setSelectedFloorIndex}
                         drawEntirePath={drawEntirePath} setDrawEntirePath={setDrawEntirePath} locationsWithHalls={locationsWithHalls}
                         pathFindingType={pathFindingType}
                         setViewbox={setViewbox} viewbox={viewbox} setZoomScale={setZoomScale}
                         zoomScale={zoomScale} drawEntirePathOptions={drawEntirePathOptions}
            />
        </div>
    );
}

async function getNodes(floor: number) {
    const res = await axios.get<NodeDataBase[]>("/api/load-nodes/floor", {params: {floor: floor}});
    console.log("HHH " + res.config.params.floor);
    return multipleNodeDataBaseToNode(res.data);

}

async function getNodesWithHallways(floor: number) {
    const res = await axios.get<NodeDataBase[]>("/api/load-nodes/floorWithHalls", {params: {floor: floor}});
    console.log("HHH " + res.config.params.floor);
    return multipleNodeDataBaseToNode(res.data);

}

export default TailwindMapPage;
