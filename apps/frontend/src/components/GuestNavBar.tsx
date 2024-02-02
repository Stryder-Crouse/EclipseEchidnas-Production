import React from "react";
import "./component-css/NavBar.css";
import LocationsDropDown from "./LocationsDropDown.tsx";

export default function NavBar() {
  return (
    <div className="left-navbar-container">
      <LocationsDropDown></LocationsDropDown>
    </div>
  );
}