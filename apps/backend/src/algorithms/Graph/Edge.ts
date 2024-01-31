import { Node } from "./Node.ts";
/** TS struct to hold an edge between nodes */
export type Edge = {
  id: string;
  startNode: Node;
  endNode: Node;
};
