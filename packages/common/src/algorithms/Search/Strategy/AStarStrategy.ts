import {ISearchStrategy} from "./ISearchStrategy.ts";
import {Graph} from "../../Graph/Graph.ts";
import {NodeForGraph} from "../../Graph/NodeForGraph.ts";
import {AStar} from "../AStar.ts";

/**
 * Utter waste of time 1.
 */
export class AStarStrategy implements ISearchStrategy {
    search(source: NodeForGraph, target: NodeForGraph, graph: Graph): Array<NodeForGraph> | null {
        return AStar(source, target, graph);
    }
}
