/** importations **/
import React, { useEffect, useState } from "react";
// import React from 'react';
import "../components/MapPage.css";
import { useNavigate } from "react-router-dom";
import { Node } from "../../../backend/src/algorithms/Graph/Node.ts";
import { readNodeCSV } from "../../../backend/src/algorithms/readCSV.ts";
import axios from "axios";
//import Map from "../components/01_thefirstfloor.png";

let loadedLocations = false;

export default function MapPage() {
  const navigate = useNavigate();

  //this does not work I believe (at least to display the image- Stryder
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

  async function submitNodes() {
    const data = JSON.stringify({}); //making a JSON format file from input Nodes
    console.log(data);
    //sends a post request the /api/load-db     (server accessing this api)
    try {
      await axios.post("/api/load-nodes", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      throw new Error("Error with loading Nodes");
    }
  }

  async function submitEdges() {
    const data = JSON.stringify({}); //making a JSON format file from input Nodes
    console.log(data);
    //sends a post request the /api/load-db     (server accessing this api)
    try {
      await axios.post("/api/load-edges", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      throw new Error("Error with loading Edges");
    }
  }

  //uncomment to use
  async function getNodes() {
    try {
      const response = await axios.get("/api/load-nodes");
      console.log(response);
    } catch (err) {
      throw new Error("Error getting Nodes");
    }
  }

  async function getEdges() {
    try {
      const response = await axios.get("/api/load-edges");
      console.log(response);
    } catch (err) {
      throw new Error("Error getting Edges");
    }
  }

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
        </div>
      </div>
    );
  };

  //populate the dropdown with locations on page load
  useEffect(() => {
    //make sure it only runs once (useEffect is called twice in development)
    if (!loadedLocations) {
      //populateLocationDropdown().then();
      loadedLocations = true;
      submitNodes().then(() => {
        submitEdges().then();
      }); //populates the Node table
      //submitEdges().then();
      //submitEdges(); //populates the Edge table
      getNodes().then(); //send a get request to server and received info about all nodes (uncomment to use)
      getEdges().then(); //send a get request to server and received info about all edges
      //set background to floor on component load
      document.body.style.backgroundImage =
        "url(/src/components/01_thefirstfloor.png)";
    }

    // fix the dropdown not showing up after browser back has been pressed
    window.onpopstate = () => {
      loadedLocations = false;
    };

    document.body.style.backgroundImage =
      "url(/src/components/01_thefirstfloor.png)";
  }, []);

  return (
    <div style={backgroundStyle}>
      <Dropdown />
      <button
        className={"xout"}
        onClick={() => {
          //make sure locations can be loaded again once we comeback
          loadedLocations = false; //CHANGE TO USESTATE effect (should reset on page load)
          navigate("/");
        }}
      >
        X
      </button>
    </div>
  );
}
//populate the dropdown DONT NEED USE EFFECT just
//make sure to navigate to this page using href
populateLocationDropdown().then();
/**
 * This function populates the Dropdown div with the locations represented by nodes.
 * SHOULD ONLY BE RUN ONCE.
 */
async function populateLocationDropdown() {
  //read node file and create the nodes
  const nodes: Array<Node> = readNodeCSV(await getNodeCSVString());
  //console.log("nodes");
  //console.log(nodes);
  //fine dropdown div in the html on the page
  const myDropdown = document.getElementById("myDropdown");
  //console.log("myDropdown");
  //console.log(myDropdown);
  //for each node
  nodes.forEach(function (newNode: Node) {
    //create a element
    const row = document.createElement("a");

    //use longName of node as the text content for new a tag
    row.textContent = newNode.longName;

    if (myDropdown == null) {
      return;
    }

    //add new a element to dropdown
    myDropdown.appendChild(row);
  });
}

/**
 * request the contents from the CSV node file from the backend as a string
 *
 * @returns a the CSV node files contents as a string
 *
 */
async function getNodeCSVString(): Promise<string> {
  const res = await axios.get("/api/loadCSVFile/CSVnode");

  if (res.status == 200) {
    return res.data as string;
  }
  return "";
}
