import { expect, test } from "vitest";
import { Buildings, node, NodeType } from "../src/algorithms/Graph/node.ts";
import { edge } from "../src/algorithms/Graph/edge.ts";
import { readEdgeCSV, readNodeCSV } from "../src/algorithms/readCSV.ts";
import { Graph } from "../src/algorithms/Graph/Graph.ts";
import { bfs } from "../src/algorithms/bfs/bfs.ts";

//BFS test
test("BFS test", () => {
  const nodes: Array<node> = readNodes();
  const edges: Array<edge> = readEdges();
  const graph: Graph = new Graph(nodes, edges);

  //path from node 1 to node 1 is itself // ? allow for object returned to be undifind
  const test1 = bfs(graph.idToNode("1"), graph.idToNode("1"), graph);
  expect(test1?.at(0)?.iD).toBe("1");
  expect(test1?.length).toBe(1);

  //path from node 1 to node 2 is 1 -> 2
  const test2 = bfs(graph.idToNode("1"), graph.idToNode("2"), graph);
  //strictequal checks whole object [deep recursive check]
  expect(test2).toStrictEqual([graph.idToNode("1"), graph.idToNode("2")]);
  expect(test2?.length).toBe(2);

  //best path from node 1 to node 10 is 1 -> 3 -> 6 -> 9 -> 10
  const test3 = bfs(graph.idToNode("1"), graph.idToNode("10"), graph);
  expect(test3).toStrictEqual([
    graph.idToNode("1"),
    graph.idToNode("3"),
    graph.idToNode("6"),
    graph.idToNode("9"),
    graph.idToNode("10"),
  ]);
  expect(test3?.length).toBe(5);

  //no path between two separate graphs
  const test4 = bfs(graph.idToNode("1"), graph.idToNode("14"), graph);
  expect(test4).toBe(null);

  //no path to node that does not exist
  const test5 = bfs(
    graph.idToNode("1"),
    {
      building: Buildings.UNDEFINED,
      coordinate: { x: 1, y: 1 },
      edges: [],
      floor: "",
      iD: "Does Not exist",
      longName: "",
      nodeType: NodeType.UNDEFINED,
      shortName: "",
    },
    graph,
  );

  expect(test5).toBe(null);
});

//readCSV/Graph creation test
test("readCSV and Graph Creation", () => {
  const edges: Array<edge> = readEdges();
  const nodes: Array<node> = readNodes();
  const graph: Graph = new Graph(nodes, edges);

  //make sure we get the same node data back out
  expect(graphToString(graph)).toStrictEqual(
    "1,2255,849,L1,45 Francis,CONF,Anesthesia Conf Floor L1,Conf C001L1\r\n" +
      "2,2665,1043,L1,45 Francis,CONF,Medical Records Conference Room Floor L1,Conf C002L1\r\n" +
      "3,2445,1245,L1,45 Francis,CONF,Abrams Conference Room,Conf C003L1\r\n" +
      "4,1980,844,L1,Tower,DEPT,Day Surgery Family Waiting Floor L1,Department C002L1\r\n" +
      "5,1845,844,L1,Tower,DEPT,Day Surgery Family Waiting Exit Floor L1,Department C003L1\r\n" +
      "6,2310,1043,L1,45 Francis,DEPT,Medical Records Film Library Floor L1,Department C004L1\r\n" +
      "7,1732,924,L1,Tower,HALL,Hallway 1 Floor L1,Hallway C001L1\r\n" +
      "8,2445,1043,L1,45 Francis,HALL,Hallway 2 Floor L1,Hallway C002L1\r\n" +
      "9,2445,1284,L1,45 Francis,HALL,Hallway 3 Floor L1,Hallway C003L1\r\n" +
      "10,2770,1070,L1,45 Francis,HALL,Hallway 4 Floor L1,Hallway C004L1\r\n" +
      "11,1750,1284,L1,Tower,HALL,Hallway 5 Floor L1,Hallway C005L1\r\n" +
      "12,2130,1284,L1,Tower,HALL,Hallway 6 Floor L1,Hallway C006L1\r\n" +
      "13,2130,1045,L1,Tower,HALL,Hallway 7 Floor L1,Hallway C007L1\r\n" +
      "14,2215,1045,L1,45 Francis,HALL,Hallway 8 Floor L1,Hallway C008L1\r\n",
  );

  //count number of edges
  expect(graph.getEdges().length).toStrictEqual(14);
  // edges are bidirectional but this list only stores the minimum needed to create the graph
});

function graphToString(g: Graph) {
  let str = "";
  const failNode: node = {
    building: Buildings.UNDEFINED,
    coordinate: { x: 1, y: 1 },
    edges: [],
    floor: "",
    iD: "FAIL",
    longName: "",
    nodeType: NodeType.UNDEFINED,
    shortName: "",
  };

  for (let i = 0; i < g.getNodes().length; i++) {
    if (g.getNodes().at(i) != null || undefined) {
      str += nodeToString(g.getNodes().at(i) ?? failNode);
    }
  }
  return str;
}

function nodeToString(n: node) {
  return (
    n.iD +
    "," +
    n.coordinate.x.toString() +
    "," +
    n.coordinate.y.toString() +
    "," +
    n.floor +
    "," +
    n.building +
    "," +
    n.nodeType +
    "," +
    n.longName +
    "," +
    n.shortName +
    "\r\n"
  );
}

function readEdges() {
  const edgesString: string =
    "e1-2,1,2\r\n" +
    "e1-3,1,3\r\n" +
    "e1-4,1,4\r\n" +
    "e2-5,2,5\r\n" +
    "e3-6,3,6\r\n" +
    "e5-7,5,7\r\n" +
    "e6-9,6,9\r\n" +
    "e7-8,7,8\r\n" +
    "e9-10,9,10\r\n" +
    "e8-10,8,10\r\n" +
    "e11-12,11,12\r\n" +
    "e11-13,11,13\r\n" +
    "e13-12,13,12\r\n" +
    "e12-14,12,14\r\n";

  return readEdgeCSV(edgesString);
}

function readNodes() {
  const nodesString: string =
    "1,2255,849,L1,45 Francis,CONF,Anesthesia Conf Floor L1,Conf C001L1\r\n" +
    "2,2665,1043,L1,45 Francis,CONF,Medical Records Conference Room Floor L1,Conf C002L1\r\n" +
    "3,2445,1245,L1,45 Francis,CONF,Abrams Conference Room,Conf C003L1\r\n" +
    "4,1980,844,L1,Tower,DEPT,Day Surgery Family Waiting Floor L1,Department C002L1\r\n" +
    "5,1845,844,L1,Tower,DEPT,Day Surgery Family Waiting Exit Floor L1,Department C003L1\r\n" +
    "6,2310,1043,L1,45 Francis,DEPT,Medical Records Film Library Floor L1,Department C004L1\r\n" +
    "7,1732,924,L1,Tower,HALL,Hallway 1 Floor L1,Hallway C001L1\r\n" +
    "8,2445,1043,L1,45 Francis,HALL,Hallway 2 Floor L1,Hallway C002L1\r\n" +
    "9,2445,1284,L1,45 Francis,HALL,Hallway 3 Floor L1,Hallway C003L1\r\n" +
    "10,2770,1070,L1,45 Francis,HALL,Hallway 4 Floor L1,Hallway C004L1\r\n" +
    "11,1750,1284,L1,Tower,HALL,Hallway 5 Floor L1,Hallway C005L1\r\n" +
    "12,2130,1284,L1,Tower,HALL,Hallway 6 Floor L1,Hallway C006L1\r\n" +
    "13,2130,1045,L1,Tower,HALL,Hallway 7 Floor L1,Hallway C007L1\r\n" +
    "14,2215,1045,L1,45 Francis,HALL,Hallway 8 Floor L1,Hallway C008L1\r\n";

  return readNodeCSV(nodesString);
}
