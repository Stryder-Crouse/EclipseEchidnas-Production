import {Node, NodeType} from "../Graph/Node.ts";
import {Edge} from "../Graph/Edge.ts";
import {Graph} from "../Graph/Graph.ts";
import {IPriorityQueue} from "../Queue/IPriorityQueue.ts";
import {MapMinPriorityQueue} from "../Queue/MapMinPriorityQueue.ts";


export function dijkstraFindClosestType(source: Node | null, targetType: NodeType, graph: Graph): Node |null{

    if (source == null) {
        console.error("source in dijkstraFindClosestType was null");
        return null;
    }


    let path_found: boolean = false;
    let cloestNodeOfType:Node |null =null;
    const open_set: IPriorityQueue<Node> = new MapMinPriorityQueue<Node>(); // nodes that still need to be expanded
    const predecessor: Map<Node, Node | null> = new Map<Node, Node | null>(); // cameFrom on wikipedia
    const shortestPathWeight: Map<Node, number> = new Map<Node, number>(); // cameFrom on wikipedia




    /* add the starting node to the open list */
    open_set.push(source, 0);
    shortestPathWeight.set(source,0);
    predecessor.set(source, null); // mark the source as visited



    /* while the destination node has not been reached */
    while (!open_set.isEmpty()) {
        /* find the current node */
        const current_node: Node | null = open_set.pop();
        if (current_node == null) {
            console.error("dijkstraFindClosestType: queue broke");
            return null;
        }

        /* good ending 😌 */
        if (current_node.nodeType == targetType) {
            path_found = true;
            cloestNodeOfType = current_node;
            break;
        }

        /* find the neighbors of current */
        const neighbors: Array<Node> | null = graph.adjacentTo(current_node);
        if (neighbors == null) {
            console.error("dijkstraFindClosestType: " + current_node.id + " has no neighbors");
            return null;
        }

        /* for each neighbor */
        for (let i: number = 0; i < neighbors.length; i++) {
            /* symbol */
            const neighbor: Node = neighbors[i];

            /* find the weight of the edge from current_node to this neighbor */
            const edge_name: string = current_node.id + "_" + neighbor.id;
            const edge_between: Edge | null = graph.idToEdge(edge_name);
            if (edge_between == null) {
                console.error("dijkstraFindClosestType: " + edge_name + " not found");
                return null;
            }
            const edge_cost: number = edge_between.weight;

            const shorestPathAtCurrentWeight: number | undefined = shortestPathWeight.get(current_node);
            if (shorestPathAtCurrentWeight == undefined) {
                console.error("dijkstraFindClosestType: undefined in shortestPathWeight map for neighbor node " + neighbor.id);
                return null;
            }

            /* find the cost from source to neighbor[i] THROUGH current_node */
            const dijkstraScore: number = shorestPathAtCurrentWeight + edge_cost;

            //first time visiting this neighbor or if the dikstraScore is lower then the current shorest path to neigbor
            if(shortestPathWeight.get(neighbor)==undefined || dijkstraScore < shortestPathWeight.get(neighbor)!){
                //then the current score must be the shortest
                shortestPathWeight.set(neighbor,dijkstraScore);
                predecessor.set(neighbor, current_node);
                if (!open_set.contains(neighbor)) {
                    open_set.push(neighbor, dijkstraScore);
                }
            }


        }
    }

    /* if we found the cloest node of target type */
    if (path_found && cloestNodeOfType!=null) {
        //console.log(predecessor);
        return cloestNodeOfType;
    }

    /* no path found */
    return null;
}
