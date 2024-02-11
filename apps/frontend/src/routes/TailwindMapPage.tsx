import SideNavBarComponent, {SideBarItem} from "../components/SideNavBarComponent.tsx";
import MapIcon from "../images/SideBar/map.png";
import ServiceRequestIcon from "../images/SideBar/requestIcon.png";
import EmployeeIcon from "../images/SideBar/user.png";
import CSVIcon from "../images/SideBar/table.png";
import LogIcon from "../images/SideBar/log-in.png";

function TailwindMapPage() {

    return(
        <div className="flex">
            <SideNavBarComponent>
                <SideBarItem icon={MapIcon} text="Map" link="/TailwindMapPage" />
                <SideBarItem icon={ServiceRequestIcon} text="Services" link="ServiceRequest"/>
                <SideBarItem icon={EmployeeIcon} text="Employees" link="/EmployeeTable"/>
                <SideBarItem icon={CSVIcon} text=".CSV" link="/NodeEdgeTable"/>
                <hr className="my-3"/>
                {/*NEED THIS FIXED OR SUM */}
                <SideBarItem icon={LogIcon} text="Login" link="/ServiceRequest"/>
            </SideNavBarComponent>


        </div>
    );
}


export default TailwindMapPage;
