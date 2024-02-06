import React from "react";
import "../../css/component-css/NavBar.css";
// import LocationsDropDown from "./LocationsDropDown.tsx";

export default function AdminMapNavBar() {
  return (
    <div>
      {/*<div className="left-navbar-container">*/}
      {/*  <LocationsDropDown></LocationsDropDown>*/}
      {/*</div>*/}
        <div className="navbar-container">
            <div className="dropdown">
                <button className="dropbtn">
                    Levels
                </button>
                <div className={"dropdown-content"}>
                    <a href={"/AdminMapPage"}>L2</a>
                    <a href={"/AdminMapPage"}>L1</a>
                    <a href={"/AdminMapPage"}>G</a>
                    <a href={"/AdminMapPage"}>1</a>
                    <a href={"/AdminMapPage"}>2</a>
                    <a href={"/AdminMapPage"}>3</a>
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
                <a href= "http://localhost:3000" >
                    <button className="dropbtn">End Session</button>
                </a>
            </div>

        </div>
    </div>
  );
}
