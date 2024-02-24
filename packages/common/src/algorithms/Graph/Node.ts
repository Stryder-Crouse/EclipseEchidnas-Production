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
  heuristic:number;

  edges: Array<Edge>;
};




/**
 *
 * @returns a number representing the floor of the node
 *
 * mapping
 * "1" = 3
 * "2" = 4
 * "3" = 5
 * "G" = 2
 * "L1" = 1
 * "L2" = 0
 *
 * */
export function floorToNumber(floor:string){

    switch (floor) {
        case "3": return FloorToIndex.Level3;
        case "2": return FloorToIndex.Level2;
        case "1": return FloorToIndex.Level1;
        case "G": return FloorToIndex.Ground; //no nodes with G floor exist right now (i have asked wong about it)
        case "L1": return FloorToIndex.LowerLevel1;
        case "L2": return FloorToIndex.LowerLevel2;

        default: return FloorToIndex.UNDEFINED;
    }


}

export function floorToString(floor:number){

    switch (floor) {
        case 0: return "L2";
        case 1: return "L1";
        case 2: return "G";
        case 3: return "1";
        case 4: return "2";
        case 5: return "3";

        default: return "FAIL";
    }


}


/**
 *
 * @param n - node to be converted to string
 *
 *
 * @returns a csv representation of the passed node with a \r\n at the end
 */
export function nodeToString(n: Node) {
  return (
    n.id +
    "," +
    n.coordinate.x.toString() +
    "," +
    n.coordinate.y.toString() +
    "," +
    n.floor +
    "," +
    n.building +
    "," +
    n.nodeType +
    "," +
    n.longName +
    "," +
    n.shortName +
    "\r\n"
  );
}

/** Enum to hold the three possible buildings in the hospital */
export enum Buildings {
  B45Francis = "45 Francis",
  Tower = "Tower",
  Shapiro = "Shapiro",
  B15Francis ="15 Francis",
  BTM="BTM",
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

/** Enum to hold the floors internal index numbers in the graph class */
export enum FloorToIndex {
    Level3 = 5,
    Level2 =4,
    Level1=3,
    Ground=2,
    LowerLevel1 =1,
    LowerLevel2 =0,
    UNDEFINED = -99

}

/**
 * @param buildingName - name of the building (string) as defined in the building enum.
 *
 *
 * @returns a Building (enum) that corresponded to the inputted string
 * or Buildings. UNDEFINED if the string does not match a building.
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
  case "15 francis":
      return Buildings.B15Francis;
      case "btm":
          return Buildings.BTM;
    default:
      return Buildings.UNDEFINED;
  }
}

/**
 * @param nodeTypeName - name of the node type (string) as defined in the NodeType enum.
 *
 *
 * @returns a NodeType (enum) that corresponded to the inputted string
 * or NodeType. UNDEFINED if the string does not match a node type.
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

export const NULLNODE:Node = {
    building: Buildings.UNDEFINED,
    coordinate: {x:-100,y:-100},
    edges: [],
    floor: "",
    id: "NULL",
    longName: "",
    nodeType: NodeType.UNDEFINED,
    shortName: "",
    heuristic:-1

};