import axios from "axios";
import { readNodeCSV } from "../../../../backend/src/algorithms/readCSV.ts";

import { Node } from "../../../../backend/src/algorithms/Graph/Node.ts";

async function makeNodeTable() {
  const nodes: Array<Node> = readNodeCSV(await getNodeCSVString());

  console.log(nodes);

  const table = document.getElementById("nodeTable");

  console.log(table);

  nodes.forEach(function (newNode: Node) {
    const row = document.createElement("tr");

    row.appendChild(textInElement(newNode.id, "td"));
    row.appendChild(textInElement(newNode.coordinate.x.toString(), "td"));
    row.appendChild(textInElement(newNode.coordinate.y.toString(), "td"));
    row.appendChild(textInElement(newNode.building, "td"));
    row.appendChild(textInElement(newNode.nodeType, "td"));
    row.appendChild(textInElement(newNode.longName, "td"));
    row.appendChild(textInElement(newNode.shortName, "td"));

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

async function getNodeCSVString(): Promise<string> {
  const res = await axios.get("/api/loadCVSFile/CVSnode");
  console.log("data");
  console.log(res.data);
  if (res.status == 200) {
    return res.data as string;
  }
  return "";
}
//this is a basic counter component to show where components should be placed
export function ExampleComponentStryderNode() {
  //the html returned from the component
  return (
    <div className={"stryders-component"}>
      <table>
        <tbody id={"nodeTable"}>
          <tr>
            <th>ID</th>
            <th>X</th>
            <th>Y</th>
            <th>Floor</th>
            <th>building</th>
            <th>nodeType</th>
            <th>longName</th>
            <th>shortName</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

//creates table
makeNodeTable().then();
