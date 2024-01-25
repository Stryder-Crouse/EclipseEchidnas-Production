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
  //this is the post function but idk when/where
  let allNodeString = ""; // we will call this
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
    //waits until all 'promises' are created (all the nodes I think)
    nodeArray.map(async (nodeData) => {
      //sets every part of node to whatever was entered while running (not during compile - point of promise/await)
      try {
        // above can be interpreted as a "for each" loop
        // Attempt to create in the database
        await PrismaClient.node.create({
          // .node comes from the "Model node" we created in the schema.prisma file
          data: {
            nodeID: nodeData.iD,
            floor: nodeData.floor,
            building: nodeData.building, //I believe the data for the table will be inserted already in node form
            nodeType: nodeData.nodeType, // so this program will take the node (called nodeDate) and split it
            longName: nodeData.longName, // into its individual parts
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
          // .edge comes from the "Model node" we created in the schema.prisma file
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
