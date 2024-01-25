import express, { Router, Request, Response } from "express";
//import { Prisma } from "database"; //may be very wrong
import { node } from "../algorithms/node.ts";
//import { coordinate } from "../algorithms/coordinate.ts";
import { edge } from "../algorithms/edge.ts";
import { readNodeCSV } from "../algorithms/readCSV.ts";
import { readEdgeCSVNOLINK } from "../algorithms/readCSV.ts";
import PrismaClient from "../bin/database-connection.ts"; //may also be wrong
import path from "path";
import fs from "fs";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  let allNodeString = "";
  let allEdgeString = "";

  //NODES
  try {
    const csvLocation = path.resolve(__dirname, "../../resources/L1Nodes.csv");
    allNodeString = fs.readFileSync(csvLocation, "utf-8");
  } catch (error) {
    console.error("CVS node file not found");
    res.status(204); // and send 204
    return;
  }
  const nodeArray: node[] = readNodeCSV(allNodeString);

  await Promise.all(
    nodeArray.map(async (nodeData) => {
      try {
        // Attempt to create in the database
        await PrismaClient.node.create({
          data: {
            nodeID: nodeData.iD,
            floor: nodeData.floor,
            building: nodeData.building,
            nodeType: nodeData.nodeType,
            longName: nodeData.longName,
            shortName: nodeData.shortName,
            xcoord: nodeData.coordinate.x,
            ycoord: nodeData.coordinate.y,
            startEdges: {
              connect: nodeData.edges.map((edge) => ({ edgeID: edge.iD })),
            },
            endEdges: {
              connect: nodeData.edges.map((edge) => ({ edgeID: edge.iD })),
            },
          },
        }); //this line should be changed, also
        console.info("Successfully saved node"); // Log that it was successful
      } catch (error) {
        // Log any failures
        console.error(`Unable to save node ${nodeData.iD}: ${error}`);
        res.sendStatus(400); // Send error
        return; // Don't try to send duplicate statuses
      }
    }),
  );

  //EDGES
  try {
    const edgeCsvLocation = path.resolve(
      __dirname,
      "../../resources/L1Edges.csv",
    );
    allEdgeString = fs.readFileSync(edgeCsvLocation, "utf-8");
  } catch (error) {
    console.error("CVS edge file not found");
    res.status(204); // and send 204
    return;
  }
  const edgeArray: edge[] = readEdgeCSVNOLINK(allEdgeString);

  await Promise.all(
    edgeArray.map(async (edgeData) => {
      try {
        // Attempt to create in the database
        await PrismaClient.edge.create({
          data: {
            edgeID: edgeData.iD,
            startNode: { connect: { nodeID: edgeData.startNode.iD } },
            endNode: { connect: { nodeID: edgeData.endNode.iD } },
          },
        }); //this line should be changed, also
        console.info("Successfully saved edge"); // Log that it was successful
      } catch (error) {
        // Log any failures
        console.error(`Unable to save edge ${edgeData.iD}: ${error}`);
        res.sendStatus(400); // Send error
        return; // Don't try to send duplicate statuses
      }
    }),
  );
});

export default router;
