import "../../css/route-css/nodeEdgeTablePage.css";
import axios from "axios";
import { NodeDataBase } from "../../../../backend/src/DataBaseClasses/NodeDataBase.ts";
import {useEffect} from "react";

let ran = false;
function NodeTable() {
    //todo FNFN fix with proper population code
    useEffect(()=>{
        if(!ran){
            populateNodes().then();

            ran=true;
        }

    },[]);
  return (
    <div className={"table-container"}>
      <span className={"caption-container"}>
        <span className={"table-title"}>Current Node .CSV File</span>
      </span>
      <div className={"table-wrapper"}>
        <table>
          <thead>
            <tr>
              <th>nodeID</th>
              <th>xcoord</th>
              <th>ycoord</th>
              <th>floor</th>
              <th>building</th>
              <th>nodeType</th>
              <th>longName</th>
              <th>shortName</th>
            </tr>
          </thead>
          <tbody id={"table-rows-nodes"}></tbody>
        </table>
      </div>
    </div>
  );
}

console.log("hellohello");
populateNodes().then();

//todo clean up -stryder
async function populateNodes() {
  const nodeData = await axios.get<NodeDataBase[]>("/api/load-nodes");

  //fine dropdown div in the html on the page
  const table = document.getElementById("table-rows-nodes");

  console.log(table);

  //for each node
  nodeData.data.forEach(function (newNode: NodeDataBase) {
    //create tr element to store the record
    const tableRow = document.createElement("tr");
    //create td tags for data from record
    const nodeID = document.createElement("td");
    nodeID.textContent = newNode.nodeID;
    nodeID.setAttribute("class", "node-id");

    const nodeX = document.createElement("td");
    nodeX.textContent = newNode.xcoord.toString();
    const nodeY = document.createElement("td");
    nodeY.textContent = newNode.ycoord.toString();
    const nodeFloor = document.createElement("td");
    nodeFloor.textContent = newNode.floor;
    const nodeBuilding = document.createElement("td");
    nodeBuilding.textContent = newNode.building;
    const nodeNodeType = document.createElement("td");
    nodeNodeType.textContent = newNode.nodeType;
    const nodeLongName = document.createElement("td");
    nodeLongName.textContent = newNode.longName;
    const nodeShortName = document.createElement("td");
    nodeShortName.textContent = newNode.shortName;

    //append data elements together to one row
    tableRow.appendChild(nodeID);
    tableRow.appendChild(nodeX);
    tableRow.appendChild(nodeY);
    tableRow.appendChild(nodeFloor);
    tableRow.appendChild(nodeBuilding);
    tableRow.appendChild(nodeNodeType);
    tableRow.appendChild(nodeLongName);
    tableRow.appendChild(nodeShortName);

    if (table == null) {
      return;
    }

    //add new row element to table
    table.appendChild(tableRow);
  });
}

export default NodeTable;
