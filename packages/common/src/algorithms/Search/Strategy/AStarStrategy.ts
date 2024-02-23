import {ISearchStrategy} from "./ISearchStrategy.ts";
import {Graph} from "../../Graph/Graph.ts";
import {Node} from "../../Graph/Node.ts";
import {AStar} from "../AStar.ts";

/**
 * Utter waste of time 1.
 */
export class AStarStrategy implements ISearchStrategy {
    search(source: Node, target: Node, graph: Graph): Array<Node> | null {
        return AStar(source, target, graph);
    }
}
