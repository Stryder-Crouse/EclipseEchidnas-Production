import {Node} from "../Graph/Node.ts";
import {Edge} from "../Graph/Edge.ts";
import {Graph} from "../Graph/Graph.ts";
import {IPriorityQueue} from "../Queue/IPriorityQueue.ts";
import {MapMinPriorityQueue} from "../Queue/MapMinPriorityQueue.ts";

/**
 * Best-first search algorithm to find a path from source to target on the passed
 * weighted graph. THE GRAPH MUST HAVE HAD A HEURISTIC GENERATED PRIOR TO CALLING.
 *
 * @param source - staring node obj for the search
 * @param target - target node obj for the search
 * @param graph - graph which contains both nodes
 *
 * @returns  an array of node that stores the path from source to target if it exists or null
 *  if no such path exists in graph.
 *
 *  @see {https://en.wikipedia.org/wiki/A*_search_algorithm}
 */
export function BestFirstSearch(source: Node | null, target: Node | null, graph: Graph): Array<Node> | null {
    /* garbage */
    if (source == null) {
        console.error("BestFirstSearch: source was null");
        return null;
    }
    if (target == null) {
        console.error("BestFirstSearch: target was null");
        return null;
    }

    /* symBOls 😍 */
    let path_found: boolean = false;
    const open_set: IPriorityQueue<Node> = new MapMinPriorityQueue<Node>(); // nodes that still need to be expanded
    const predecessor: Map<Node, Node | null> = new Map<Node, Node | null>(); // cameFrom on wikipedia
    const g_score: Map<Node, number> = new Map<Node, number>(); // cost of cheapest from source to node
    const f_score: Map<Node, number> = new Map<Node, number>(); // best guess of cost from source to target through node
    const path: Array<Node> = new Array<Node>();

    /* generate the heuristic */
    graph.generateNodeHeuristic(target);

    /* add the starting node to the open list */
    open_set.push(source, 0);
    predecessor.set(source, null); // mark the source as visited

    /* initialize the maps for the starting node */
    g_score.set(source, 0);
    f_score.set(source, source.heuristic);

    /* while the destination node has not been reached */
    while (!open_set.isEmpty()) {
        /* find the current node */
        const current_node: Node | null = open_set.pop();
        if (current_node == null) {
            console.error("BestFirstSearch: queue broke");
            return null;
        }

        /* good ending 😌 */
        if (current_node == target) {
            path_found = true;
            break;
        }

        /* find the neighbors of current */
        const neighbors: Array<Node> | null = graph.adjacentTo(current_node);
        if (neighbors == null) {
            console.error("BestFirstSearch: " + current_node.id + " has no neighbors");
            return null;
        }

        /* for each neighbor */
        for (let i: number = 0; i < neighbors.length; i++) {
            /* symbol */
            const neighbor: Node = neighbors[i];

            /* cool init */
            if (g_score.get(neighbor) == undefined) {
                g_score.set(neighbor, Number.MAX_VALUE);
            }
            if (f_score.get(neighbor) == undefined) {
                f_score.set(neighbor, Number.MAX_VALUE);
            }

            /* find the weight of the edge from current_node to this neighbor */
            const edge_name: string = current_node.id + "_" + neighbor.id;
            const edge_between: Edge | null = graph.idToEdge(edge_name);
            if (edge_between == null) {
                console.error("BestFirstSearch: " + edge_name + " not found");
                return null;
            }
            const edge_cost: number = edge_between.weight;

            /* find the current_node g score */
            const current_g_score: number | undefined = g_score.get(current_node);
            if (current_g_score == undefined) {
                console.error("BestFirstSearch: undefined in g_score map for current node " + current_node.id);
                return null;
            }

            /* find neighbor's g score */
            const neighbor_g_score: number | undefined = g_score.get(neighbor);
            if (neighbor_g_score == undefined) {
                console.error("BestFirstSearch: undefined in g_score map for neighbor node " + neighbor.id);
                return null;
            }

            /* find the cost from source to neighbor[i] THROUGH current_node */
            const tentative_g_score: number = current_g_score + edge_cost;

            /* if the cost is the BEST EVER SEEN BEFORE */
            if (tentative_g_score < neighbor_g_score) {
                /* record it !!! */
                const new_f_score: number = tentative_g_score + neighbor.heuristic;
                predecessor.set(neighbor, current_node);
                g_score.set(neighbor, tentative_g_score);
                f_score.set(neighbor, new_f_score);
                if (!open_set.contains(neighbor)) {
                    open_set.push(neighbor, new_f_score);
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

    /* no path found */
    return null;
}
