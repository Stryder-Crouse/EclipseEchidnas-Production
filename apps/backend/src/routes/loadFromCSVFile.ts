import express, { Router, Request, Response } from "express";
import fs from "fs";
import * as path from "path";

const router: Router = express.Router();

// Whenever a get request is made to /CVSnode, send back the data from the node file.
router.get("/CVSnode", async function (req: Request, res: Response) {
  let allNodesString = null;
  try {
    //calculate file location
    const csvLocation = path.resolve(__dirname, "../../resources/L1Nodes.csv");
    //read file into string
    allNodesString = fs.readFileSync(csvLocation, "utf-8");
  } catch (error) {
    console.error("CVS node file not found");
    res.status(204); // and send 204
    return;
  }
  //send file data if no errors
  res.send(allNodesString);
});

// Whenever a get request is made to /CVSedge, send back the data from the edge file.
router.get("/CVSedge", async function (req: Request, res: Response) {
  let allEdgeString = null;
  try {
    //calculate file location
    const csvLocation = path.resolve(__dirname, "../../resources/L1Edges.csv");
    //read file into string
    allEdgeString = fs.readFileSync(csvLocation, "utf-8");
  } catch (error) {
    console.error("CVS edge file not found");
    res.status(204); // and send 204
    return;
  }

  res.send(allEdgeString);
});

export default router;
