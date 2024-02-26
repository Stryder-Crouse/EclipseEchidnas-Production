import {NodeForGraph} from "../Graph/NodeForGraph.ts";
import {Graph} from "../Graph/Graph.ts";
import {SimpleStack} from "../Queue/SimpleStack.ts";
import {IQueue} from "../Queue/IQueue.ts";
import {SimpleSearch} from "./SimpleSearch.ts";

/**
 * Depth-first search algorithm to find a path from source to target on the passed
 * unweighted graph.
 *
 * @param source - staring node obj for the search
 * @param target - target node obj for the search
 * @param graph - graph which contains both nodes
 *
 * @returns  an array of node that stores the path from source to target if it exists or null
 *  if no such path exists in graph.
 *
 */
export function DFS(
    source: NodeForGraph | null,
    target: NodeForGraph | null,
    graph: Graph,
): Array<NodeForGraph> | null {
    /* garbage */
    const stack: IQueue<NodeForGraph> = new SimpleStack<NodeForGraph>();
    return SimpleSearch(source, target, graph, stack);
}
