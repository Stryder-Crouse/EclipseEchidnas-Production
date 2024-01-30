import express, { Router, Request, Response } from "express";
import fs from "fs";
import * as path from "path";

const router: Router = express.Router();

// Whenever a get request is made to /CSVnode, send back the data from the node file.
router.get("/CSVnode", async function (req: Request, res: Response) {
  let allNodesString = null;
  try {
    //calculate file location
    const csvLocation = path.resolve(__dirname, "../../resources/L1Nodes.csv");
    //read file into string
    allNodesString = fs.readFileSync(csvLocation, "utf-8");
  } catch (error) {
    console.error("CSV node file not found");
    res.status(204); // and send 204
    return;
  }
  //send file data if no errors
  res.send(allNodesString);
});

// Whenever a get request is made to /CSVedge, send back the data from the edge file.
router.get("/CSVedge", async function (req: Request, res: Response) {
  let allEdgeString = null;
  try {
    //calculate file location
    const csvLocation = path.resolve(__dirname, "../../resources/L1Edges.csv");
    //read file into string
    allEdgeString = fs.readFileSync(csvLocation, "utf-8");
  } catch (error) {
    console.error("CSV edge file not found");
    res.status(204); // and send 204
    return;
  }

  res.send(allEdgeString);
});

export default router;
