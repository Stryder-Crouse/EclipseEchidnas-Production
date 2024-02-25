import {expect, test} from "vitest";

import {Node, NodeType} from "../../../packages/common/src/algorithms/Graph/Node.ts";
import {readEdgeCSV, readNodeCSV} from "../src/algorithms/readCSV.ts";
import {Edge} from "../../../packages/common/src/algorithms/Graph/Edge.ts";
import {Graph} from "../../../packages/common/src/algorithms/Graph/Graph.ts";
import {edgesString, nodesString} from "./GraphWeightAndHeuristicCreation.test.ts";
import {dijkstraFindClosestType} from "common/src/algorithms/Search/DijkstraFindClosestType.ts";

/* - - - resources - - - */
const nodes: Array<Node> = readNodeCSV(nodesString);
const edges: Array<Edge> = readEdgeCSV(edgesString);
const graph: Graph = new Graph(nodes, edges);

/* - - - test definitions - - - */
function findClosestElevator(): void {
    const result: Node | null = dijkstraFindClosestType(graph.idToNode("10"), NodeType.ELEV, graph);
    expect(result?.nodeType).toStrictEqual(NodeType.ELEV);
    expect(result?.id).toStrictEqual("10");
}

function findClosestCONF(): void {
    const result: Node | null = dijkstraFindClosestType(graph.idToNode("10"), NodeType.CONF, graph);
    expect(result?.nodeType).toStrictEqual(NodeType.CONF);
    expect(result?.id).toStrictEqual("2");

    const result2: Node | null = dijkstraFindClosestType(graph.idToNode("9"), NodeType.CONF, graph);
    expect(result2?.nodeType).toStrictEqual(NodeType.CONF);
    expect(result2?.id).toStrictEqual("3");
}

function findClosestStairs(): void {
    const result: Node | null = dijkstraFindClosestType(graph.idToNode("10"), NodeType.STAI, graph);
    expect(result?.nodeType).toStrictEqual(NodeType.STAI);
    expect(result?.id).toStrictEqual("4");
}

/* - - - test execution - - - */
test("Find closest stairs (simple test only one stair node)", findClosestStairs);
test("Find closest Conf (harder test multiple)", findClosestCONF);
test("Find closest elevator (test that if start is node type it returns start", findClosestElevator);
