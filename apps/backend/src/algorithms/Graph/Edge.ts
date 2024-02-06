import { Node } from "./Node.ts";
/** TS struct to hold an edge between nodes */
export type Edge = {
  id: string;
  startNode: Node;
  endNode: Node;
  weight:number;

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
