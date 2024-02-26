import {ISearchStrategy} from "./ISearchStrategy.ts";
import {NodeForGraph} from "../../Graph/NodeForGraph.ts";
import {Graph} from "../../Graph/Graph.ts";

/**
 * Waste of time 4.
 */
export class SearchContext {
    /* fields */
    private strategy: ISearchStrategy;

    /* constructors */
    constructor(strategy: ISearchStrategy) {
        this.strategy = strategy;
    }

    /* methods */
    /**
     * Search the inputted graph from source to target.
     * @param source the node to begin at
     * @param target the node to end at
     * @param graph the graph in which to search
     * @return a path from source to target if it exists; null otherwise
     */
    public search(source: NodeForGraph, target: NodeForGraph, graph: Graph): Array<NodeForGraph> | null {
        return this.strategy.search(source, target, graph);
    }
}
