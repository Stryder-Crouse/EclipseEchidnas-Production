import express, {Router, Request, Response} from "express";
//import { MedReq, Request } from "../algorithms/node.ts";
import PrismaClient from "../bin/database-connection.ts";
import {MedReq, ServiceRequest} from "../algorithms/Requests/Request.ts"; //may also be wrong

//import path from "path";
//import fs from "fs";

const router: Router = express.Router();

//posts all requests from ____ (a csv?) to the database
//router.post("/post-all", async function (req: Request, res: Response) {});

//posts one new request from the user to the database
router.post("/medReq", async function (req: Request, res: Response) {
    const data: MedReq = req.body;

    console.log(req.body);
    //sets every part of node to whatever was entered while running (not during compile - point of promise/await)
    try {
        await PrismaClient.medReq.create({
            data: {
                medReqID: data.medReqID,
                medType: data.medType,
                dosage: data.dosage,
                numDoses: data.numDoses,

                genReq:{
                    connectOrCreate:{
                        where: {
                            reqID: data.genReq.reqID
                        },
                        create: {

                        }
                    }
                }
            },
        });

        console.info("Successfully saved node"); // Log that it was successful
    } catch (error) {
        // Log any failures
        console.error(`Unable to save requests`);
        res.sendStatus(400); // Send error
    }
});
router.post("/serviceReq", async function (req: Request, res: Response) {
    const data: ServiceRequest = req.body;

    console.log(req.body);
    //sets every part of node to whatever was entered while running (not during compile - point of promise/await)
    try {
        await PrismaClient.serviceRequest.create({
            data: {
                reqID: data.reqID,
                reqType: data.reqType,
                //connect the Node field using the node id as a foreign key
                reqLocation: {
                    connect: {
                        nodeID: data.reqLocation.id,
                    }
                },
                extraInfo: data.extraInfo,
                status: data.status,
                //connect the Employee field using the username as a foreign key
                assigned: {
                    connect: {
                        userName: data.assigned.userName,
                    }
                }
            },
        });

        console.info("Successfully saved node"); // Log that it was successful
    } catch (error) {
        // Log any failures
        console.error(`Unable to save requests`);
        res.sendStatus(400); // Send error
    }
});
//gets all requests from the database in the form of request objects
router.get("/medReq", async function (req: Request, res: Response) {
    try {
        //try to send all the nodes to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.send(await PrismaClient.medReq.findMany()); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you the requests\n");
    } catch (err) {
        console.error("\nUnable to send requests\n");
    }
});
router.get("/serviceReq", async function (req: Request, res: Response) {
    try {
        //try to send all the nodes to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.send(await PrismaClient.serviceRequest.findMany()); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you the requests\n");
    } catch (err) {
        console.error("\nUnable to send requests\n");
    }
});

export default router;
