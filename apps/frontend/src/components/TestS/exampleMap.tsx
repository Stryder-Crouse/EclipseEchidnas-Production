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
 * @param startNodeID the ID of the starting node to path find from
 * @param endNodeID the ID of the goal node
 *
 * Creates a path from startNode to endNode on the map if the path exists
 *
 */
async function makePath(startNodeID: string, endNodeID: string) {
  //load edges from file and connect them CHANGE LAYER
  const edges: Array<Edge> = readEdgeCSV(await getEdgeCSVString());
  const nodes: Array<Node> = readNodeCSV(await getNodeCSVString());
  const graph: Graph = new Graph(nodes, edges);

  //find path with bfs
  const path: Array<Node> | null = BFS(
    graph.idToNode(startNodeID),
    graph.idToNode(endNodeID),
    graph,
  );

  //error is no path could be found
  if (path == null) {
    console.error(
      "no path could be found between " +
        graph.idToNode(startNodeID)?.id +
        " and " +
        graph.idToNode(endNodeID)?.id,
    );
    return;
  }

  //find svg map element
  const map = document.getElementById("map");

  //draw path onto map
  for (let i = 0; i < path.length - 1; i++) {
    //create new svg line obj
    const newLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );

    //get node at start of line and end of line
    const start = path.at(i) ?? null;
    const end = path.at(i + 1) ?? null;

    if (start == null || end == null) {
      console.error("a node is the path in null ");
      return;
    }

    //add node cordnates to the line obj
    newLine.setAttribute("stroke", "black");
    newLine.setAttribute("stroke-width", "5");
    newLine.setAttribute("x1", start.coordinate.x.toString());
    newLine.setAttribute("y1", start.coordinate.y.toString());
    newLine.setAttribute("x2", end.coordinate.x.toString());
    newLine.setAttribute("y2", end.coordinate.y.toString());
    if (map == null) {
      console.error("map html obj could not be fond");
      return;
    }
    //add line onto map
    map.appendChild(newLine);
  }
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
makePath("CCONF003L1", "CHALL014L1").then();
makeNodesExsample().then();
printConnectedNodes().then();
