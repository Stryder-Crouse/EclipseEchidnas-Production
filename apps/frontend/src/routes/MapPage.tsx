/** importations **/
import React, { useState } from "react";
// import React from 'react';
import "../components/MapPage.css";
//import Map from "../components/01_thefirstfloor.png";

export default function MapPage() {
  const backgroundStyle = {
    backgroundImage: 'url("../components/01_thefirstfloor.png")',
    /* Add other background properties as needed */
    backgroundSize: "cover" /* Adjust based on your preference */,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "100vh", // Make sure the container takes up the full viewport height
    margin: 0, // Remove default margin to cover the whole page
    display: "flex", // Optional: If you want to center content vertically and horizontally
    justifyContent: "center",
    alignItems: "center",
  };

  const Dropdown = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    // const [filterValue, setFilterValue] = useState('');

    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
    };

    // const filterFunction = () => {
    //     const input = filterValue.toUpperCase();
    //     const dropdown = document.getElementById('myDropdown');
    //     const links = dropdown.getElementsByTagName('a');
    //
    //     for (let i = 0; i < links.length; i++) {
    //         const txtValue = links[i].textContent || links[i].innerText;
    //         if (txtValue.toUpperCase().indexOf(input) > -1) {
    //             links[i].style.display = '';
    //         } else {
    //             links[i].style.display = 'none';
    //         }
    //     }
    // };

    return (
      <div className="dropdown">
        <button onClick={toggleDropdown} className="dropbtn">
          Dropdown
        </button>
        <div
          id="myDropdown"
          className={`dropdown-content ${showDropdown ? "show" : ""}`}
        >
          {/*<input*/}
          {/*    type="text"*/}
          {/*    placeholder="Search.."*/}
          {/*    id="myInput"*/}
          {/*    value={filterValue}*/}
          {/*    onChange={(e) => setFilterValue(e.target.value)}*/}
          {/*    onKeyUp={filterFunction}*/}
          {/*/>*/}
          <a href="#about">About</a>
          <a href="#base">Base</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
          <a href="#custom">Custom</a>
          <a href="#support">Support</a>
          <a href="#tools">Tools</a>
        </div>
      </div>
    );
  };
  return (
    <div style={backgroundStyle}>
      <Dropdown />
    </div>
  );
}
