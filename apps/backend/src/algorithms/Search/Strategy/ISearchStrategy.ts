import {Graph} from "../../Graph/Graph.ts";
import {Node} from "../../Graph/Node.ts";

/** This is a complete waste of time */
export interface ISearchStrategy {
    /**
     * Search the inputted graph from source to target.
     * @param source the node to begin at
     * @param target the node to end at
     * @param graph the graph in which to search
     * @return a path from source to target if it exists; null otherwise
     */
    search(source: Node, target: Node, graph: Graph): Array<Node> | null;
}
