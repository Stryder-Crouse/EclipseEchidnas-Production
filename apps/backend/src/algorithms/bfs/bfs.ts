/* BASED BFS by Alex and Stryder */
import { node } from "../node.ts";
import { Graph } from "../Graph.ts";
import { CrapQueue } from "../queue/CrapQueue.ts";
import { IQueue } from "../queue/IQueue.ts";

/*
 * bfs()
 *
 * Breadth-first search algorithm to find a path from source to target.
 *
 * Returns a list of the path from source to target if it exists or null
 * if no such path exists in graph.
 */
export function bfs(
  source: node | null,
  target: node | null,
  graph: Graph,
): Array<node> | null {
  /* garbage */
  if (source == null) {
    console.error("source in bfs was null");
    return null;
  }
  if (target == null) {
    console.error("target in bfs was null");
    return null;
  }

  /* symbols */
  let path_found: boolean = false; // flag to construct a path
  const frontier: IQueue<node> = new CrapQueue<node>(); // frontier for next nodes to visit
  const predecessor: Map<node, node | null> = new Map<node, node | null>(); // visited nodes to prevent cycles
  const path: Array<node> = new Array<node>();

  /* add the source to the frontier initially */
  frontier.push(source);
  predecessor.set(source, null); // mark the source as visited

  /* while the frontier is not empty */
  while (frontier.hasItems()) {
    /* pop the current node */
    const current_node: node | undefined = frontier.pop();
    if (current_node == undefined) {
      console.error("dude how did you mess up the queue in BFS in IQueue");
      break; // idk
    }

    /* check if the current node happens to be the target */
    if (current_node.iD == target.iD) {
      /* bottle of Kool-Aid; LFG we're done */
      path_found = true;
      break;
    }

    /* find the adjacent nodes to currentNode */
    const adjacent_nodes: Array<node> | null = graph.adjacentTo(current_node);
    if (adjacent_nodes != null) {
      /* for each node adjacent to current_node */
      for (let i: number = 0; i < adjacent_nodes.length ?? 0; i++) {
        /* if the neighbor has not yet been encountered */
        if (!predecessor.has(adjacent_nodes[i])) {
          /* add it to the frontier */
          frontier.push(adjacent_nodes[i]);
          /* put it in the predecessors */
          predecessor.set(adjacent_nodes[i], current_node);
        }
      }
    }
  }

  /* if we found the way to the end */
  if (path_found) {
    /* construct the path from the predecessor map from the target-back */
    let current_predecessor: node | null | undefined = target;

    /* the predecessor to the source node is null */
    while (current_predecessor != null) {
      /* push the current predecessor to the found path */
      path.push(current_predecessor);

      /* update the predecessor */
      current_predecessor = predecessor.get(current_predecessor);
    }

    /* whoops */
    return path.reverse();
  }

  /* no path was found */
  return null;
}
