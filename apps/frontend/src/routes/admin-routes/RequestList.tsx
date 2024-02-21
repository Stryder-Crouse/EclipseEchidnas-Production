import React from "react";
import ServiceRequestOutputTables from "../../components/service-requests/ServiceRequestOutputTables.tsx";
import SideNavBarComponent, {SideBarItem} from "../../components/SideNavBarComponent.tsx";
import MapIcon from "../../images/SideBar/map.png";
import ServiceRequestIcon from "../../images/SideBar/requestIcon.png";
import EmployeeIcon from "../../images/SideBar/user.png";
import CSVIcon from "../../images/SideBar/table.png";
import LogIcon from "../../images/SideBar/log-in.png";
import AboutPageIcon from "../../images/SideBar/about-pageIcon.png";
import ServiceRequestStats from "../../components/service-requests/ServiceRequestStats.tsx";

function RequestList() {

    return (
        <div className="flex h-lvh">
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
            <ServiceRequestOutputTables></ServiceRequestOutputTables>
            <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer"/>
                <div
                    className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span>
            </label>
            <ServiceRequestStats></ServiceRequestStats>
        </div>
    );


}


export default RequestList;

