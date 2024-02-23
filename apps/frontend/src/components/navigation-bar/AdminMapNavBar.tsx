import React from "react";
import "../../css/component-css/NavBar.css";
import {useAuth0} from "@auth0/auth0-react";

import {FloorToIndex} from "../../../../../packages/common/src/algorithms/Graph/Node.ts";
import {NavBarStates} from "./GuestNavBar.tsx";
// import LocationsDropDown from "./LocationsDropDown.tsx";



export default function AdminMapNavBar({selectedFloorIndex:selectedFloorIndex,setSelectedFloorIndex:setSelectedFloorIndex}:NavBarStates) {
    const {logout} = useAuth0();
    console.log(selectedFloorIndex);
    return (
    <div>
      {/*<div className="left-navbar-container">*/}
      {/*  <LocationsDropDown></LocationsDropDown>*/}
      {/*</div>*/}
        <div className="navbar-container">
            <div className="dropdown">
                <a href={"/AdminMapPage"}>
                    <button className="dropbtn">
                        Levels
                    </button>
                </a>
                <div className={"dropdown-content"}>
                    <a onClick={() => {
                        setSelectedFloorIndex(FloorToIndex.LowerLevel2);
                    }}>Lower Level 2</a>
                    <hr className={"dotted"}/>
                    <a onClick={() => {
                        setSelectedFloorIndex(FloorToIndex.LowerLevel1);
                    }}>Lower Level 1</a>
                    <hr className={"dotted"}/>
                    <a onClick={() => {
                        setSelectedFloorIndex(FloorToIndex.Ground);
                    }}>Ground</a>
                    <hr className={"dotted"}/>
                    <a onClick={() => {
                        setSelectedFloorIndex(FloorToIndex.Level1);
                    }}>Level 1</a>
                    <hr className={"dotted"}/>
                    <a onClick={() => {
                        setSelectedFloorIndex(FloorToIndex.Level2);
                    }}>Level 2</a>
                    <hr className={"dotted"}/>
                    <a onClick={() => {
                        setSelectedFloorIndex(FloorToIndex.Level3);
                    }}>Level 3</a>
                </div>
            </div>
            <div className="dropdown">
                <a href={"/AdminMapPage"}>
                    <button className="dropbtn">Home Page</button>
                </a>
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
                    <button className="dropbtn">Employee Table</button>
                </a>
            </div>
            <div className="dropdown">
                <a href={"/NodeEdgeTable"}>
                    <button className="dropbtn">CSV</button>
                </a>
            </div>
            <div className="dropdown">
                <button className="dropbtn" onClick={() =>
                    logout({logoutParams: {returnTo: "http://localhost:3000"}})
                }>
                    End Session
                </button>
            </div>

        </div>
    </div>
    );
}
