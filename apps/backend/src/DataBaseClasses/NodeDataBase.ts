import { Buildings, NodeType } from "../algorithms/Graph/Node.ts";
import { Node } from "../algorithms/Graph/Node.ts";
import { Coordinate } from "../algorithms/Graph/Coordinate.ts";
export type NodeDataBase = {
  nodeID: string;
  floor: string;
  building: Buildings;
  nodeType: NodeType;
  longName: string;
  shortName: string;
  xcoord: number;
  ycoord: number;
};

export function nodeToNodeDataBase(algoNode: Node) {
  const nodeDB: NodeDataBase = {
    building: algoNode.building,
    floor: algoNode.floor,
    longName: algoNode.longName,
    nodeType: algoNode.nodeType,
    shortName: algoNode.shortName,
    xcoord: algoNode.coordinate.x,
    ycoord: algoNode.coordinate.y,
    nodeID: algoNode.id,
  };
  return nodeDB;
}

export function nodeDataBaseToNode(dbNode: NodeDataBase) {
  const cord: Coordinate = {
    x: dbNode.xcoord,
    y: dbNode.ycoord,
  };

  const node: Node = {
    building: dbNode.building,
    coordinate: cord,
    edges: [],
    floor: dbNode.floor,
    id: dbNode.nodeID,
    longName: dbNode.longName,
    nodeType: dbNode.nodeType,
    shortName: dbNode.shortName,
  };
  return node;
}