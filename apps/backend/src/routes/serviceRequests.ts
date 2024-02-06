import express, {Router, Request, Response} from "express";
//import { MedReq, Request } from "../algorithms/node.ts";
import PrismaClient from "../bin/database-connection.ts";
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
    const medReq1 = req.body;
    console.info(medReq1);
    console.info(req.body.genReqID);
    console.info("This is the Med Req");
    //sets every part of node to whatever was entered while running (not during compile - point of promise/await)
    try {
        await PrismaClient.medReq.create({
            data: {
                dosage: req.body.dosage,
                medType: req.body.medType,
                numDoses: req.body.numDoses,
                genReqID: 0,
                }
        });
        console.info("Successfully saved Med Req"); // Log that it was successful
    } catch (error) {
        // Log any failures
        console.error(`Unable to save Med Req`);
        res.sendStatus(400); // Send error
    }
});
router.post("/serviceReq", async function (req: Request, res: Response) {

    console.log(req.body);

    /*let assignedUName : string = "No one";
    if(req.body.assignedUName != null && !req.body.assignedUName.equals("") && !req.body.assignedUName.equals("No one")){
        assignedUName = req.body.assignedUName;
    }*/

    //sets every part of node to whatever was entered while running (not during compile - point of promise/await)
    try {
        await PrismaClient.serviceRequest.create({
            data: {
                //ID is auto created
                reqType: req.body.reqType,
                //connect the Node field using the node id as a foreign key
                reqLocation: {
                    connect : {
                        nodeID: req.body.reqLocationID
                    }
                },
                extraInfo: req.body.extraInfo,
                status: req.body.status,
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
        res.sendStatus(200);


    } catch (error) {
        // Log any failures
        console.error(`Unable to save Req` + error);
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
