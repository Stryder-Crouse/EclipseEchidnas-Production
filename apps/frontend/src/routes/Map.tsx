import axios from "axios";
import { readNodeCSV } from "../../../backend/src/algorithms/readCSV.ts";

import { Node } from "../../../backend/src/algorithms/Graph/Node.ts";

import "./exsampleMap.css";

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

//this is a dupilate from map page so REMOVE IT
async function getNodeCSVString(): Promise<string> {
  const res = await axios.get("/api/loadCSVFile/CSVnode");
  console.log("data");
  console.log(res.data);
  if (res.status == 200) {
    return res.data as string;
  }
  return "";
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
