/** importations **/
import React from "react";
import "../css/route-css/medicineRequest.css";
import SideNavBarComponent, {SideBarItem} from "../components/SideNavBarComponent.tsx";

import ServiceRequestInput from "../components/service-requests/ServiceRequestInput.tsx";
import MapIcon from "../images/SideBar/map.png";
import ServiceRequestIcon from "../images/SideBar/requestIcon.png";
import EmployeeIcon from "../images/SideBar/user.png";
import CSVIcon from "../images/SideBar/table.png";
import LogIcon from "../images/SideBar/log-in.png";

export default function ServiceRequestPage() {


  return (
    <div className="flex h-lvh">
        <SideNavBarComponent>
            <SideBarItem icon={MapIcon} text="Map" link="/TailwindMapPage"/>
            <SideBarItem icon={ServiceRequestIcon} text="Services" link="/ServiceRequest"/>
            {/*todo chris change this you what you want*/}
            <SideBarItem icon={ServiceRequestIcon} text="Request List" link="/RequestList"/>
            <SideBarItem icon={EmployeeIcon} text="Employees" link="/EmployeeTable"/>
            <SideBarItem icon={CSVIcon} text=".CSV" link="/NodeEdgeTable"/>
            <hr className="my-3"/>
            {/*NEED THIS FIXED OR SUM */}
            <SideBarItem icon={LogIcon} text="Login" link={"/ServiceRequest"}/>
        </SideNavBarComponent>
        <ServiceRequestInput/>
    </div>
  );
}
