import express, { Router, Request, Response } from "express";
import fs from "fs";
import * as path from "path";

const router: Router = express.Router();

// Whenever a get request is made, send back the data from the node file.
router.get("/CVSnode", async function (req: Request, res: Response) {
  let allNodesString = null;
  try {
    const csvLocation = path.resolve(__dirname, "../../resources/L1Nodes.csv");
    allNodesString = fs.readFileSync(csvLocation, "utf-8");
  } catch (error) {
    console.error("CVS node file not found");
    res.status(204); // and send 204
    return;
  }

  res.send(allNodesString);
});

router.get("/CVSedge", async function (req: Request, res: Response) {
  let allEdgeString = null;
  try {
    const csvLocation = path.resolve(__dirname, "../../resources/L1Edges.csv");
    allEdgeString = fs.readFileSync(csvLocation, "utf-8");
  } catch (error) {
    console.error("CVS edge file not found");
    res.status(204); // and send 204
    return;
  }

  res.send(allEdgeString);
});

export default router;
