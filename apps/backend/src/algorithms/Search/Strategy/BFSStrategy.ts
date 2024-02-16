import {ISearchStrategy} from "./ISearchStrategy.ts";
import {Graph} from "../../Graph/Graph.ts";
import {Node} from "../../Graph/Node.ts";
import {BFS} from "../BFS.ts";

/**
 * Utter waste of time 2.
 */
export class BFSStrategy implements ISearchStrategy {
    search(source: Node, target: Node, graph: Graph): Array<Node> | null {
        return BFS(source, target, graph);
    }
}
