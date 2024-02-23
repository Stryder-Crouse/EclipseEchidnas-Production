import {ISearchStrategy} from "./ISearchStrategy.ts";
import {Graph} from "../../Graph/Graph.ts";
import {Node} from "../../Graph/Node.ts";
import {DFS} from "../DFS.ts";

/**
 * Utter waste of time 3.
 */
export class DFSStrategy implements ISearchStrategy {
    search(source: Node, target: Node, graph: Graph): Array<Node> | null {
        return DFS(source, target, graph);
    }
}
