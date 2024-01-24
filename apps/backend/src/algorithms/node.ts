import { edge } from "./edge.ts";
import { coordinate } from "./coordinate.ts";

export type node = {
  iD: string;
  coordinate: coordinate;
  floor: string;
  building: Buildings;
  nodeType: NodeType;
  longName: string;
  shortName: string;
  edges: Array<edge>;
};

/* Enum to hold the three possible buildings in the hospital */
export enum Buildings {
  B45Francis = "45 Francis",
  Tower = "Tower",
  Shapiro = "Shapiro",
  UNDEFINED = "UNDEFINED",
}

/* Enum to hold all of the possible node types */
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

export function stringToBuilding(str: string) {
  str = str.toLowerCase();
  switch (str) {
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

export function stringToNodeType(str: string) {
  str = str.toUpperCase();
  switch (str) {
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
