import React from "react";
import "./component-css/NavBar.css";
import LocationsDropDown from "./LocationsDropDown.tsx";

export default function AdminMapNavBar() {
  return (
    <div className="navbar-container">
      <LocationsDropDown></LocationsDropDown>
      <div className="dropdown">
        <a href={"/medicineRequest"}>
          <button className="dropbtn">Service Request</button>
        </a>
      </div>
      <div className="dropdown">
        <a href={"/RequestList"}>
          <button className="dropbtn">Request List</button>
        </a>
      </div>

      <div className="dropdown">
        <a href={"/FileTable"}>
          <button className="dropbtn">CSV</button>
        </a>
      </div>
    </div>
  );
}
