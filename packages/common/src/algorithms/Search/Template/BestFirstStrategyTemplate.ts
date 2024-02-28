import {ISearchStrategy} from "../Strategy/ISearchStrategy.ts";
import {Graph} from "../../Graph/Graph.ts";
import {Node} from "../../Graph/Node.ts";
import {BestFirstSearch} from "../BestFirstSearch.ts";

export abstract class BestFirstStrategyTemplate implements ISearchStrategy {
    public search(source: Node, target: Node, graph: Graph): Array<Node> | null {
        this.heuristicHook(graph, target);
        return BestFirstSearch(source, target, graph);
    }

    heuristicHook(graph: Graph, target: Node): void {
        console.log("BestFirstStrategyTemplate: hook called with graph: " + graph);
        console.log("BestFirstStrategyTemplate: hook called with target: " + target);
        return;
    }
}
