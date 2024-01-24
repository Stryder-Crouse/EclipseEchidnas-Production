import { node } from "./node.ts";
import { edge } from "./edge.ts";

export class Graph {
  nodes: Array<node>;
  edges: Array<edge>;

  constructor(unLinkedNodes: Array<node>, edges: Array<edge>) {
    //create map
    const nodeMap = new Map<string, node>();

    unLinkedNodes.forEach(function (node) {
      nodeMap.set(node.iD, node);
    });

    edges.forEach(function (edge) {
      const startNode = nodeMap.get(edge.startNode.iD) ?? null;
      const endNode = nodeMap.get(edge.endNode.iD) ?? null;

      if (startNode == null) {
        console.error("startnode for edge not found");
        return;
      }
      if (endNode == null) {
        console.error("endnode for edge not found");
        return;
      }
      //replace node in edge with correct Node
      edge.startNode = startNode;
      edge.endNode = endNode;

      startNode.edges.push(edge);

      //create reverse edge for other node
      const backEdge: edge = {
        iD: edge.endNode.iD + "_" + edge.startNode.iD,
        startNode: edge.endNode,
        endNode: edge.startNode,
      };

      endNode.edges.push(backEdge);
    });

    this.nodes = unLinkedNodes;
    this.edges = edges;
  }
}
