import {expect, test} from "vitest";
import {Node} from "../src/algorithms/Graph/Node.ts";
import {
    Directions,
    findDeviation,
    generateTextDirections
} from "../src/algorithms/Search/TextDirections/GenerateTextDirections.ts";
import {Coordinate} from "../src/algorithms/Graph/Coordinate.ts";
import {readEdgeCSV, readNodeCSV} from "../src/algorithms/readCSV.ts";
import {Edge} from "../src/algorithms/Graph/Edge.ts";
import {Graph} from "../src/algorithms/Graph/Graph.ts";
import {nodesString, edgesString} from "./GraphWeightAndHeuristicCreation.test.ts";
import {AStar} from "../src/algorithms/Search/AStar.ts";

/* - - - resources - - - */
const nodes: Array<Node> = readNodeCSV(nodesString);
const edges: Array<Edge> = readEdgeCSV(edgesString);
const graph: Graph = new Graph(nodes, edges);

/**
 * Create a new "node"
 * @param coordinate the coordinate
 * @return the new "node"
 */
function newNodeWithCoordinate(coordinate: Coordinate) {
    return <Node>{
        longName:"test",
        coordinate: coordinate,
    };
}

/* - - - test definitions - - - */
function findDeviation_straight_line_vertical_negative(): void {
    /* make a $#177y straight line */
    const A: Node = newNodeWithCoordinate({x: 2, y: 5});
    const B: Node = newNodeWithCoordinate({x: 2, y: 3});
    const C: Node = newNodeWithCoordinate({x: 2, y: 1});

    /* call the function and pray it's 0 */
    expect(findDeviation(A, B, C)).toBe(0);
}

function findDeviation_straight_line_vertical_positive(): void {
    /* make a $#177y straight line */
    const A: Node = newNodeWithCoordinate({x: 2, y: 1});
    const B: Node = newNodeWithCoordinate({x: 2, y: 3});
    const C: Node = newNodeWithCoordinate({x: 2, y: 5});

    /* call the function and pray it's 0 */
    expect(findDeviation(A, B, C)).toBe(0);
}

function findDeviation_straight_line_horizontal_negative(): void {
    /* make a $#177y straight line */
    const A: Node = newNodeWithCoordinate({x: 5, y: 2});
    const B: Node = newNodeWithCoordinate({x: 3, y: 2});
    const C: Node = newNodeWithCoordinate({x: 1, y: 2});

    /* call the function and pray it's 0 */
    expect(findDeviation(A, B, C)).toBe(0);
}

function findDeviation_straight_line_horizontal_positive(): void {
    /* make a $#177y straight line */
    const A: Node = newNodeWithCoordinate({x: 1, y: 2});
    const B: Node = newNodeWithCoordinate({x: 3, y: 2});
    const C: Node = newNodeWithCoordinate({x: 5, y: 2});

    /* call the function and pray it's 0 */
    expect(findDeviation(A, B, C)).toBe(0);
}

function findDeviation_right_angle(): void {
    /* make a $#177y straight line */
    const A: Node = newNodeWithCoordinate({x: 2, y: 0});
    const B: Node = newNodeWithCoordinate({x: 2, y: 3});
    const C: Node = newNodeWithCoordinate({x: 4, y: 3});

    /* call the function and pray it's 90 */
    expect(findDeviation(A, B, C)).toBe(90);
}

function findDeviation_right_angle_other_way(): void {
    /* make a $#177y straight line */
    const A: Node = newNodeWithCoordinate({x: 2, y: 0});
    const B: Node = newNodeWithCoordinate({x: 2, y: 3});
    const C: Node = newNodeWithCoordinate({x: 0, y: 3});

    /* call the function and pray it's 90 */
    expect(findDeviation(A, B, C)).toBe(90);
}

function findDeviation_forty_five(): void {
    /* make a $#177y straight line */
    const A: Node = newNodeWithCoordinate({x: 1, y: 4});
    const B: Node = newNodeWithCoordinate({x: 1, y: 2});
    const C: Node = newNodeWithCoordinate({x: 3, y: 0});

    /* call the function and pray it's 45 */
    expect(findDeviation(A, B, C)).toBeCloseTo(45);
}

function findDeviation_thirty_three(): void {
    /* make a $#177y straight line */
    const A: Node = newNodeWithCoordinate({x: 6, y: 3});
    const B: Node = newNodeWithCoordinate({x: 4, y: 3});
    const C: Node = newNodeWithCoordinate({x: 1, y: 1});

    /* call the function and pray it's 33 */
    expect(findDeviation(A, B, C)).toBeCloseTo(33.69);
}

function findDeviation_rotated_right_angle(): void {
    /* make a $#177y straight line */
    const A: Node = newNodeWithCoordinate({x: 3, y: 4});
    const B: Node = newNodeWithCoordinate({x: 1, y: 2});
    const C: Node = newNodeWithCoordinate({x: 3, y: 0});

    /* call the function and pray it's 33 */
    expect(findDeviation(A, B, C)).toBe(90);
}

function generateTextDirections_two_right_turns(): void {
    /* make the tested and expected paths */
    const test_path: Array<Node> | null = AStar(graph.idToNode("1"), graph.idToNode("7"), graph);
    const test_directions: Array<string> | null =  generateTextDirections(test_path);
    const expected_directions: Array<string> = new Array<string>();
    expected_directions.push("Starting at Anesthesia Conf Floor L1");
    expected_directions.push(Directions.BEAR_RIGHT);
    expected_directions.push(Directions.RIGHT);
    expected_directions.push("You have arrived");

    /* it better match */
    expect(test_directions).toStrictEqual(expected_directions);
}

function generateTextDirections_long_path(): void {
    /* make the tested and expected paths */
    const test_path: Array<Node> | null = AStar(graph.idToNode("7"), graph.idToNode("16"), graph);
    const test_directions: Array<string> | null =  generateTextDirections(test_path);
    const expected_directions: Array<string> = new Array<string>();
    expected_directions.push("Starting at Anesthesia Conf Floor L1");
    expected_directions.push(Directions.BEAR_RIGHT);
    expected_directions.push(Directions.RIGHT);
    expected_directions.push("You have arrived");

    /* it better match */
    expect(test_directions).toStrictEqual(expected_directions);
}

/* - - - test execution - - - */
/* findDeviation */
test("Test a straight line going in the negative y direction (up)", findDeviation_straight_line_vertical_negative);
test("Test a straight line going in the positive y direction (down)", findDeviation_straight_line_vertical_positive);
test("Test a straight line going in the negative x direction (left)", findDeviation_straight_line_horizontal_negative);
test("Test a straight line going in the positive x direction (right)", findDeviation_straight_line_horizontal_positive);
test("Test a right angle going down and right", findDeviation_right_angle);
test("Test a right angle going down and left", findDeviation_right_angle_other_way);
test("Test a 45 degree angle", findDeviation_forty_five);
test("Test a 33 degree angle", findDeviation_thirty_three);
test("Test a rotated right angle going left and up", findDeviation_rotated_right_angle);

/* generateTextDirections */
test("Simple test path with two right turns", generateTextDirections_two_right_turns);

test("long path", generateTextDirections_long_path);



