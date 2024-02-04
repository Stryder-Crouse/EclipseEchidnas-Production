import React from "react";
import "../../css/component-css/NavBar.css";
import LocationsDropDown from "./LocationsDropDown.tsx";

export default function AdminMapNavBar() {
  return (
    <div>
      <div className="left-navbar-container">
        <LocationsDropDown></LocationsDropDown>
      </div>
      <div className="navbar-container">
        <div className="dropdown">
          <a href={"/ServiceRequestPage"}>
            <button className="dropbtn">Service Request</button>
          </a>
        </div>
        <div className="dropdown">
          <a href={"/RequestList"}>
            <button className="dropbtn">Request List</button>
          </a>
        </div>

        <div className="dropdown">
          <a href={"/NodeEdgeTablePage"}>
            <button className="dropbtn">CSV</button>
          </a>
        </div>
      </div>
    </div>
  );
}
