import {ISearchStrategy} from "./ISearchStrategy.ts";
import {Graph} from "../../Graph/Graph.ts";
import {NodeForGraph} from "../../Graph/NodeForGraph.ts";
import {BFS} from "../BFS.ts";

/**
 * Utter waste of time 2.
 */
export class BFSStrategy implements ISearchStrategy {
    search(source: NodeForGraph, target: NodeForGraph, graph: Graph): Array<NodeForGraph> | null {
        return BFS(source, target, graph);
    }
}
