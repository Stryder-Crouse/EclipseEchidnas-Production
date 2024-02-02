import { Node } from "./Node.ts";
/** TS struct to hold an edge between nodes */
export type Edge = {
  id: string;
  startNode: Node;
  endNode: Node;
};

export function edgeToString(edge: Edge) {
  return edge.id + "," + edge.startNode.id + "," + edge.endNode.id + "\r\n";
}
