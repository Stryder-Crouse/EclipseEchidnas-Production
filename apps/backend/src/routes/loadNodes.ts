import express, { Router, Request, Response } from "express";
//import { Prisma } from "database"; //may be very wrong
import { Node } from "../algorithms/Graph/Node.ts";
//import { coordinate } from "../algorithms/coordinate.ts";
import { readNodeCSV } from "../algorithms/readCSV.ts";
import PrismaClient from "../bin/database-connection.ts"; //may also be wrong
import path from "path";
import fs from "fs";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  //this is the post function and it is called in AdminMapPage.tsx as of 1/29/24
  let allNodeString = "";

  //NODES
  try {
    const csvLocation = path.resolve(__dirname, "../../resources/L1Nodes.csv");
    allNodeString = fs.readFileSync(csvLocation, "utf-8");
  } catch (error) {
    console.error("CSV node file not found");
    res.status(204); // and send 204
    return;
  }
  const nodeArray: Node[] = readNodeCSV(allNodeString);

  //console.info("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nGot Here\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");

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
            nodeID: nodeData.id,
            floor: nodeData.floor,
            building: nodeData.building, //I believe the data for the table will be inserted already in node form
            nodeType: nodeData.nodeType, // so this program will take the node (called nodeDate) and split it
            longName: nodeData.longName, // into its individual parts
            shortName: nodeData.shortName,
            xcoord: nodeData.coordinate.x,
            ycoord: nodeData.coordinate.y,
            startEdges: {
              connect: nodeData.edges.map((edge) => ({ edgeID: edge.id })),
            },
            endEdges: {
              connect: nodeData.edges.map((edge) => ({ edgeID: edge.id })),
            },
          },
        }); //this line should be changed, also
        console.info("Successfully saved node"); // Log that it was successful
      } catch (error) {
        // Log any failures
        console.error(`Unable to save node ${nodeData.id}: ${error}`);
        res.sendStatus(400); // Send error
        return; // Don't try to send duplicate statuses
      }
    }),
  );
});

router.get("/", async function (req: Request, res: Response) {
  try {
    //try to send all the nodes to the client
    //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
    res.send(
      await PrismaClient.node.findMany({
        orderBy: {
          longName: "asc", //specify here that we are ordering the 'longName' field in ascending order (A->Z)
        },
      }),
    ); //end res.send (this is what will be sent to the client)
    console.info("\n\n\n\n\n\nSuccessfully gave you the nodes\n\n\n\n\n\n");
  } catch (err) {
    console.error("\n\n\n\n\n\nUnable to send Nodes\n\n\n\n\n\n");
  }
});

export default router;
