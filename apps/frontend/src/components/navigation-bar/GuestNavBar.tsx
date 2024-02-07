import React from "react";
import "../../css/component-css/NavBar.css";
//import LocationsDropDown from "./LocationsDropDown.tsx";

export default function NavBar() {
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
                  <a href={"/ServiceRequestPage"}>
                      <button className="dropbtn">Service Request</button>
                  </a>
              </div>

              <div className="dropdown">
                  <a href="http://localhost:3000">
                      <button className="dropbtn">End Session</button>
                  </a>
              </div>

          </div>
      </div>

  );
}
