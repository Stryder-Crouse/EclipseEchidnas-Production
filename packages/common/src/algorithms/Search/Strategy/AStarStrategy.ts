import {ISearchStrategy} from "./ISearchStrategy.ts";
import {Graph} from "../../Graph/Graph.ts";
import {Node} from "../../Graph/Node.ts";
import {BestFirstStrategyTemplate} from "../Template/BestFirstStrategyTemplate.ts";

/**
 * Actually cool use of OOP 2.
 */
export class AStarStrategy extends BestFirstStrategyTemplate implements ISearchStrategy {
    /**
     * Override the heuristic hook to turn BestFirstSearch into A* search.
     * @param graph the graph to initialise the heuristic on
     * @param target the heuristic target
     */
    override heuristicHook(graph: Graph, target: Node): void {
        console.log("AStarStrategy: hook called with graph: " + graph);
        console.log("AStarStrategy: hook called with target: " + target);
        console.log("AStarStrategy: generating node heuristic");
        graph.generateNodeHeuristic(target);
    }
}
