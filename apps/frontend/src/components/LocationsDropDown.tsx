import React, { useState } from "react";
import "./component-css/NavBar.css";

export default function LocationsDropDown() {
  const [showDropdown, setShowDropdown] = useState(false);
  // const [filterValue, setFilterValue] = useState('');

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropbtn">
        Locations
      </button>
      <div
        id="myDropdown"
        className={`dropdown-content ${showDropdown ? "show" : ""}`}
      ></div>
    </div>
  );
}
