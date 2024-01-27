import { node } from "./node.ts";
import { edge } from "./edge.ts";

/**
 * Class that represents an undirected graph
 */
export class Graph {
  /** Stores all nodes in the graph*/
  private readonly nodes: Array<node>;
  /** Stores all edges in the graph*/
  private readonly edges: Array<edge>;
  /** Stores a map that maps a node obj to at list of node obj
   * adjacent to it in the graph*/
  private readonly adjacent: Map<node, Array<node>>;
  /** Stores a map that maps a node id (string) to its
   * corresponding node*/
  private readonly idLookup: Map<string, node>;

  /**
   * Constructs a graph based on the pass nodes and edges
   *
   * @param unLinkedNodes - a list of nodes to add edges to
   * @param edges - edges to be added to the list of nodes to create the graph
   *
   */
  constructor(unLinkedNodes: Array<node>, edges: Array<edge>) {
    //create map to relate node id strings to their corresponding node obj
    const nodeMap = new Map<string, node>();
    //create map relate a node obj to the list of nodes it is adjacent to
    const adj = new Map<node, Array<node>>();

    //for each inputted node
    unLinkedNodes.forEach(function (node) {
      //map node id to its node
      nodeMap.set(node.iD, node);
      //map node to and empty node array to be filled later
      adj.set(node, new Array<node>());
    });

    //for each inputted edge
    edges.forEach(function (edge) {
      //find start and end node objs in the inputted node list
      const startNode = nodeMap.get(edge.startNode.iD) ?? null;
      const endNode = nodeMap.get(edge.endNode.iD) ?? null;

      //make sure both nodes exist if not exit
      if (startNode == null) {
        console.error("startNode for edge not found");
        return;
      }
      if (endNode == null) {
        console.error("endNode for edge not found");
        return;
      }

      // replace nodes in edge with the corresponding Nodes
      edge.startNode = startNode;
      edge.endNode = endNode;

      /* add edges */

      //add edge to its starting node
      startNode.edges.push(edge);

      // create reverse edge for other node
      const backEdge: edge = {
        iD: edge.endNode.iD + "_" + edge.startNode.iD,
        startNode: edge.endNode,
        endNode: edge.startNode,
      };
      //add backEdge to endNode
      endNode.edges.push(backEdge);

      /* create adjList */
      //load Adj list for start and end node of edge
      const startAdj = adj.get(startNode) ?? null;
      const endAdj = adj.get(endNode) ?? null;

      if (startAdj == null) {
        console.error("startAdj for node not found");
        return;
      }
      if (endAdj == null) {
        console.error("endAdj for node not found");
        return;
      }

      //add endNode to startNode adjacency list
      startAdj.push(endNode);
      //add startNode to endNode adjacency list
      endAdj.push(startNode);
    });

    //set obj variables
    this.nodes = unLinkedNodes;
    this.edges = edges;
    this.adjacent = adj;
    this.idLookup = nodeMap;
  }

  /**
   * @returns a array of nodes present in the graph
   */
  public getNodes(): Array<node> {
    return this.nodes;
  }

  /**
   * @returns a array of edges present in the graph
   */
  public getEdges(): Array<edge> {
    return this.edges;
  }

  /**
   * @returns a map which maps a node (obj) to an array of its adjacent nodes
   */
  public getAdjList(): Map<node, Array<node>> {
    return this.adjacent;
  }

  /**
   *
   * @param nodeID - node id as a string
   * @returns returns a node with the corresponding ID or null if node not found
   *
   */
  public idToNode(nodeID: string): node | null {
    return this.idLookup.get(nodeID) ?? null;
  }

  /**
   *
   * @param someNode - a node obj
   * @returns an array of nodes that are adjacent to the passed node or null if node not found
   *
   */
  public adjacentTo(someNode: node): Array<node> | null {
    return this.adjacent.get(someNode) ?? null;
  }
}
