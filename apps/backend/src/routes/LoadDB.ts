import { Node } from "../algorithms/Graph/Node.ts";
import { Edge } from "../algorithms/Graph/Edge.ts";
import { readEdgeCSV, readNodeCSV } from "../algorithms/readCSV.ts";
import PrismaClient from "../bin/database-connection.ts"; //may also be wrong
import path from "path";
import fs from "fs";
import {
  NodeDataBase,
  nodeToNodeDataBase,
} from "../DataBaseClasses/NodeDataBase.ts";
import {
  EdgeDataBase,
  edgeToEdgeDataBase,
} from "../DataBaseClasses/EdgeDataBase.ts";

//We always know where the file is located, so save the directory's location
const csvLocation_Nodes = path.resolve(
  __dirname,
  "../../resources/nodes.csv",
);
const csvLocation_Edges = path.resolve(
  __dirname,
  "../../resources/edges.csv",
);

//now parse the file and get all the data as a string
const nodeStr = fs.readFileSync(csvLocation_Nodes, "utf-8");
const edgeStr = fs.readFileSync(csvLocation_Edges, "utf-8");

//now we parse the file and organize it into data which Prisma (the tables) can use
const edgeArray: Edge[] = readEdgeCSV(edgeStr);
const nodeArray: Node[] = readNodeCSV(nodeStr);

//convert to db node
const edgeDBArray: EdgeDataBase[] = [];
const nodeDBArray: NodeDataBase[] = [];

edgeArray.forEach((edge) => {
  const newEdgeDB = edgeToEdgeDataBase(edge);
  edgeDBArray.push(newEdgeDB);
});

nodeArray.forEach((node) => {
  const newNodeDB = nodeToNodeDataBase(node);
  nodeDBArray.push(newNodeDB);
});

//create a function to be called which Initially Populates the Node and Edge DB
export default async function dbInit() {
  try {
    //empty out the Database
    await PrismaClient.$transaction([
      PrismaClient.edgeDB.deleteMany(),
      PrismaClient.medReq.deleteMany(),
      PrismaClient.nodeDB.deleteMany(),
    ]);
    //add in all the Nodes and Edges that are in the above CSV file
    await PrismaClient.nodeDB.createMany({ data: nodeDBArray });
    await PrismaClient.edgeDB.createMany({ data: edgeDBArray });
  } catch (err) {
    console.log(
      "\n\nSo sad bc initially populating the nodes and edges didn't work\n\n",
    );
  }
}
