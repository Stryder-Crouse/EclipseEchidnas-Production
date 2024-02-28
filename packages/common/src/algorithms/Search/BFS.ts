import {Node} from "../Graph/Node.ts";
import {Graph} from "../Graph/Graph.ts";
import {SimpleQueue} from "../Queue/SimpleQueue.ts";
import {IQueue} from "../Queue/IQueue.ts";
import {SimpleSearch} from "./SimpleSearch.ts";

/**
 * Breadth-first search algorithm to find a path from source to target on the passed
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
export function BFS(
    source: Node | null,
    target: Node | null,
    graph: Graph,
): Array<Node> | null {
    /* garbage */
    const queue: IQueue<Node> = new SimpleQueue<Node>();
    return SimpleSearch(source, target, graph, queue);
}
