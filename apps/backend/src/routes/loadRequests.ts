import express, { Router, Request, Response } from "express";
//import { MedReq, Request } from "../algorithms/node.ts";
import PrismaClient from "../bin/database-connection.ts";
import { GenericRequest, ReqTypes } from "../algorithms/Requests/Request.ts"; //may also be wrong

//import path from "path";
//import fs from "fs";

const router: Router = express.Router();

//posts all requests from ____ (a csv?) to the database
//router.post("/post-all", async function (req: Request, res: Response) {});

//posts one new request from the user to the database
router.post("/post-one", async function (req: Request, res: Response) {
  const oneRequest: GenericRequest = req.body;
  //sets every part of node to whatever was entered while running (not during compile - point of promise/await)
  try {
    switch (oneRequest.reqType) {
      case ReqTypes.medReq:
        // Attempt to create in the database
        await PrismaClient.request.create({
          // request comes from the "Model request" we created in the schema.prisma file
          data: {
            reqID: oneRequest.id,
            reqType: oneRequest.reqType,
            reqLocation: {
              connect: { nodeID: oneRequest.reqLocation.id },
            },
            extraInfo: oneRequest.extraInfo,

            medReq: {
              connect: { medReqID: oneRequest.medReq.medReqID },
            },
          },
        });
        console.info("Successfully saved node"); // Log that it was successful
        break;
      default:
        console.error(`Unable to save node ${oneRequest.id}: no type given`); // Log that it failed
        res.sendStatus(400); // Send error
        break;
    }
  } catch (error) {
    // Log any failures
    console.error(`Unable to save node ${oneRequest.id}: ${error}`);
    res.sendStatus(400); // Send error
  }
});
//gets all requests from the database in the form of request objects
//router.get("/", async function (req: Request, res: Response) {});

export default router;
