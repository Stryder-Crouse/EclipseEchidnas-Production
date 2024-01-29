import axios from "axios";
import {
  readEdgeCSV,
  readNodeCSV,
} from "../../../../backend/src/algorithms/readCSV.ts";

import { Edge } from "../../../../backend/src/algorithms/Graph/Edge.ts";
import { Node } from "../../../../backend/src/algorithms/Graph/Node.ts";
import { Graph } from "../../../../backend/src/algorithms/Graph/Graph.ts";
import { BFS } from "../../../../backend/src/algorithms/Search/BFS.ts";

async function makeEdgeTable() {
  const edges: Array<Edge> = readEdgeCSV(await getEdgeCSVString());

  console.log(edges);

  const table = document.getElementById("edgeTable");

  console.log(table);

  edges.forEach(function (newEdge: Edge) {
    const row = document.createElement("tr");

    row.appendChild(textInElement(newEdge.id, "td"));
    row.appendChild(textInElement(newEdge.startNode.id, "td"));
    row.appendChild(textInElement(newEdge.endNode.id, "td"));

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

async function getNodeCSVString(): Promise<string> {
  const res = await axios.get("/api/loadCVSFile/CVSnode");
  console.log("data");
  console.log(res.data);
  if (res.status == 200) {
    return res.data as string;
  }
  return "";
}

async function printConnectedNodes() {
  const edges: Array<Edge> = readEdgeCSV(await getEdgeCSVString());
  const nodes: Array<Node> = readNodeCSV(await getNodeCSVString());
  const graph = new Graph(nodes, edges);
  console.log("new");
  console.log(graph.getNodes());
  console.log(graph.getAdjList());
  console.log(graph.idToNode("CHALL002L1")); // three nodes
  console.log(graph.idToNode("")); // null
  console.log(
    BFS(graph.idToNode("CHALL002L1"), graph.idToNode("CHALL002L1"), graph),
  ); // singleton list
  console.log(
    BFS(graph.idToNode("CHALL002L1"), graph.idToNode("CHALL013L1"), graph),
  ); // average 8-len path
  console.log(
    BFS(graph.idToNode("GEXIT001L1"), graph.idToNode("GHALL005L1"), graph),
  ); // average 4-len path
  console.log(
    BFS(graph.idToNode("GEXIT001L1"), graph.idToNode("CREST001L1"), graph),
  ); // unconnected, separate buildings; null
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
printConnectedNodes().then();
