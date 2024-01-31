import React, { useEffect } from "react";
import "./component-css/NavBar.css";
import { Node } from "../../../backend/src/algorithms/Graph/Node.ts";
import { readNodeCSV } from "../../../backend/src/algorithms/readCSV.ts";
import axios from "axios";

let loadedLocations = false;

export default function NavBar() {
  useEffect(() => {
    //make sure it only runs once (useEffect is called twice in development)
    if (!loadedLocations) {
      populateLocationDropdown().then();
      loadedLocations = true;
    }
  }, []);

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
