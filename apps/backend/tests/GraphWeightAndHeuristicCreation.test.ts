import {expect, test} from "vitest";
import {Node} from "../src/algorithms/Graph/Node.ts";
import {Edge} from "../src/algorithms/Graph/Edge.ts";
import {Graph} from "../src/algorithms/Graph/Graph.ts";
import {readEdgeCSV, readNodeCSV} from "../src/algorithms/readCSV.ts";
import {euclideanDistance} from "../src/algorithms/Graph/Coordinate.ts";


export const nodesString: string =
    "1,0,0,1,45 Francis,CONF,Anesthesia Conf Floor L1,Conf C001L1\r\n" +
    "2,0,5,1,45 Francis,CONF,Medical Records Conference Room Floor L1,Conf C002L1\r\n" +
    "3,3,-4,1,45 Francis,CONF,Abrams Conference Room,Conf C003L1\r\n" +
    "4,-6,-4,1,Tower,STAI, stairs node 4 ,stairs node 4 \r\n" +
    "5,4,10,1,Tower,DEPT,Day Surgery Family Waiting Exit Floor L1,Department C003L1\r\n" +
    "6,12,-3,1,45 Francis,DEPT,Medical Records Film Library Floor L1,Department C004L1\r\n" +
    "7,10,10,1,Tower,HALL,Hallway 1 Floor L1,Hallway C001L1\r\n" +
    "8,12,6,1,45 Francis,HALL,Hallway 2 Floor L1,Hallway C002L1\r\n" +
    "9,27,-2,1,45 Francis,HALL,Hallway 3 Floor L1,Hallway C003L1\r\n" +
    "10,12,0,1,45 Francis,ELEV, Elevator node 10,Elevator  node 10\r\n" +
    "11,2,4,2,Tower,STAI,stairs  node 11,stairs  node 11\r\n" +
    "12,4,0,2,Tower,HALL,Hallway 6 Floor L1,Hallway C006L1\r\n" +
    "13,0,0,2,Tower,ELEV,Elevator node 13,Elevator  node 13\r\n" +
    "14,8,4,2,45 Francis,ELEV,Elevator node 14,Elevator node 14\r\n" +
    "15,5,0,3,45 Francis,ELEV,Elevator node 15,Elevator node 15\r\n" +
    "16,0,0,3,45 Francis,HALL,Node 16,node 16\r\n";
export const edgesString: string =
    "1_2,1,2\r\n" +
    "1_3,1,3\r\n" +
    "1_4,1,4\r\n" +
    "2_5,2,5\r\n" +
    "3_6,3,6\r\n" +
    "5_7,5,7\r\n" +
    "6_9,6,9\r\n" +
    "7_8,7,8\r\n" +
    "9_10,9,10\r\n" +
    "8_10,8,10\r\n" +
    "11_12,11,12\r\n" +
    "11_13,11,13\r\n" +
    "13_12,13,12\r\n" +
    "12_14,12,14\r\n" +
    "15_16,15,16\r\n" +
    "4_11,4,11\r\n" +   // floor transition edge
    "10_14,10,14\r\n" + // floor transition edge
    "13_15,13,15\r\n"; // floor transition edge

const floorPenalty = 5000;
const transitionWeight = 5000;


test("edge weight creation", () => {
    const nodes: Array<Node> = readNodeCSV(nodesString);
    const edges: Array<Edge> = readEdgeCSV(edgesString);

    const graph: Graph = new Graph(nodes, edges);

    //edge 1 to 4
    expect(graph.getEdges()[2].weight).toStrictEqual(euclideanDistance({x: -6, y: -4}, {x: 0, y: 0}));
    //edge 1 to 2
    expect(graph.getEdges()[0].weight).toStrictEqual(euclideanDistance({x: 0, y: 0}, {x: 0, y: 5}));
    //edge 1 to 3
    expect(graph.getEdges()[1].weight).toStrictEqual(euclideanDistance({x: 0, y: 0}, {x: 3, y: -4}));
    //check that elevator and stairs edges is weighted correctly
    expect(graph.getEdges()[15].weight).toStrictEqual(transitionWeight);
    expect(graph.getEdges()[16].weight).toStrictEqual(transitionWeight);
    expect(graph.getEdges()[17].weight).toStrictEqual(transitionWeight);

});

test("heuristic creation", () => {
    const nodes: Array<Node> = readNodeCSV(nodesString);
    const edges: Array<Edge> = readEdgeCSV(edgesString);

    const graph: Graph = new Graph(nodes, edges);

    //test nodes on the same floor
    graph.generateNodeHeuristic(graph.idToNode("9")!);
    //goal node heuristic should be 0
    expect(graph.idToNode("9")?.heuristic).toStrictEqual(0);
    //heuristic node 1
    expect(graph.idToNode("1")?.heuristic).toStrictEqual(euclideanDistance({x: 0, y: 0}, {x: 27, y: -2}));
    //heuristic node 9
    expect(graph.idToNode("7")?.heuristic).toStrictEqual(euclideanDistance({x: 10, y: 10}, {x: 27, y: -2}));


    //test nodes on different floors
    graph.generateNodeHeuristic(graph.idToNode("15")!);
    //make sure nodes on the same floor have only Euclidean distance as the heuristic to the goal
    expect(graph.idToNode("16")?.heuristic).toStrictEqual(5);
    //nodes one floor away should have a penalty heuristic of 5000 and chose the closest transition node to the goal.
    expect(graph.idToNode("13")?.heuristic).toStrictEqual(floorPenalty);
    expect(graph.idToNode("11")?.heuristic).toStrictEqual(floorPenalty + euclideanDistance({x: 2, y: 4}, {x: 0, y: 0}));
    //nodes two floors away should have a penalty heuristic of 10000 and chose the closest transition node to the goal.
    expect(graph.idToNode("4")?.heuristic).toStrictEqual(floorPenalty * 2);
    expect(graph.idToNode("10")?.heuristic).toStrictEqual(floorPenalty * 2);
    //node 1 should pick node 4 as the closest transition node
    expect(graph.idToNode("1")?.heuristic).toStrictEqual(floorPenalty * 2 + euclideanDistance({x: 0, y: 0}, {
        x: -6,
        y: -4
    }));
    //node 6 should pick node 10 as the closest transition node
    expect(graph.idToNode("6")?.heuristic).toStrictEqual(floorPenalty * 2 + euclideanDistance({x: 12, y: -3}, {
        x: 12,
        y: 0
    }));
    //node 5 should pick node 10 as the closest transition node
    expect(graph.idToNode("5")?.heuristic).toStrictEqual(floorPenalty * 2 + euclideanDistance({x: 4, y: 10}, {
        x: 12,
        y: 0
    }));
});


