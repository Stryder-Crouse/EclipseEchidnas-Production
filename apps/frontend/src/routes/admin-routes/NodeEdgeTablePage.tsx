import SideNavBarComponent, {SideBarItem} from "../../components/SideNavBarComponent.tsx";
import ServiceRequestIcon from "../../images/SideBar/requestIcon.png";
import EmployeeIcon from "../../images/SideBar/user.png";
import CSVIcon from "../../images/SideBar/table.png";
import LogIcon from "../../images/SideBar/log-in.png";
import MapIcon from "../../images/SideBar/map.png";

import ImportExportButtons from "../../components/NodeAndEdgeTable/ImportExportButtons.tsx";
import NodeTable from "../../components/NodeAndEdgeTable/NodeTable.tsx";
import EdgeTable from "../../components/NodeAndEdgeTable/EdgeTable.tsx";
import AboutPageIcon from "../../images/SideBar/about-pageIcon.png";

function NodeEdgeTablePage() {
    return(
        <div className="flex h-lvh">
            <div className="z-10">
                <SideNavBarComponent>
                    <SideBarItem icon={MapIcon} text="Map" link="/TailwindMapPage"/>
                    <SideBarItem icon={ServiceRequestIcon} text="Services" link="ServiceRequest"/>
                    <SideBarItem icon={EmployeeIcon} text="Employees" link="/EmployeeTable"/>
                    <SideBarItem icon={CSVIcon} text=".CSV" link="/NodeEdgeTable"/>
                    <hr className="my-3"/>
                    {/*NEED THIS FIXED OR SUM */}
                    <SideBarItem icon={LogIcon} text="Login" link={"/ServiceRequest"}/>
                    <SideBarItem icon={AboutPageIcon} text="About" link="/AboutPage"/>
                </SideNavBarComponent>
            </div>
            <div className="flex flex-col w-lvw -ml-10">
                <ImportExportButtons/>
                <NodeTable/>
                <EdgeTable/>
            </div>

        </div>
    );
}

export default NodeEdgeTablePage;
