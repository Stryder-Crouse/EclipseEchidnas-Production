import { useAuth0 } from "@auth0/auth0-react";
import SideNavBarComponent, { SideBarItem } from "./SideNavBarComponent.tsx";
import MapIcon from "../images/SideBar/map.png";
import ServiceRequestIcon from "../images/SideBar/requestIcon.png";
import EmployeeIcon from "../images/SideBar/user.png";
import CSVIcon from "../images/SideBar/table.png";
import LogIcon from "../images/SideBar/log-in.png";
import LogOutIcon from "../images/SideBar/log-out.png";
import AboutIcon from "../images/SideBar/users-round.png";

export default function FullSideNavBarComponent() {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    const handleLoginOrLogout = () => {
        if (isAuthenticated) {
            // If authenticated, perform logout
            logout().then();
        } else {
            // If not authenticated, perform login
            loginWithRedirect().then();
        }
    };

    return (
        <div>
            <div className="z-10">
                <SideNavBarComponent>
                    <SideBarItem icon={MapIcon} text="Map" link="/TailwindMapPage" />
                    <SideBarItem icon={ServiceRequestIcon} text="Services" link="ServiceRequest"/>

                    {isAuthenticated && (
                        <>
                            <SideBarItem icon={EmployeeIcon} text="Employees" link="/EmployeeTable" />
                            <SideBarItem icon={CSVIcon} text="Databases" link="/NodeEdgeTable" />
                        </>
                    )}

                    <hr className="my-3" />
                    {/* Conditionally render "Login" or "Log Out" based on authentication status */}
                    <SideBarItem icon={isAuthenticated ? LogOutIcon : LogIcon} text={isAuthenticated ? "Log Out" : "Login"} onClick={handleLoginOrLogout} link="/TailwindMapPage"/>
                    <SideBarItem icon={AboutIcon} text={"About Us"} link={"/AboutPage"}/>
                </SideNavBarComponent>
            </div>
        </div>
    );
}

