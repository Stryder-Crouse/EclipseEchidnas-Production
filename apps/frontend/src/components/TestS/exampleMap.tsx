import axios from "axios";
import {
  readEdgeCSV,
  readNodeCSV,
} from "../../../../backend/src/algorithms/readCSV.ts";

import { edge } from "../../../../backend/src/algorithms/Graph/edge.ts";
import { node } from "../../../../backend/src/algorithms/Graph/node.ts";
import { Graph } from "../../../../backend/src/algorithms/Graph/Graph.ts";
import { bfs } from "../../../../backend/src/algorithms/bfs/bfs.ts";
import "./exsampleMap.css";

async function makeNodesExsample() {
  const nodes: Array<node> = readNodeCSV(await getNodeCSVString());

  console.log(nodes);

  const map = document.getElementById("map");
  const aTag = document.createElementNS("http://www.w3.org/2000/svg", "a");
  const newRect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect",
  );
  newRect.setAttribute("x", "439");
  newRect.setAttribute("y", "243");
  newRect.setAttribute("fill", "blue");
  newRect.setAttribute("width", "413");
  newRect.setAttribute("height", "460");
  aTag.setAttribute(
    "href",
    "https://www.youtube.com/watch?v=uRlmjiwgbXY&ab_channel=BrosFOURRSpeed",
  );
  if (map == null) {
    return;
  }
  //aTag.appendChild(newRect);
  aTag.appendChild(newRect);
  map.appendChild(aTag);
  textInElement("g", "d");
}

async function makeNodes() {
  const nodes: Array<node> = readNodeCSV(await getNodeCSVString());

  console.log(nodes);

  const map = document.getElementById("map");
  nodes.forEach(function (newNode: node) {
    const aTag = document.createElementNS("http://www.w3.org/2000/svg", "a");
    const newNodeCircle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    newNodeCircle.setAttribute("cx", newNode.coordinate.x.toString());
    newNodeCircle.setAttribute("cy", newNode.coordinate.y.toString());
    newNodeCircle.setAttribute("id", newNode.iD);
    newNodeCircle.setAttribute("r", "10");
    newNodeCircle.setAttribute("fill", "blue");

    aTag.setAttribute(
      "href",
      "https://www.youtube.com/watch?v=uRlmjiwgbXY&ab_channel=BrosFOURRSpeed",
    );
    aTag.appendChild(newNodeCircle);
    if (map == null) {
      return;
    }
    map.appendChild(aTag);
  });
  //aTag.appendChild(newRect);
  textInElement("g", "d");
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
  const edges: Array<edge> = readEdgeCSV(await getEdgeCSVString());
  const nodes: Array<node> = readNodeCSV(await getNodeCSVString());
  const graph = new Graph(nodes, edges);
  console.log("new");
  console.log(graph.getNodes());
  console.log(graph.getAdjList());
  console.log(graph.idToNode("CHALL002L1")); // three nodes
  console.log(graph.idToNode("")); // null
  console.log(
    bfs(graph.idToNode("CHALL002L1"), graph.idToNode("CHALL002L1"), graph),
  ); // singleton list
  console.log(
    bfs(graph.idToNode("CHALL002L1"), graph.idToNode("CHALL013L1"), graph),
  ); // average 8-len path
  console.log(
    bfs(graph.idToNode("GEXIT001L1"), graph.idToNode("GHALL005L1"), graph),
  ); // average 4-len path
  console.log(
    bfs(graph.idToNode("GEXIT001L1"), graph.idToNode("CREST001L1"), graph),
  ); // unconnected, separate buildings; null
}

//this is a basic counter component to show where components should be placed
export function MapExample() {
  //the html returned from the component
  return (
    <div id={"map-test"}>
      <svg
        id="map"
        className={"map-test"}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 5000 3400"
      >
        <use xmlnsXlink="http://www.w3.org/1999/xlink"></use>
        <image
          width="5000"
          height="3400"
          href="/src/components/00_thelowerlevel1.png"
        ></image>
        <a href="https://www.w3schools.com/tags/tag_img.asp">
          <rect
            x="0"
            y="0"
            fill="#fff"
            opacity="0"
            width="378"
            height="214"
          ></rect>
        </a>
      </svg>
    </div>
  );
}
makeNodes().then();
makeNodesExsample().then();
printConnectedNodes().then();
