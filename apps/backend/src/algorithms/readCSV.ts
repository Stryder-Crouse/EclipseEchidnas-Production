import {
  stringToBuilding,
  stringToNodeType,
  node,
  Buildings,
  NodeType,
} from "./node.ts";
import { edge } from "./edge.ts";
import { coordinate } from "./coordinate.ts";

export function readNodeCSV(fileString: string): Array<node> {
  const nodes: Array<node> = [];

  const allNodesString = fileString;

  if (fileString == null) {
    console.log("noCVSFile Found");
    return [];
  }

  const linesNodes = allNodesString.split("\r\n");

  linesNodes.forEach(function (line) {
    console.log("loading");
    const nodeValues: string[] = line.split(",");
    // make sure all feilds are there and do a non comprhive check to see if the entry is vaild

    //?? replaces the thing before it with the thing afther if the thing before is null
    if (nodeValues.length == 8 && !isNaN(parseInt(nodeValues.at(1) ?? ""))) {
      const nodeCoordinate: coordinate = {
        x: parseInt(nodeValues.at(1) ?? "", 10),
        y: parseInt(nodeValues.at(2) ?? "", 10),
      };

      const newNode: node = {
        iD: nodeValues.at(0) ?? "NO ID",
        coordinate: nodeCoordinate,
        floor: nodeValues.at(3) ?? "UNDEFINED",
        building: stringToBuilding(nodeValues.at(4) ?? Buildings.UNDEFINED),
        nodeType: stringToNodeType(nodeValues.at(5) ?? NodeType.UNDEFINED),
        longName: nodeValues.at(6) ?? "UNDEFINED",
        shortName: nodeValues.at(7) ?? "UNDEFINED",
        edges: [],
      };
      nodes.push(newNode);
    }
  });

  return nodes;
}

//creates non linked edges
export function readEdgeCSVNOLINK(fileString: string): Array<edge> {
  const edges: Array<edge> = [];

  const allEdgesString = fileString;

  if (fileString == null) {
    console.log("noCVSFile Found");
    return [];
  }

  const linesEdges = allEdgesString.split("\r\n");

  linesEdges.forEach(function (line) {
    console.log("loading");
    const edgeValues: string[] = line.split(",");
    // make sure all feilds are there and do a non comprhive check to see if the entry is vaild

    //?? replaces the thing before it with the thing afther if the thing before is null
    if (edgeValues.length == 3 && edgeValues[0] != "edgeID") {
      const emptycoord: coordinate = {
        x: 1.23456789,
        y: -1.23456789,
      };

      const start: node = {
        iD: edgeValues[1],
        coordinate: emptycoord,
        floor: "",
        building: Buildings.UNDEFINED,
        nodeType: NodeType.UNDEFINED,
        longName: "",
        shortName: "",
        edges: [],
      };
      const end: node = {
        iD: edgeValues[2],
        coordinate: emptycoord,
        floor: "",
        building: Buildings.UNDEFINED,
        nodeType: NodeType.UNDEFINED,
        longName: "",
        shortName: "",
        edges: [],
      };

      const newEdge: edge = {
        iD: edgeValues.at(0) ?? "NO ID",
        startNode: start,
        endNode: end,
      };
      edges.push(newEdge);
    }
  });

  return edges;
}
