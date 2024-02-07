import React, {useEffect} from "react";
import { EdgeDataBase } from "../../../../backend/src/DataBaseClasses/EdgeDataBase.ts";
import axios from "axios";
import "../../css/route-css/nodeEdgeTablePage.css";

let ran = false;

function EdgeTable() {
    //todo FNFN fix with proper population code
    useEffect(()=>{
        if(!ran){
            populateEdges().then();

            ran=true;
        }

    },[]);
  return (
    <div className={"table-container"}>
      <span className={"caption-container"}>
        <span className={"table-title"}>Current Edge .CSV File</span>
      </span>
      <div className={"table-wrapper"}>
        <table>
          <thead>
            <tr>
              <th>edgeID</th>
              <th>startNode</th>
              <th>endNode</th>
            </tr>
          </thead>
          <tbody id={"table-rows-edges"}></tbody>
        </table>
      </div>
    </div>
  );
}
onload = () => {
  populateEdges().then();
};

//todo clean up -stryder
async function populateEdges() {
  const edgeData = await axios.get<EdgeDataBase[]>("/api/load-edges");

  //fine dropdown div in the html on the page
  const table = document.getElementById("table-rows-edges");

  console.log(table);

  //for each node
  edgeData.data.forEach(function (newEdge: EdgeDataBase) {
    //create tr element to store the record
    const tableRow = document.createElement("tr");
    //create td tags for data from record
    const edgeID = document.createElement("td");
    edgeID.textContent = newEdge.edgeID;
    edgeID.setAttribute("class", "node-id");

    const edgeStart = document.createElement("td");
    edgeStart.textContent = newEdge.startNodeID;

    const edgeEnd = document.createElement("td");
    edgeEnd.textContent = newEdge.endNodeID;

    //append data elements together to one row
    tableRow.appendChild(edgeID);
    tableRow.appendChild(edgeStart);
    tableRow.appendChild(edgeEnd);
    if (table == null) {
      return;
    }

    //add new row element to table
    table.appendChild(tableRow);
  });
}

export default EdgeTable;
