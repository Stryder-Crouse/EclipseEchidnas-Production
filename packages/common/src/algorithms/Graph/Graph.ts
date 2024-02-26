import {Buildings, floorToNumber, NodeForGraph, nodeToString, NodeType, NULLNODE} from "./NodeForGraph.ts";
import {Edge, edgeToString} from "./Edge.ts";
import {euclideanDistance} from "./Coordinate.ts";

/**
 * Class that represents an undirected graph
 */
export class Graph {
    /* Stores all nodes in the graph */
    private readonly nodes: Array<NodeForGraph>;
    /* Stores all edges in the graph */
    private readonly edges: Array<Edge>;
    /* Stores a map that maps a node obj to at list of node obj adjacent to it in the graph */
    private readonly adjacent: Map<NodeForGraph, Array<NodeForGraph>>;
    /* Stores a map that maps a node id (string) to its corresponding node */
    private readonly nodeIdLookup: Map<string, NodeForGraph>;
    /* Stores a map that maps an edge id (string) to its corresponding edge */
    private readonly edgeIdLookup: Map<string, Edge>;

    //these should probe be the same to avoid over estimation by a*
    private readonly floorPenalty: number = 5000;
    private static readonly elevatorAndStairsEdgeWeight: number = 5000;

    /**
     * Stores, by every floor, what nodes are stairs and elevators
     * this will be used in computation of the heuristic so by storing it we memoize.
     * index will be as follows
     * 0 = Lower level 2
     * 1 = Lower level 1
     * 2 = G floor
     * 3 = level 1
     * 4 = level 2
     * 5 = level 3
     * */
    private readonly transitionNodesByFloor: Array<Array<NodeForGraph>>;

    /**
     * Constructs a graph based on the pass nodes and edges
     *
     * @param unLinkedNodes - a list of nodes to add edges to
     * @param edges - edges to be added to the list of nodes to create the graph
     *
     */
    constructor(unLinkedNodes: Array<NodeForGraph>, edges: Array<Edge>) {
        // create map to relate node id strings to their corresponding node obj
        const nodeMap = new Map<string, NodeForGraph>();
        // create map to relate edge id strings to their corresponding edge obj
        const edgeMap: Map<string, Edge> = new Map<string, Edge>();
        // create map relate a node obj to the list of nodes it is adjacent to
        const adj = new Map<NodeForGraph, Array<NodeForGraph>>();
        // set up empty arrays for to be filled to set transitionNodesByFloor
        const transitionNodesByFloor: Array<Array<NodeForGraph>> = [[], [], [], [], [], []];

        //for each inputted node
        unLinkedNodes.forEach(function (node) {
            //map node id to its node
            nodeMap.set(node.id, node);
            //map node to and empty node array to be filled later
            adj.set(node, new Array<NodeForGraph>());

            //set up transitionNodesByFloor array
            // if a node is a stair or an elevator then add it to is corresponding floor array
            if (node.nodeType == NodeType.STAI || node.nodeType == NodeType.ELEV) {
                //if floor data corrupted, don't add the node
                if (floorToNumber(node.floor) == -99) {
                    return;
                }
                //add node to correct floor array
                transitionNodesByFloor[floorToNumber(node.floor)].push(node);
            }

        });

        //set transitionNodesByFloor
        this.transitionNodesByFloor = transitionNodesByFloor;
        // console.log(this.transitionNodesByFloor);

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
                weight: -1
            };
            //add backEdge to endNode
            endNode.edges.push(backEdge);


            edges.push(backEdge); //need this for correct weight caluations


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

            /* populate edge map */
            edgeMap.set(edge.id, edge);
            edgeMap.set(backEdge.id, backEdge);
        });

        //set obj variables
        this.nodes = unLinkedNodes;
        this.edges = edges;
        this.adjacent = adj;
        this.nodeIdLookup = nodeMap;
        this.edgeIdLookup = edgeMap;

        //todo debug code

        // console.log("OKOK");
        // console.log(edges.length + " "+ edgeMap.size);
        // for(let i=0;i<edges.length; i++){
        //     const hashValue = edgeMap.get(edges[i].id);
        //     if(hashValue==undefined){
        //         console.log("not found " +edges[i].id);
        //         console.log(edges[i]);
        //
        //     }
        //
        // }
        // let dupcount =0;
        // for(let i=0;i<edges.length; i++){
        //     let dup=0;
        //     for(let k=0;k<edges.length; k++){
        //
        //         if(edges[i].id==edges[k].id){
        //             dup++;
        //             if(dup>1){
        //                 console.log("dup spoted "+ edges[i].id );
        //                 console.log(edges[i]);
        //                 console.log(edges[k]);
        //                 dupcount++;
        //
        //             }
        //         }
        //
        //     }
        // }
        // console.log("dup count " + dupcount);

        //generate weights for edges
        this.generateWeights();
    }

    /**
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
     *  the goal node for the interim floors will instead be the closest stairs or elevator that allows the path to
     *  move to a closer floor to the goal node.
     */
    //todo need tests
    public generateNodeHeuristic(goalNode: NodeForGraph) {

        const goalFloor = floorToNumber(goalNode.floor);
        // console.log(goalFloor);

        //for each node
        for (let i = 0; i < this.nodes.length; i++) {
            const node: NodeForGraph = this.nodes[i];
            const nodeFloor = floorToNumber(node.floor);

            //if the node is on the same floor as the goalNode
            if (goalFloor == floorToNumber(node.floor)) {
                node.heuristic = euclideanDistance(goalNode.coordinate, node.coordinate);
            }
            //if the node is on a different floor to the goalNode
            else {
                const floorDifference = Math.abs(goalFloor - nodeFloor);
                let closestTransitionDistance = Number.MAX_VALUE;
                let transitionDistanceNoneValid = Number.MAX_VALUE;

                //find the closest elevator or stairs that lets the path get to a closer floor to the goal
                // and consider that elevator or stairs the goal node for the current node
                for (let j = 0; j < this.transitionNodesByFloor[nodeFloor].length; j++) {
                    const transitionNode = this.transitionNodesByFloor[nodeFloor][j];
                    const transitionDistance = euclideanDistance(transitionNode.coordinate, node.coordinate);

                    //check that the translation node allows you to get closer to the goal nodes floor
                    if (this.doesTransitionGetYouCloser(goalNode, transitionNode)) {
                        //is the current transition closer than the current closest transition
                        if (closestTransitionDistance > transitionDistance) {
                            closestTransitionDistance = transitionDistance;

                        }
                    }
                    //if not store a backup distance in case all transition nodes do not get you closer
                    else {
                        if (transitionDistanceNoneValid > transitionDistance) {
                            transitionDistanceNoneValid = transitionDistance;
                        }
                    }
                }

                if (closestTransitionDistance == Number.MAX_VALUE) {
                    console.error("No valid transition nodes found for node " + node.id +
                        ", assigning the closest transition node");
                    node.heuristic = transitionDistanceNoneValid + floorDifference * this.floorPenalty;
                    continue;
                }

                // Heuristic is the penalty for being on a different floor + its distance to the closest valid elevator or stairs
                node.heuristic = closestTransitionDistance + floorDifference * this.floorPenalty;
            }
        }
        
        //for each node
        // if it is on the same floor
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
        const failNode: NodeForGraph = {
            building: Buildings.UNDEFINED,
            coordinate: {x: 1, y: 1},
            edges: [],
            floor: "",
            id: "FAIL",
            longName: "",
            nodeType: NodeType.UNDEFINED,
            shortName: "",
            heuristic: -1
        };

        //for each node convert it into a csv representation and add it to the string output
        for (let i = 0; i < this.getNodes().length; i++) {
            if (this.getNodes()[i] != null || undefined) {
                str += nodeToString(this.getNodes()[i] ?? failNode);
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
        const failNode: NodeForGraph = {
            building: Buildings.UNDEFINED,
            coordinate: {x: 1, y: 1},
            edges: [],
            floor: "",
            id: "FAIL",
            longName: "",
            nodeType: NodeType.UNDEFINED,
            shortName: "",
            heuristic: -1
        };
        //if an undefined edge  is found then uses this error edge in place
        const failEdge: Edge = {
            endNode: failNode, id: "FAIL", startNode: failNode, weight: -1
        };

        //for each edge convert it into a csv representation and add it to the string output
        for (let i = 0; i < this.getEdges().length; i++) {
            if (this.getEdges()[i] != null || undefined) {
                str += edgeToString(this.getEdges()[i] ?? failEdge);
            }
        }
        return str;
    }

    /**
     * @returns a array of nodes present in the graph
     */
    public getNodes(): Array<NodeForGraph> {
        return this.nodes;
    }

    /**
     * @returns a array of edges present in the graph
     */
    public getEdges(): Array<Edge> {
        return this.edges;
    }

    /**
     * @returns the weight assigned to a tranistion edge
     */
    public static getElevatorAndStairsEdgeWeight(): number {
        return Graph.elevatorAndStairsEdgeWeight;
    }

    /**
     * Retrieve the corresponding Node from its ID.
     * @param nodeID - node id as a string
     * @returns returns a node with the corresponding ID or null if node not found
     */
    public idToNode(nodeID: string): NodeForGraph | null {
        return this.nodeIdLookup.get(nodeID) ?? null;
    }

    /**
     * Retrieve the corresponding Edge from its ID.
     * @param edgeID - edge id as a string
     * @returns returns an edge with the corresponding ID or null if edge not found
     */
    public idToEdge(edgeID: string): Edge | null {
        return this.edgeIdLookup.get(edgeID) ?? null;
    }

    /**
     *
     * @param someNode - a node obj
     * @returns an array of nodes that are adjacent to the passed node or null if node not found
     *
     */
    public adjacentTo(someNode: NodeForGraph): Array<NodeForGraph> | null {
        return this.adjacent.get(someNode) ?? null;
    }

    /**
     * Generates the weights (Euclidean distance in pixels)  for the edges in the graph
     *
     * note that if an edge in the graph start and ends with elevator nodes the edge's weight is set to 1
     */
    private generateWeights() {

        //for each edge

        for (let i = 0; i < this.edges.length; i++) {
            if ((this.edges[i].startNode.nodeType == NodeType.ELEV && this.edges[i].endNode.nodeType == NodeType.ELEV) || (this.edges[i].startNode.nodeType == NodeType.STAI && this.edges[i].endNode.nodeType == NodeType.STAI)) {
                this.edges[i].weight = Graph.elevatorAndStairsEdgeWeight;
            }
            // else find Euclidean distance of the edge and set it as the weight
            else {
                this.edges[i].weight = euclideanDistance(this.edges[i].endNode.coordinate, this.edges[i].startNode.coordinate);
            }

        }

    }

    /**
     *
     * @param goalNode - goal node
     * @param transitionNode - node that transitions between floors
     * @private
     *
     * @returns true if transitionNode has an edge that get you to a floor that is closer to goalNode, false if not
     */
    private doesTransitionGetYouCloser(goalNode: NodeForGraph, transitionNode: NodeForGraph) {

        //set abs floor distance between trans node and goal node
        const floorDifference = Math.abs(floorToNumber(goalNode.floor) - floorToNumber(transitionNode.floor));

        //for each edge from tran node check the ending node
        //if the ending node is on a closer floor to the goal node return true
        //if all edges do not allow the goal to get closer return false
        for (let i = 0; i < transitionNode.edges.length; i++) {
            const edge = transitionNode.edges[i];
            const floorDifferenceEndNode = Math.abs(floorToNumber(goalNode.floor) - floorToNumber(edge.endNode.floor));

            if (floorDifferenceEndNode < floorDifference) {
                return true;
            }
        }
        return false;
    }


    public closestNonHallToNode(goalNode:NodeForGraph, maxDistance:number){

        let closest = goalNode;
        let shortestDistnace = Number.MAX_VALUE;

        if(closest.nodeType!=NodeType.HALL){
            return goalNode;
        }

        this.nodes.forEach((node)=>{

            if(node.floor==goalNode.floor && node.nodeType!=NodeType.HALL){

                const distance = euclideanDistance(node.coordinate,goalNode.coordinate);

                if(distance < shortestDistnace){
                    closest=node;
                    shortestDistnace=distance;
                }
            }

        });

        //return NULLNODE if shorest node distance is greator than maxDistance
        if(shortestDistnace>maxDistance){
            return NULLNODE;
        }

        return closest;


    }

}
