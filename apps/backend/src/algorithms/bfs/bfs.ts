/* Shitty BFS by Alex */
import { node } from "../node.ts";
import { CrapQueue } from "../queue/CrapQueue.ts";
import { IQueue } from "../queue/IQueue.ts";

/*
 * bfs()
 *
 * Breadth-first search algorithm to find a path from source to target.
 *
 * Returns a list of the path from source to target if it exists or null
 * if no such path exists.
 */
export function bfs(source: node, target: node): Array<node> | null {
  /* symbols */
  const frontier: IQueue<node> = new CrapQueue<node>(); // frontier for next nodes to visit
  const visited: Map<node, boolean> = new Map<node, boolean>(); // visited nodes to prevent cycles
  const adjacent: Map<node, Array<node>> = new Map<node, Array<node>>(); // needed?
  const path: Array<node> = new Array<node>();

  /* initially populate the frontier with source's neighbors */
  path.push(source);
  visited.set(source, true);
  for (let i: number = 0; i < source.edges.length; i++) {
    frontier.push(source.edges[i].endNode);
  }

  /* while the frontier is not empty */
  while (frontier.hasItems()) {
    /* pop the current node */
    const currentNode: node | undefined = frontier.pop();
    if (currentNode == undefined) {
      break; // idk
    }

    /* if we've already seen this node */
    if (visited.get(currentNode)) {
      continue;
    }
    visited.set(currentNode, true);
  }

  return null;
}
