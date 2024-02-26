import {expect, test} from "vitest";
import {AStar} from "../../../packages/common/src/algorithms/Search/AStar.ts";
import {NodeForGraph} from "common/src/algorithms/Graph/NodeForGraph.ts";
import {readEdgeCSV, readNodeCSV} from "../src/algorithms/readCSV.ts";
import {Edge} from "../../../packages/common/src/algorithms/Graph/Edge.ts";
import {Graph} from "../../../packages/common/src/algorithms/Graph/Graph.ts";
import {nodesString, edgesString} from "./GraphWeightAndHeuristicCreation.test.ts";

/* - - - resources - - - */
const nodes: Array<NodeForGraph> = readNodeCSV(nodesString);
const edges: Array<Edge> = readEdgeCSV(edgesString);
const graph: Graph = new Graph(nodes, edges);

/* - - - test definitions - - - */
function AStar_trivial_path(): void {
    /* make the tested and expected paths */
    const test_path: Array<NodeForGraph> | null = AStar(graph.idToNode("1"), graph.idToNode("1"), graph);
    const expected_path: Array<NodeForGraph> = new Array<NodeForGraph>();
    expected_path.push(graph.idToNode("1")!);

    /* it better match */
    expect(test_path).toStrictEqual(expected_path);
}

function AStar_single_floor(): void {
    /* make the tested and expected paths */
    const test_path: Array<NodeForGraph> | null = AStar(graph.idToNode("1"), graph.idToNode("10"), graph);
    const expected_path: Array<NodeForGraph> = new Array<NodeForGraph>();
    expected_path.push(graph.idToNode("1")!);
    expected_path.push(graph.idToNode("2")!);
    expected_path.push(graph.idToNode("5")!);
    expected_path.push(graph.idToNode("7")!);
    expected_path.push(graph.idToNode("8")!);
    expected_path.push(graph.idToNode("10")!);

    /* it better match */
    expect(test_path).toStrictEqual(expected_path);
}

function AStar_multiple_floors(): void {
    /* make the tested and expected paths */
    const test_path: Array<NodeForGraph> | null = AStar(graph.idToNode("2"), graph.idToNode("16"), graph);
    const expected_path: Array<NodeForGraph> = new Array<NodeForGraph>();
    expected_path.push(graph.idToNode("2")!);
    expected_path.push(graph.idToNode("1")!);
    expected_path.push(graph.idToNode("4")!);
    expected_path.push(graph.idToNode("11")!);
    expected_path.push(graph.idToNode("13")!);
    expected_path.push(graph.idToNode("15")!);
    expected_path.push(graph.idToNode("16")!);

    /* it better match */
    expect(test_path).toStrictEqual(expected_path);
}

/* - - - test execution - - - */
test("Test graph from node 1 to 1 (trivial)", AStar_trivial_path);
test("Test graph from node 1 to 10 (same floor)", AStar_single_floor);
test("Test graph from node 2 to 16 (multiple floors)", AStar_multiple_floors);
