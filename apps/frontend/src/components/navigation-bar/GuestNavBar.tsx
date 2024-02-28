import React, {Dispatch, SetStateAction} from "react";
import "../../css/component-css/NavBar.css";
import {FloorToIndex} from "common/src/algorithms/Graph/Node.ts";

//import LocationsDropDown from "./LocationsDropDown.tsx";

//todo move to file
export interface NavBarStates{
    selectedFloorIndex:FloorToIndex;
    setSelectedFloorIndex: Dispatch<SetStateAction<FloorToIndex>>;
}
function NavBar({selectedFloorIndex:selectedFloorIndex,setSelectedFloorIndex:setSelectedFloorIndex}:NavBarStates) {

    console.log(selectedFloorIndex);


  return (
      <div>
          {/*<div className="left-navbar-container">*/}
          {/*  <LocationsDropDown></LocationsDropDown>*/}
          {/*</div>*/}
          <div className="navbar-container">
              <div className="dropdown">
                  <a href={"/AdminMapPage"}>
                      <button className="dropbtn">Levels</button>
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

export default NavBar;
