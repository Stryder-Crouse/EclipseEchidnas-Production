import React from "react";
import "../../css/component-css/NavBar.css";
import {useAuth0} from "@auth0/auth0-react";

// import LocationsDropDown from "./LocationsDropDown.tsx";

export default function AdminMapNavBar() {
    const {logout} = useAuth0();
    return (
        <div>
            {/*<div className="left-navbar-container">*/}
            {/*  <LocationsDropDown></LocationsDropDown>*/}
            {/*</div>*/}
            <div className="navbar-container">
                <div className="dropdown">
                    <a href={"/AdminMapPage"}>
                        <button className="dropbtn">Map Page</button>
                    </a>
                        <div className={"dropdown-content"}>
                            <a href={"/AdminMapPage"}>L2</a>
                            <hr className={"dotted"}/>
                            <a href={"/AdminMapPage"}>L1</a>
                            <hr className={"dotted"}/>
                            <a href={"/AdminMapPage"}>G</a>
                            <hr className={"dotted"}/>
                            <a href={"/AdminMapPage"}>1</a>
                            <hr className={"dotted"}/>
                            <a href={"/AdminMapPage"}>2</a>
                            <hr className={"dotted"}/>
                            <a href={"/AdminMapPage"}>3</a>
                        </div>
                </div>

                <div className="dropdown">
                    <a href={"/ServiceRequest"}>
                        <button className="dropbtn">Service Request</button>
                    </a>
                </div>
                <div className="dropdown">
                    <a href={"/RequestList"}>
                        <button className="dropbtn">Request List</button>
                    </a>
                </div>
                <div className="dropdown">
                    <a href={"/EmployeeTable"}>
                        <button className="dropbtn">Employee List</button>
                    </a>
                </div>
                <div className="dropdown">
                    <a href={"/NodeEdgeTable"}>
                        <button className="dropbtn">CSV</button>
                    </a>
                </div>
                <div className="dropdown" >
                        <button className="dropbtn" onClick={() =>
                            logout ({logoutParams: { returnTo:"http://localhost:3000"}})
                        } >
                            End Session </button>
                </div>

            </div>
        </div>
    );
}
