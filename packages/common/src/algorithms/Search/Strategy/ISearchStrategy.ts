import {Graph} from "../../Graph/Graph.ts";
import {NodeForGraph} from "../../Graph/NodeForGraph.ts";

/** This is a complete waste of time */
export interface ISearchStrategy {
    /**
     * Search the inputted graph from source to target.
     * @param source the node to begin at
     * @param target the node to end at
     * @param graph the graph in which to search
     * @return a path from source to target if it exists; null otherwise
     */
    search(source: NodeForGraph, target: NodeForGraph, graph: Graph): Array<NodeForGraph> | null;
}
