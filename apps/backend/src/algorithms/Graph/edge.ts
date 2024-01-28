import { node } from "./node.ts";
/** TS struct to hold an edge between nodes */
export type edge = {
  iD: string;
  startNode: node;
  endNode: node;
};
