// import {Node, NodeType} from "../Graph/Node.ts";
// import {Edge} from "../Graph/Edge.ts";
// import {Graph} from "../Graph/Graph.ts";
// import {IPriorityQueue} from "../Queue/IPriorityQueue.ts";
// import {MapMinPriorityQueue} from "../Queue/MapMinPriorityQueue.ts";
//
// /**
//  * dijkstra search algorithm to find a path from source to the closest node of a type on the passed
//  * weighted graph.
//  *
//  * @param source - staring node obj for the search
//  * @param targetType - type of node being searched for
//  * @param graph - graph which contains both nodes
//  *
//  * @returns  an array of node that stores the path from source to target if it exists or null
//  *  if no such path exists in graph.
//  *
//  *
//  *
//  */
// export function dijkstraAnyNodeType(source: Node | null, targetType: NodeType, graph: Graph): Array<Node> | null {
//     /* garbage */
//     if (source == null) {
//         console.error("source in dijkstraAnyNodeType was null");
//         return null;
//     }
//
//
//     /* symBOls 😍 */
//     let path_found: boolean = false;
//
//     let foundNode:Node;
//
//     const open_set: IPriorityQueue<Node> = new MapMinPriorityQueue<Node>(); // nodes that still need to be expanded
//     const predecessor: Map<Node, Node | null> = new Map<Node, Node | null>(); // cameFrom on wikipedia
//     const g_score: Map<Node, number> = new Map<Node, number>(); // cost of cheapest from source to node
//
//     const path: Array<Node> = new Array<Node>();
//
//     /* add the starting node to the open list */
//     open_set.push(source, 0);
//     predecessor.set(source, null); // mark the source as visited
//
//     /* initialize the maps for the starting node */
//     g_score.set(source, 0);
//
//     /* while the destination node has not been reached */
//     while (!open_set.isEmpty()) {
//         /* find the current node */
//         const current_node: Node | null = open_set.pop();
//         if (current_node == null) {
//             console.error("Dijkstra: queue broke");
//             return null;
//         }
//
//         /* good ending 😌 */
//         if (current_node.nodeType == targetType) {
//             path_found = true;
//             foundNode=current_node;
//             break;
//         }
//
//         /* find the neighbors of current */
//         const neighbors: Array<Node> | null = graph.adjacentTo(current_node);
//         if (neighbors == null) {
//             console.error("dijkstra: " + current_node.id + " has no neighbors");
//             return null;
//         }
//
//         /* for each neighbor */
//         for (let i: number = 0; i < neighbors.length; i++) {
//             /* symbol */
//             const neighbor: Node = neighbors[i];
//
//             /* cool init */
//             if (g_score.get(neighbor) == undefined) {
//                 g_score.set(neighbor, Number.MAX_VALUE);
//             }
//
//
//             /* find the weight of the edge from current_node to this neighbor */
//             const edge_name: string = current_node.id + "_" + neighbor.id;
//             const edge_between: Edge | null = graph.idToEdge(edge_name);
//             if (edge_between == null) {
//                 console.error("dijkstra: " + edge_name + " not found");
//                 return null;
//             }
//             const edge_cost: number = edge_between.weight;
//
//             /* find the current_node g score */
//             const current_g_score: number | undefined = g_score.get(current_node);
//             if (current_g_score == undefined) {
//                 console.error("A*: undefined in g_score map for current node " + current_node.id);
//                 return null;
//             }
//
//             /* find neighbor's g score */
//             const neighbor_g_score: number | undefined = g_score.get(neighbor);
//             if (neighbor_g_score == undefined) {
//                 console.error("A*: undefined in g_score map for neighbor node " + neighbor.id);
//                 return null;
//             }
//
//             /* find the cost from source to neighbor[i] THROUGH current_node */
//             const tentative_g_score: number = current_g_score + edge_cost;
//
//             /* if the cost is the BEST EVER SEEN BEFORE */
//             if (tentative_g_score < neighbor_g_score) {
//                 /* record it !!! */
//                 const new_f_score: number = tentative_g_score + neighbor.heuristic;
//                 predecessor.set(neighbor, current_node);
//                 g_score.set(neighbor, tentative_g_score);
//
//                 if (!open_set.contains(neighbor)) {
//                     open_set.push(neighbor, new_f_score);
//                 }
//             }
//         }
//     }
//
//     /* if we found the way to the end */
//     if (path_found) {
//         /* construct the path from the predecessor map from the target-back */
//         let current_predecessor: Node | null | undefined = foundNode!;
//
//         /* the predecessor to the source node is null */
//         while (current_predecessor != null) {
//             /* push the current predecessor to the found path */
//             path.push(current_predecessor);
//
//             /* update the predecessor */
//             current_predecessor = predecessor.get(current_predecessor);
//         }
//
//         /* whoops */
//         return path.reverse();
//     }
//
//     /* no path found */
//     return null;
// }
