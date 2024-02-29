import {Node} from "../Graph/Node.ts";
import {Graph} from "../Graph/Graph.ts";
import {BestFirstSearch} from "./BestFirstSearch.ts";

/**
 * Dijkstra search algorithm to find a path from source to target on the passed
 * weighted graph.
 *
 * @param source - staring node obj for the search
 * @param target - target node obj for the search
 * @param graph - graph which contains both nodes
 *
 * @returns  an array of node that stores the path from source to target if it exists or null
 *  if no such path exists in graph.
 */
export function DijkstraSearch(source: Node | null, target: Node | null, graph: Graph): Array<Node> | null {
    /* Simple wrapper; heuristic is zeroed so this call is equivalent to Dijkstra */
    graph.zeroNodeHeuristic();
    return BestFirstSearch(source, target, graph);
}
