import { Edge } from "./Edge.ts";
import { Coordinate } from "./Coordinate.ts";
/** Type to store inputted nodes.*/
export type Node = {
  id: string;
  coordinate: Coordinate;
  floor: string;
  building: Buildings;
  nodeType: NodeType;
  longName: string;
  shortName: string;
  edges: Array<Edge>;
};

/** Enum to hold the three possible buildings in the hospital */
export enum Buildings {
  B45Francis = "45 Francis",
  Tower = "Tower",
  Shapiro = "Shapiro",
  UNDEFINED = "UNDEFINED",
}

/** Enum to hold all the possible node types */
export enum NodeType {
  CONF = "CONF",
  DEPT = "DEPT",
  HALL = "HALL",
  LABS = "LABS",
  REST = "REST",
  RETL = "RETL",
  SERV = "SERV",
  ELEV = "ELEV",
  EXIT = "EXIT",
  STAI = "STAI",
  UNDEFINED = "UNDEFINED",
}

/**
 * @param buildingName - name of the building (string) as defined in the building enum.
 *
 *
 * @returns a Building (enum) that corresponded to the inputted string
 * or Buildings.UNDEFINED if the string does not match a building.
 *
 */
export function stringToBuilding(buildingName: string) {
  buildingName = buildingName.toLowerCase();
  switch (buildingName) {
    case "45 francis":
      return Buildings.B45Francis;
    case "tower":
      return Buildings.Tower;
    case "shapiro":
      return Buildings.Shapiro;
    default:
      return Buildings.UNDEFINED;
  }
}

/**
 * @param nodeTypeName - name of the node type (string) as defined in the NodeType enum.
 *
 *
 * @returns a NodeType (enum) that corresponded to the inputted string
 * or NodeType.UNDEFINED if the string does not match a node type.
 *
 */
export function stringToNodeType(nodeTypeName: string) {
  nodeTypeName = nodeTypeName.toUpperCase();
  switch (nodeTypeName) {
    case "CONF":
      return NodeType.CONF;
    case "DEPT":
      return NodeType.DEPT;
    case "HALL":
      return NodeType.HALL;
    case "LABS":
      return NodeType.LABS;
    case "REST":
      return NodeType.REST;
    case "RETL":
      return NodeType.RETL;
    case "SERV":
      return NodeType.SERV;
    case "ELEV":
      return NodeType.ELEV;
    case "EXIT":
      return NodeType.EXIT;
    case "STAI":
      return NodeType.STAI;
    default:
      return NodeType.UNDEFINED;
  }
}
