/* TS struct to hold an edge between nodes */
import { node } from "./node.ts";

export type edge = {
  iD: string;
  startNode: node;
  endNode: node;
};
