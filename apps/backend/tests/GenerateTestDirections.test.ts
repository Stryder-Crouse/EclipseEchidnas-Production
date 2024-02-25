import {expect, test} from "vitest";
import {Node} from "../../../packages/common/src/algorithms/Graph/Node.ts";
import {
    findDeviation,
    generateTextDirections, removeExtraTransitions
} from "common/src/algorithms/Search/TextDirections/GenerateTextDirections.ts";
import {Coordinate} from "../../../packages/common/src/algorithms/Graph/Coordinate.ts";
import {readEdgeCSV, readNodeCSV} from "../src/algorithms/readCSV.ts";
import {Edge} from "../../../packages/common/src/algorithms/Graph/Edge.ts";
import {Graph} from "../../../packages/common/src/algorithms/Graph/Graph.ts";
import {nodesString, edgesString} from "./GraphWeightAndHeuristicCreation.test.ts";
import {AStar} from "../../../packages/common/src/algorithms/Search/AStar.ts";

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
        longName: "test",
        coordinate: coordinate,
    };
}

/**
 * Create a new "node"
 * @param longName the coordinate
 * @param newFloor the floor
 * @return the new "node"
 */
function newNodeWithFloor(longName: string, newFloor: string) {
    return <Node>{
        longName: longName,
        floor: newFloor
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
    const test_directions: string [][] | null = generateTextDirections(test_path, graph);
    const expected_directions: string[][] =
        //right is left and left is right as the graph uses a regular coordinate system y+ up y- down
        //compared to the one used on the map page y+ down, y- up
        [
            [],[],[],
            [
                "1: Starting at Anesthesia Conf Floor L1",
                "2: ↖️Bear left near Medical Records Conference Room Floor L1",
                "3: ↖️Bear left near Day Surgery Family Waiting Exit Floor L1",
                "4: You have arrived"
            ],
            [],[]
        ];

    /* it better match */
    expect(test_directions).toStrictEqual(expected_directions);
}

function generateTextDirections_long_path(): void {
    /* make the tested and expected paths */
    const test_path: Array<Node> | null = AStar(graph.idToNode("7"), graph.idToNode("16"), graph);
    const test_directions: string[][] | null = generateTextDirections(test_path, graph);
    const expected_directions: string[][] =
        //right is left and left is right as the graph uses a regular coordinate system y+ up y- down
        //compared to the one used on the map page y+ down, y- up
        [
            [],[],[],
            [
                "1: Starting at Hallway 1 Floor L1",
                "2: ↖️Bear left near  Elevator node 10",
                "3: 🔺Take elevator to floor 2"
            ],
            [
                "4: ↖️Bear left near Elevator node 13",
                "5: 🔺Take elevator to floor 3"
            ],
            [
                "6: You have arrived"
            ]
        ];


    /* it better match */
    expect(test_directions).toStrictEqual(expected_directions);
}


function testRemoveExtraTransitions(): void {
    const n1 = newNodeWithFloor("n1", "L2");
    const n2 = newNodeWithFloor("n2", "L1");
    const n3 = newNodeWithFloor("n3", "G");
    const n4 = newNodeWithFloor("n4", "1");
    const n5 = newNodeWithFloor("n5", "2");
    const n6 = newNodeWithFloor("n6", "2");
    const n7 = newNodeWithFloor("n7", "3");
    const n8 = newNodeWithFloor("n8", "3");
    const n9 = newNodeWithFloor("n9", "3");

    const test_path: Array<Node> = [];
    test_path.push(n1);
    test_path.push(n2);
    test_path.push(n3);
    test_path.push(n4);
    test_path.push(n5);
    test_path.push(n6);
    test_path.push(n7);
    test_path.push(n8);
    test_path.push(n9);

    const newPath = removeExtraTransitions(test_path);
    expect(newPath).toStrictEqual([n1, n5, n6, n7, n8, n9]);
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
test("remove extra transitions - remove", testRemoveExtraTransitions);

