import {Node} from "../Graph/Node.ts";
import {Graph} from "../Graph/Graph.ts";

/**
 * A* search algorithm to find a path from source to target on the passed
 * weighted graph.
 *
 * @param source - staring node obj for the search
 * @param target - target node obj for the search
 * @param graph - graph which contains both nodes
 *
 * @returns  an array of node that stores the path from source to target if it exists or null
 *  if no such path exists in graph.
 *
 *  @see {source here}
 *
 */
export function AStar(source: Node | null, target: Node | null, graph: Graph): Array<Node> | null {
    /* garbage */
    if (source == null) {
        console.error("source in A* was null");
        return null;
    }
    if (target == null) {
        console.error("target in A* was null");
        return null;
    }

    /* YEET 😍 */


    console.log(graph);
    return null;
}
