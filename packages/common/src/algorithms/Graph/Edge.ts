import { NodeForGraph, NULLNODE} from "./NodeForGraph.ts";
/** TS struct to hold an edge between nodes */
export type Edge = {
  id: string;
  startNode: NodeForGraph;
  endNode: NodeForGraph;
  weight:number;

};

export const NULLEDGE:Edge = {
    endNode: NULLNODE, id: "NULL", startNode: NULLNODE, weight: -1

};
/**
 *
 * @param edge - edge to be converted to string
 *
 *
 * @returns a csv representation of the passed edge with a \r\n at the end
 */
export function edgeToString(edge: Edge) {
  return edge.id + "," + edge.startNode.id + "," + edge.endNode.id + "\r\n";
}
