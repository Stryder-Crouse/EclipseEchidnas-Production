import {ISearchStrategy} from "./ISearchStrategy.ts";
import {Graph} from "../../Graph/Graph.ts";
import {Node} from "../../Graph/Node.ts";
import {BestFirstStrategyTemplate} from "../Template/BestFirstStrategyTemplate.ts";

/**
 * Actually cool use of OOP 1.
 */
export class DijkstraSearchStrategy extends BestFirstStrategyTemplate implements ISearchStrategy {
    /**
     * Override the heuristic hook to turn BestFirstSearch into Dijkstra search.
     * @param graph the graph to initialise the heuristic on
     * @param target the heuristic target
     */
    override heuristicHook(graph: Graph, target: Node): void {
        console.log("DijkstraSearchStrategy: hook called with graph: " + graph);
        console.log("DijkstraSearchStrategy: hook called with target: " + target);
        console.log("DijkstraSearchStrategy: zeroing node heuristic");
        graph.zeroNodeHeuristic();
    }
}
