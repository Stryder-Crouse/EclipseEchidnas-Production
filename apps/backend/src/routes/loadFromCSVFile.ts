import express, { Router, Request, Response } from "express";
import { Edge } from "../algorithms/Graph/Edge.ts";
import { Node } from "../algorithms/Graph/Node.ts";
import { readEdgeCSV, readNodeCSV } from "../algorithms/readCSV.ts";
import {
  NodeDataBase,
  nodeDataBaseToNode,
  nodeToNodeDataBase,
} from "../DataBaseClasses/NodeDataBase.ts";
import {
  EdgeDataBase,
  edgeDataBasetoEdge,
  edgeToEdgeDataBase,
} from "../DataBaseClasses/EdgeDataBase.ts";
import PrismaClient from "../bin/database-connection.ts";
import { Graph } from "../algorithms/Graph/Graph.ts";
// import fs from "fs";
// import * as path from "path";

const router: Router = express.Router();

//load recived cvs file into the database
router.post("/", async function (req: Request, res: Response) {
  const files: string[] = req.body;
  const nodes: Array<Node> = readNodeCSV(files.at(0)!);
  const edges: Array<Edge> = readEdgeCSV(files.at(1)!);

  //convert to db node
  const edgeDBArray: EdgeDataBase[] = [];
  const nodeDBArray: NodeDataBase[] = [];

  edges.forEach((edge) => {
    const newEdgeDB = edgeToEdgeDataBase(edge);
    edgeDBArray.push(newEdgeDB);
  });

  nodes.forEach((node) => {
    const newNodeDB = nodeToNodeDataBase(node);
    nodeDBArray.push(newNodeDB);
  });

  try {
    //drop current node and edge table as well as all table
    //that rely on them e.g med request
    //empty out the Database
    await PrismaClient.$transaction([
      PrismaClient.edgeDB.deleteMany(),
      PrismaClient.medReq.deleteMany(),
        PrismaClient.serviceRequest.deleteMany(),
      PrismaClient.nodeDB.deleteMany(),
    ]);
    //add in all the Nodes and Edges that are in the sent above CSV file
    await PrismaClient.nodeDB.createMany({ data: nodeDBArray });
    await PrismaClient.edgeDB.createMany({ data: edgeDBArray });
  } catch (error) {
    console.error("could not add csv files to db");
    res.status(400); // and send 204
    return;
  }
});

//todo clean up -stryder
//remake database into two csv files and send it out
router.get("/", async function (req: Request, res: Response) {
  let nodesFileString = null;
  let edgeFileString = null;

  //get edges and node from database
  const nodesDB = (await PrismaClient.nodeDB.findMany({
    orderBy: {
      longName: "asc", //specify here that we are ordering the 'longName' field in ascending order (A->Z)
    },
  })) as NodeDataBase[];
  const edgesDB = (await PrismaClient.edgeDB.findMany()) as EdgeDataBase[];

  //convert to use string methiods change???
  const edges: Array<Edge> = [];
  const nodes: Array<Node> = [];

  edgesDB.forEach((edgeDB) => {
    edges.push(edgeDataBasetoEdge(edgeDB));
  });

  nodesDB.forEach((nodeDB) => {
    nodes.push(nodeDataBaseToNode(nodeDB));
  });

  const graph = new Graph(nodes, edges);

  nodesFileString = graph.nodesToString();
  edgeFileString = graph.edgesToString();
  //console.log("Node");
  //console.log(nodesFileString);
  //console.log("EDGE");
  //console.log(edgeFileString);
  try {
    res.send([nodesFileString, edgeFileString]);
  } catch (error) {
    console.error("could not export node and edge table data");
    res.status(204); // and send 204
    return;
  }
});


// // Whenever a get request is made to /CSVnode, send back the data from the node file.
// router.get("/CSVnode", async function (req: Request, res: Response) {
//   let allNodesString = null;
//   try {
//     //calculate file location
//     const csvLocation = path.resolve(__dirname, "../../resources/L1Nodes.csv");
//     //read file into string
//     allNodesString = fs.readFileSync(csvLocation, "utf-8");
//   } catch (error) {
//     console.error("CSV node file not found");
//     res.status(204); // and send 204
//     return;
//   }
//   //send file data if no errors
//   res.send(allNodesString);
// });
//
// // Whenever a get request is made to /CSVedge, send back the data from the edge file.
// router.get("/CSVedge", async function (req: Request, res: Response) {
//   let allEdgeString = null;
//   try {
//     //calculate file location
//     const csvLocation = path.resolve(__dirname, "../../resources/L1Edges.csv");
//     //read file into string
//     allEdgeString = fs.readFileSync(csvLocation, "utf-8");
//   } catch (error) {
//     console.error("CSV edge file not found");
//     res.status(204); // and send 204
//     return;
//   }
//
//   res.send(allEdgeString);
// });

export default router;
