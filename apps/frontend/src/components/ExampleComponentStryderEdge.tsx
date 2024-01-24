import axios from "axios";
import { readEdgeCSVNOLINK } from "../../../backend/src/algorithms/readCSV.ts";

import { edge } from "../../../backend/src/algorithms/edge.ts";

async function makeEdgeTable() {
  const edges: Array<edge> = readEdgeCSVNOLINK(await getEdgeCSVString());

  console.log(edges);

  const table = document.getElementById("edgeTable");

  console.log(table);

  edges.forEach(function (newEdge: edge) {
    const row = document.createElement("tr");

    row.appendChild(textInElement(newEdge.iD, "td"));
    row.appendChild(textInElement(newEdge.startNode.iD, "td"));
    row.appendChild(textInElement(newEdge.endNode.iD, "td"));

    if (table == null) {
      return;
    }
    table.appendChild(row);
  });
}

function textInElement(text: string, element: string) {
  const elem = document.createElement(element);
  elem.textContent = text;
  return elem;
}

async function getEdgeCSVString(): Promise<string> {
  const res = await axios.get("/api/loadCVSFile/CVSedge");
  console.log("data");
  console.log(res.data);
  if (res.status == 200) {
    return res.data as string;
  }
  return "";
}

//this is a basic counter component to show where components should be placed
export function ExampleComponentStryderEdge() {
  //the html returned from the component
  return (
    <div className={"stryders-component2"}>
      <table>
        <tbody id={"edgeTable"}>
          <tr>
            <th>ID</th>
            <th>start</th>
            <th>end</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

//populate the table afther load
makeEdgeTable().then();
