import {Buildings, floorToNumber, Node, nodeToString, NodeType} from "./Node.ts";
import {Edge, edgeToString} from "./Edge.ts";

/**
 * Class that represents an undirected graph
 */
export class Graph {
  /** Stores all nodes in the graph*/
  private readonly nodes: Array<Node>;
  /** Stores all edges in the graph*/
  private readonly edges: Array<Edge>;
  /** Stores a map that maps a node obj to at list of node obj
   * adjacent to it in the graph*/
  private readonly adjacent: Map<Node, Array<Node>>;
  /** Stores a map that maps a node id (string) to its
   * corresponding node*/
  private readonly idLookup: Map<string, Node>;

  /**
   * Stores, by every floor, what nodes are stairs and elevators
   * this will be used in computation of the heuristic so by storing it we save re-computation every time a path is requested.
   * index will be as follows
   * 0 = Lower level 2
   * 1 = Lower level 1
   * 2 = ground floor
   * 3 = level 1
   * 4 = level 2
   * 5 = level 3
   * */
  private readonly transitionNodesByFloor: Array<Array<Node>>;

  /**
   * Constructs a graph based on the pass nodes and edges
   *
   * @param unLinkedNodes - a list of nodes to add edges to
   * @param edges - edges to be added to the list of nodes to create the graph
   *
   */
  constructor(unLinkedNodes: Array<Node>, edges: Array<Edge>) {
    //create map to relate node id strings to their corresponding node obj
    const nodeMap = new Map<string, Node>();
    //create map relate a node obj to the list of nodes it is adjacent to
    const adj = new Map<Node, Array<Node>>();

    //set up empty arrays for to be filled to set transitionNodesByFloor
    const transitionNodesByFloor: Array<Array<Node>> =[[],[],[],[],[],[]];

    //for each inputted node
    unLinkedNodes.forEach(function (node) {
      //map node id to its node
      nodeMap.set(node.id, node);
      //map node to and empty node array to be filled later
      adj.set(node, new Array<Node>());

      //set up transitionNodesByFloor array
        // if a node is a stair or an elevator then add it to is corresponding floor array
        if(node.nodeType==NodeType.STAI || node.nodeType==NodeType.ELEV){
            //if floor data corrupted dont add the node
            if(floorToNumber(node.floor) == -99){
                return;
            }
            //add node to correct floor array
            transitionNodesByFloor[floorToNumber(node.floor)].push(node);
        }

    });

    //set transitionNodesByFloor
      this.transitionNodesByFloor =transitionNodesByFloor;
      console.log(this.transitionNodesByFloor);

    //for each inputted edge
    edges.forEach(function (edge) {
      //find start and end node objs in the inputted node list
      const startNode = nodeMap.get(edge.startNode.id) ?? null;
      const endNode = nodeMap.get(edge.endNode.id) ?? null;

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
      const backEdge: Edge = {
        id: edge.endNode.id + "_" + edge.startNode.id,
        startNode: edge.endNode,
        endNode: edge.startNode,
          weight:-1
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

    //generate weights for edges
      this.generateWeights();
  }


    /**
     * Generates the weights (Euclidean distance in pixels)  for the edges in the graph
     *
     * note that if an edge in the graph start and ends with elevator nodes the edge's weight is set to 1
     */
    //todo need tests
  private generateWeights(){

      //for each edge
      this.edges.forEach(function (edge: Edge) {

          //if the edge starts and ends at elevator nodes or stair nodes then make its weight 1
          if(
              (edge.startNode.nodeType == NodeType.ELEV && edge.endNode.nodeType == NodeType.ELEV)
              ||
              (edge.startNode.nodeType == NodeType.STAI && edge.endNode.nodeType == NodeType.STAI)

          ){
              edge.weight = 1;
          }
          // else find Euclidean distance of the edge and set it as the weight
          else {

              const xDistance = edge.endNode.coordinate.x - edge.startNode.coordinate.x;
              const yDistance = edge.endNode.coordinate.y - edge.startNode.coordinate.y;

              edge.weight = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
          }

      });

  }

    /**
     *
     *
     * @param goalNode - goal node to calculate the Heuristic from.
     *
     *  calculates the heuristic (Euclidean distance to goal node) for each node in the graph
     *
     *  if the goal node is on a different floor compared to the starting node::
     *
     *  then the algorithm will weight the edges
     *  on the interim floors depending on that's floors distance from the goal floor.
     *
     *  for example if start node is on level 1 and goal is on level 3
     *
     *  the heuristic for all nodes on level 1 will have +10000 added to them
     *  the heuristic for all nodes on level 2 will have +5000 added to them
     *  the heuristic for all nodes on level 3 will not be changed
     *
     *  effectively for each floor of difference between the current node and the goal node +5000 of arbitrary weight is added.
     *
     *  this additional weight is needed to prevent the algorithms from going up and down between floors it has already
     *  visited. (unless it absolutely has to)
     *
     *
     *  the goal node for the interim floors will instead be the closest stairs or elevator that allows the path to
     *  move to a closer floor to the goal node.
     *
     *
     *
     */
    //todo need tests
  public generateNodeHeuristic(startNode:Node , goalNode:Node){

      const goalFloor = floorToNumber(goalNode.floor);
        console.log(goalFloor);

        /*this.nodes.forEach(function (node:Node) {


        });*/
        //for each node
            // if it is one the same floor
                // Heuristic is its distance to the goal node
            //if it is not on the same floor
                //find the closest elevator or stairs that allows the path to get to a closer floor
                // and consider that elevator or stairs the goal node
                // Heuristic is the penalty for being on a different floor + its distance to the closest valid elevator or stairs

  }

  /**
   * @returns outputs a string in csv formats of all the nodes in the graph
   *
   * */
  public nodesToString() {
    let str = "";

    //if an undefined node is found then uses this error node in place
    const failNode: Node = {
      building: Buildings.UNDEFINED,
      coordinate: { x: 1, y: 1 },
      edges: [],
      floor: "",
      id: "FAIL",
      longName: "",
      nodeType: NodeType.UNDEFINED,
      shortName: "",
        heuristic:-1
    };

    //for each node convert it into a csv representation and add it to the string output
    for (let i = 0; i < this.getNodes().length; i++) {
      if (this.getNodes().at(i) != null || undefined) {
        str += nodeToString(this.getNodes().at(i) ?? failNode);
      }
    }
    return str;
  }

/**
 * @returns outputs a string in csv formats of all the edges in the graph
 *
 * */
  public edgesToString() {
    let str = "";

    //if an undefined node is found then uses this error node in place
    const failNode: Node = {
      building: Buildings.UNDEFINED,
      coordinate: { x: 1, y: 1 },
      edges: [],
      floor: "",
      id: "FAIL",
      longName: "",
      nodeType: NodeType.UNDEFINED,
      shortName: "",
        heuristic:-1
    };
    //if an undefined edge  is found then uses this error edge in place
    const failEdge: Edge = {
      endNode: failNode,
      id: "FAIL",
      startNode: failNode,
        weight:-1
    };

    //for each edge convert it into a csv representation and add it to the string output
    for (let i = 0; i < this.getEdges().length; i++) {
      if (this.getEdges().at(i) != null || undefined) {
        str += edgeToString(this.getEdges().at(i) ?? failEdge);
      }
    }
    return str;
  }

  /**
   * @returns a array of nodes present in the graph
   */
  public getNodes(): Array<Node> {
    return this.nodes;
  }

  /**
   * @returns a array of edges present in the graph
   */
  public getEdges(): Array<Edge> {
    return this.edges;
  }

  /**
   * @returns a map which maps a node (obj) to an array of its adjacent nodes
   */
  public getAdjList(): Map<Node, Array<Node>> {
    return this.adjacent;
  }

  /**
   *
   * @param nodeID - node id as a string
   * @returns returns a node with the corresponding ID or null if node not found
   *
   */
  public idToNode(nodeID: string): Node | null {
    return this.idLookup.get(nodeID) ?? null;
  }

  /**
   *
   * @param someNode - a node obj
   * @returns an array of nodes that are adjacent to the passed node or null if node not found
   *
   */
  public adjacentTo(someNode: Node): Array<Node> | null {
    return this.adjacent.get(someNode) ?? null;
  }
}
