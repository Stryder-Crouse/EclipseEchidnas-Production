import React from "react";
import "./component-css/NavBar.css";

export default function NavBar() {
  return (
    <div className="navbar-container">
      <div className="dropdown">
        <a href={"/AdminMapPage"}>
          <button className="dropbtn">Home Page</button>
        </a>
      </div>

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
