import express, { Router, Request, Response } from "express";
import { Prisma } from "database"; //may be very wrong
import PrismaClient from "../bin/database-connection.ts"; //may also be wrong

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  //this should be changed from a highScoreCreateAttempt to some sort of "nodeCreateAttempt", but that doesn't seem to exist yet
  const nodeAttempt: Prisma.HighScoreCreateInput = req.body;
  // Attempt to create the node
  try {
    // Attempt to create in the database
    await PrismaClient.highScore.create({ data: nodeAttempt }); //this line should be changed, also
    console.info("Successfully saved high score attempt"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save node ${nodeAttempt}: ${error}`);
    res.sendStatus(400); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});
