import {Node} from "../Graph/Node.ts";
import {Graph} from "../Graph/Graph.ts";
import {IQueue} from "../Queue/IQueue.ts";

/**
 *
 * Simple search algorithm to find a path from source to target on the passed
 * unweighted graph.
 *
 * @param source the staring node obj for the search
 * @param target the target node obj for the search
 * @param graph the graph which contains both nodes
 * @param frontier the stack or queue to perform either depth-first or breadth-first search
 *
 *
 * @returns  an array of node that stores the path from source to target if it exists or null
 *  if no such path exists in graph.
 *
 */
export function SimpleSearch(
    source: Node | null,
    target: Node | null,
    graph: Graph,
    frontier: IQueue<Node>
): Array<Node> | null {
    /* garbage */
    if (source == null) {
        console.error("source in SimpleSearch was null");
        return null;
    }
    if (target == null) {
        console.error("target in SimpleSearch was null");
        return null;
    }

    /* symbols */
    let path_found: boolean = false; // flag to construct a path
    const predecessor: Map<Node, Node | null> = new Map<Node, Node | null>(); // visited nodes to prevent cycles
    const path: Array<Node> = new Array<Node>();

    /* add the source to the frontier initially */
    frontier.push(source);
    predecessor.set(source, null); // mark the source as visited

    /* while the frontier is not empty */
    while (frontier.hasItems()) {
        /* pop the current node */
        const current_node: Node | undefined = frontier.pop();
        if (current_node == undefined) {
            console.error("dude how did you mess up the frontier in SimpleSearch");
            break; // idk
        }

        /* check if the current node happens to be the target */
        if (current_node.id == target.id) {
            /* bottle of Kool-Aid; LFG we're done */
            path_found = true;
            break;
        }

        /* find the adjacent nodes to currentNode */
        const adjacent_nodes: Array<Node> | null = graph.adjacentTo(current_node);
        if (adjacent_nodes != null) {
            /* for each node adjacent to current_node */
            for (let i: number = 0; i < adjacent_nodes.length ?? 0; i++) {
                /* if the neighbor has not yet been encountered */
                if (!predecessor.has(adjacent_nodes[i])) {
                    /* add it to the frontier */
                    frontier.push(adjacent_nodes[i]);
                    /* put it in the predecessors */
                    predecessor.set(adjacent_nodes[i], current_node);
                }
            }
        }
    }

    /* if we found the way to the end */
    if (path_found) {
        /* construct the path from the predecessor map from the target-back */
        let current_predecessor: Node | null | undefined = target;

        /* the predecessor to the source node is null */
        while (current_predecessor != null) {
            /* push the current predecessor to the found path */
            path.push(current_predecessor);

            /* update the predecessor */
            current_predecessor = predecessor.get(current_predecessor);
        }

        /* whoops */
        return path.reverse();
    }

    /* no path was found */
    return null;
}
