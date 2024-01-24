/*
import express, { Router, Request, Response } from "express";
import { Prisma } from "database"; //may be very wrong
import { node } from "../algorithms/node.ts";
import { coordinate } from "../algorithms/coordinate.ts";
import { edge } from "../algorithms/edge.ts";
import { readNodeCSV } from "../algorithms/readCSV.ts";
import { readEdgeCSVNOLINK } from "../algorithms/readCSV.ts";
import PrismaClient from "../bin/database-connection.ts"; //may also be wrong
import path from "path";
import fs from "fs";

const router: Router = express.Router();

async function main() {
  router.post("/", async function (req: Request, res: Response) {
    let allNodeString = "";
    let allEdgeString = "";

    //NODES
    try {
      const csvLocation = path.resolve(
        __dirname,
        "../../resources/L1Nodes.csv",
      );
      allNodeString = fs.readFileSync(csvLocation, "utf-8");
    } catch (error) {
      console.error("CVS node file not found");
      res.status(204); // and send 204
      return;
    }
    const nodeArray: node[] = readNodeCSV(allNodeString);

    nodeArray.forEach((node) => {
      try {
        // Attempt to create in the database
        await PrismaClient.node.create({
          data: {
            nodeID: node.iD,
            floor: node.floor,
            building: node.building,
            nodeType: node.nodeType,
            longName: node.longName,
            shortName: node.shortName,
            xcoord: node.coordinate.x,
            ycoord: node.coordinate.y,
            startEdges: node.edges,
            endEdges: node.edges,
          },
        }); //this line should be changed, also
        console.info("Successfully saved node"); // Log that it was successful
      } catch (error) {
        // Log any failures
        console.error(`Unable to save node ${node}: ${error}`);
        res.sendStatus(400); // Send error
        return; // Don't try to send duplicate statuses
      }
    });

    //EDGES
    try {
      const csvLocation = path.resolve(
        __dirname,
        "../../resources/L1Edges.csv",
      );
      allEdgeString = fs.readFileSync(csvLocation, "utf-8");
    } catch (error) {
      console.error("CVS edge file not found");
      res.status(204); // and send 204
      return;
    }
    const edgeArray: edge[] = readEdgeCSVNOLINK(allEdgeString);

    edgeArray.forEach((edge) => {
      try {
        // Attempt to create in the database
        await PrismaClient.edge.create({
          data: {
            edgeID: edge.iD,
            startNode: edge.startNode,
            endNode: edge.endNode,
          },
        }); //this line should be changed, also
        console.info("Successfully saved edge"); // Log that it was successful
      } catch (error) {
        // Log any failures
        console.error(`Unable to save edge ${edge}: ${error}`);
        res.sendStatus(400); // Send error
        return; // Don't try to send duplicate statuses
      }
    });
  });
}
*/
