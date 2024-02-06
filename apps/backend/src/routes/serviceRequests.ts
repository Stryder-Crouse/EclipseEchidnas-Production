import express, {Router, Request, Response} from "express";
//import { MedReq, Request } from "../algorithms/node.ts";
import PrismaClient from "../bin/database-connection.ts";
import {MedReq, ServiceRequest} from "../algorithms/Requests/Request.ts";
// import {MedReq} from "../algorithms/Requests/Request.ts"; //may also be wrong

//import path from "path";
//import fs from "fs";

const router: Router = express.Router();

//posts all medication requests in the body of the function to the database
// each request gets its own auto-generated ID
//router.post("/post-all", async function (req: Request, res: Response) {});

//posts one new medication request from the user to the database
//the new medReq and the new serviceRequest both get their own auto-generated ID
router.post("/medReq", async function (req: Request, res: Response) {
    //console.log(req.body);
    //console.log("Med Req Above");
    const sentData:[ServiceRequest,MedReq] = req.body;
    console.info(sentData);

    //sets every part of node to whatever was entered while running (not during compile - point of promise/await)
    try {

        const service = await PrismaClient.serviceRequest.create({
            data: {
                //ID is auto created
                reqType: sentData[0].reqType,
                //connect the Node field using the node id as a foreign key
                reqLocation: {
                    connect : {
                        nodeID: sentData[0].reqLocationID
                    }
                },
                extraInfo: sentData[0].extraInfo,
                status: sentData[0].status,
                //connect the Employee field using the username as a foreign key
                assigned: {
                    connectOrCreate: {
                        create : {
                            userName: "No one",
                            firstName: "N/A",
                            lastName: "N/A",
                            designation: "N/A",
                            isAdmin: true,
                        },
                        where : {
                            userName: "No one"
                        }
                    }
                }
            },
        });
        console.info("Successfully saved Req"); // Log that it was successful


        const record =await PrismaClient.medReq.create({
            data: {
                dosage: sentData[1].dosage,
                medType: sentData[1].medType,
                numDoses: sentData[1].numDoses,
                genReqID: service.reqID,
                }
        });
        console.info("Successfully saved Med Req"); // Log that it was successful
        //sendback the id of the request
        console.info("HHH " +record.genReqID);
        res.send(record.genReqID);
    } catch (error) {
        // Log any failures
        console.error(`Unable to save Med Req`);
        res.sendStatus(400); // Send error
    }
});

//gets all requests from the database in the form of request objects
router.get("/medReq", async function (req: Request, res: Response) {
    try {
        //try to send all the nodes to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.send(await PrismaClient.medReq.findMany()); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you all of the medical requests\n");
    } catch (err) {
        console.error("\nUnable to send requests\n");
    }
});
router.get("/serviceReq", async function (req: Request, res: Response) {
    try {
        //try to send all the nodes to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.send(await PrismaClient.serviceRequest.findMany()); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you all of the requests\n");
    } catch (err) {
        console.error("\nUnable to send requests\n");
    }
});

export default router;
