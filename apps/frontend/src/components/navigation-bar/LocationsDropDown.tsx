import React, {useEffect, useState} from "react";
import "../../css/component-css/NavBar.css";
import "../../css/component-css/Map.css";
import axios from "axios";
import { Node } from "../../../../../packages/common/src/algorithms/Graph/Node.ts";
import {
  onNodeHover,
  onNodeLeave,
} from "../../event-logic/circleNodeEventHandlers.ts";
import {
  NodeDataBase,
  nodeDataBaseToNode,
} from "../../../../../packages/common/src/algorithms/DataBaseClasses/NodeDataBase.ts";

let ran=false;
export default function LocationsDropDown() {
  const [showDropdown, setShowDropdown] = useState(false);
  // const [filterValue, setFilterValue] = useState('');

    //todo FNFN fix with proper population code
    useEffect(()=>{

        if(!ran){
            populateLocationDropdown().then();
            ran=true;
        }

    },[]);


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

//populate the dropdown with locations on page load
// submitNodes().then(() => {
//   submitEdges().then();
//
// }); //populates the Node table



// //submitEdges().then();
// //submitEdges(); //populates the Edge table
// getNodes().then(); //send a get request to server and received info about all nodes (uncomment to use)
// getEdges().then();

/**
 * This function populates the Dropdown div with the locations represented by nodes.
 * SHOULD ONLY BE RUN ONCE.
 */
async function populateLocationDropdown() {
  //read node file and create the nodes
  //load edges and node from database
  const nodesDB = await axios.get<NodeDataBase[]>("/api/load-nodes");

  const nodes: Array<Node> = [];

  nodesDB.data.forEach((nodeDB) => {
    nodes.push(nodeDataBaseToNode(nodeDB));
  });

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

    //set an event listener to call onHover on mouseover (CHECK IF THERE IS A BETTER WAY TO DO THIS)
    console.log(newNode.id);
    console.log("d");
    row.addEventListener("mouseover", () => {
      onNodeHover(newNode.id);
    });
    row.addEventListener("mouseleave", () => {
      onNodeLeave(newNode.id);
    });

    if (myDropdown == null) {
      return;
    }

    //add new a element to dropdown
    myDropdown.appendChild(row);
  });
}

/*async function getNodeCSVString(): Promise<string> {
  const res = await axios.get("/api/loadCSVFile/CSVnode");
  console.log("data");
  console.log(res.data);
  if (res.status == 200) {
    return res.data as string;
  }
  return "";
}*/

//dont delete - stryder
// /**
//  *
//  * @returns a node array of nodes in the database
//  *
//  */
// async function getNodes() {
//   try {
//     //MAKE SURE TO PASS THE TYPE axios.get<TYPE> to get the data out correctly
//     //the node[] make the data a node array type (axios does the conversion for us)
//     const response = await axios.get<Node[]>("/api/load-nodes");
//     console.log(response);
//     return response.data;
//   } catch (err) {
//     throw new Error("Error getting Nodes");
//   }
// }
//
// /**
//  *
//  *
//  * @returns an edge array of nodes in the database
//  *
//  */
// async function getEdges() {
//   try {
//     const response = await axios.get<Edge[]>("/api/load-edges");
//     console.log(response);
//     console.log(response.data);
//     //create node obj from responses
//     //response.data;
//   } catch (err) {
//     throw new Error("Error getting Edges");
//   }
// }
//
// /**
//  *
//  * loads nodes into the database
//  *
//  * */
// async function submitNodes() {
//   const data = JSON.stringify({}); //making a JSON format file from input Nodes
//   console.log(data);
//   //sends a post request the /api/load-db     (server accessing this api)
//   try {
//     await axios.post("/api/load-nodes", data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (err) {
//     throw new Error("Error with loading Nodes");
//   }
// }
// /**
//  *
//  * loads edges into the database
//  *
//  * */
// async function submitEdges() {
//   const data = JSON.stringify({}); //making a JSON format file from input Nodes
//   console.log(data);
//   //sends a post request the /api/load-db     (server accessing this api)
//   try {
//     await axios.post("/api/load-edges", data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (err) {
//     throw new Error("Error with loading Edges");
//   }
// }
