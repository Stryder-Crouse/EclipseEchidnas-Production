import {ISearchStrategy} from "./ISearchStrategy.ts";
import {Graph} from "../../Graph/Graph.ts";
import {NodeForGraph} from "../../Graph/NodeForGraph.ts";
import {DFS} from "../DFS.ts";

/**
 * Utter waste of time 3.
 */
export class DFSStrategy implements ISearchStrategy {
    search(source: NodeForGraph, target: NodeForGraph, graph: Graph): Array<NodeForGraph> | null {
        return DFS(source, target, graph);
    }
}
