import { useAuth0 } from "@auth0/auth0-react";
import SideNavBarComponent, { SideBarItem } from "./SideNavBarComponent.tsx";
import MapIcon from "../images/SideBar/map.png";
import ServiceRequestIcon from "../images/SideBar/requestIcon.png";
import EmployeeIcon from "../images/SideBar/user.png";
import CSVIcon from "../images/SideBar/table.png";
import LogIcon from "../images/SideBar/log-in.png";
import LogOutIcon from "../images/SideBar/log-out.png";
import AboutIcon from "../images/SideBar/users-round.png";
import CreditsIcon from "../images/SideBar/copyright.png";

import ProfileIcon from "../images/SideBar/prfile_icon.png";
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
                    <SideBarItem icon={MapIcon} text="Map" link="/" />
                    <SideBarItem icon={ServiceRequestIcon} text="Services" link="ServiceRequest"/>

                    <hr className="my-3" />
                    {/* Conditionally render "Login" or "Log Out" based on authentication status */}

                    {isAuthenticated && (
                        <>
                            <SideBarItem icon={ProfileIcon} text="Profile" link="ProfilePage" />
                            <SideBarItem icon={EmployeeIcon} text="Employees" link="/EmployeeTable" />
                            <SideBarItem icon={CSVIcon} text="CSV" link="/NodeEdgeTable" />
                        </>
                    )}

                    <SideBarItem icon={AboutIcon} text={"About"} link={"/AboutPage"}/>
                    <SideBarItem icon={CreditsIcon} text={"Credits"} link={"/Credits"}/>
                    <SideBarItem icon={isAuthenticated ? LogOutIcon : LogIcon} text={isAuthenticated ? "Logout" : "Login"} onClick={handleLoginOrLogout} link={window.location.origin}/>
                </SideNavBarComponent>
            </div>
        </div>
    );
}

