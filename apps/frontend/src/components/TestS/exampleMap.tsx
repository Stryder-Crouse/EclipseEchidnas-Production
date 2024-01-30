import axios from "axios";
import {
  readEdgeCSV,
  readNodeCSV,
} from "../../../../backend/src/algorithms/readCSV.ts";

import { Edge } from "../../../../backend/src/algorithms/Graph/Edge.ts";
import { Node } from "../../../../backend/src/algorithms/Graph/Node.ts";
import { BFS } from "../../../../backend/src/algorithms/Search/BFS.ts";
import { Graph } from "../../../../backend/src/algorithms/Graph/Graph.ts";

import "./exsampleMap.css";

async function makeNodesExsample() {
  const nodes: Array<Node> = readNodeCSV(await getNodeCSVString());

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
  //textInElement("g", "d");
}

/**
 * creates all edge path between nodes
 *
 */
async function makeFullPath() {
  //load edges from file and connect themCHANGE LAYER
  const edges: Array<Edge> = readEdgeCSV(await getEdgeCSVString());
  const nodes: Array<Node> = readNodeCSV(await getNodeCSVString());
  const graph: Graph = new Graph(nodes, edges);

  //find svg map
  const map = document.getElementById("map");

  //for each edge add a path between two nodes
  graph.getEdges().forEach(function (newEdge: Edge) {
    //newPath to show edge
    const newPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );

    newPath.setAttribute("stroke", "black");
    newPath.setAttribute("x1", newEdge.startNode.coordinate.x.toString());
    newPath.setAttribute("y1", newEdge.startNode.coordinate.y.toString());
    newPath.setAttribute("x2", newEdge.endNode.coordinate.x.toString());
    newPath.setAttribute("y2", newEdge.endNode.coordinate.y.toString());

    if (map == null) {
      return;
    }
    //add a path to map
    map.appendChild(newPath);
  });
}

/**
 * creates the node objects on the map though html DOM
 *
 */
async function makeNodes() {
  //load nodes from file CHANGE LAYER
  const nodes: Array<Node> = readNodeCSV(await getNodeCSVString());

  //find svg map
  const map = document.getElementById("map");

  //for each node add it to the file
  nodes.forEach(function (newNode: Node) {
    //atag to contain link / make it clickable also contatins the circle within it
    const aTag = document.createElementNS("http://www.w3.org/2000/svg", "a");
    //circle to show node
    const newNodeCircle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    //middle coordnate from circle
    newNodeCircle.setAttribute("cx", newNode.coordinate.x.toString());
    newNodeCircle.setAttribute("cy", newNode.coordinate.y.toString());
    //id is node id
    newNodeCircle.setAttribute("id", newNode.id);
    //circle radius
    newNodeCircle.setAttribute("r", "10");
    //color
    newNodeCircle.setAttribute("fill", "blue");

    //give a link to the a tag
    aTag.setAttribute(
      "href",
      "https://www.youtube.com/watch?v=uRlmjiwgbXY&ab_channel=BrosFOURRSpeed",
    );
    //add circle to a tag
    aTag.appendChild(newNodeCircle);
    if (map == null) {
      return;
    }
    //add a tag to map
    map.appendChild(aTag);
  });
}

async function getEdgeCSVString(): Promise<string> {
  const res = await axios.get("/api/loadCSVFile/CSVedge");
  console.log("data");
  console.log(res.data);
  if (res.status == 200) {
    return res.data as string;
  }
  return "";
}

async function getNodeCSVString(): Promise<string> {
  const res = await axios.get("/api/loadCSVFile/CSVnode");
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
makeFullPath().then();
makeNodesExsample().then();
printConnectedNodes().then();
