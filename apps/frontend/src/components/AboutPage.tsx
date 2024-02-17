import SideNavBarComponent, {SideBarItem} from "./SideNavBarComponent.tsx";
import MapIcon from "../images/SideBar/map.png";
import ServiceRequestIcon from "../images/SideBar/requestIcon.png";
import EmployeeIcon from "../images/SideBar/user.png";
import CSVIcon from "../images/SideBar/table.png";
import LogIcon from "../images/SideBar/log-in.png";
import AboutPageIcon from "../images/SideBar/users-round.png";

function AboutPage(){

    return(
        <div className="flex">
            <div className="flex absolute w-screen h-screen">
                <SideNavBarComponent>
                    <SideBarItem icon={MapIcon} text="Map" link={window.location.pathname}/>
                    <SideBarItem icon={ServiceRequestIcon} text="Services" link="ServiceRequest"/>
                    <SideBarItem icon={EmployeeIcon} text="Employees" link="/EmployeeTable"/>
                    <SideBarItem icon={CSVIcon} text=".CSV" link="/NodeEdgeTable"/>
                    <SideBarItem icon={AboutPageIcon} text="About" link="/AboutPage"/>
                    <hr className="my-3"/>
                    {/*NEED THIS FIXED OR SUM */}
                    <SideBarItem icon={LogIcon} text="Login" link={"/ServiceRequest"}/>
                </SideNavBarComponent>
            </div>
        </div>

    );
}

export default  AboutPage;
