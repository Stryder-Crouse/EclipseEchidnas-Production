import { Edge } from "../Graph/Edge.ts";
import { Coordinate } from "../Graph/Coordinate.ts";
import { Buildings, Node, NodeType } from "../Graph/Node.ts";

/** Database repersentation of node */
export type EdgeDataBase = {
  edgeID: string;
  startNodeID: string;
  endNodeID: string;
};

export function edgeToEdgeDataBase(ed: Edge) {
  const edgeDB: EdgeDataBase = {
    edgeID: ed.id,
    endNodeID: ed.endNode.id,
    startNodeID: ed.startNode.id,
  };
  return edgeDB;
}

export function edgeDataBasetoEdge(eDB: EdgeDataBase) {
  const emptyCoordinate: Coordinate = {
    x: 1.23456789,
    y: -1.23456789,
  };

  const start: Node = {
    id: eDB.startNodeID,
    coordinate: emptyCoordinate,
    floor: "",
    building: Buildings.UNDEFINED,
    nodeType: NodeType.UNDEFINED,
    longName: "",
    shortName: "",
    edges: [],
      heuristic:-1,
  };

  const end: Node = {
    id: eDB.endNodeID,
    coordinate: emptyCoordinate,
    floor: "",
    building: Buildings.UNDEFINED,
    nodeType: NodeType.UNDEFINED,
    longName: "",
    shortName: "",
    edges: [],
      heuristic:-1,
  };

  const edge: Edge = {
    endNode: end,
    id: eDB.edgeID,
    startNode: start,
      weight:-1,
  };
  return edge;
}
