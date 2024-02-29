import express, {Request, Response, Router} from "express";
//import { Prisma } from "database"; //may be very wrong
import PrismaClient from "../bin/database-connection.ts";
import {floorToString, NodeType} from "common/src/algorithms/Graph/Node.ts"; //may also be wrong

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {

    try {
        //try to send all the nodes to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.status(200).send(
            await PrismaClient.nodeDB.findMany({
                orderBy: {
                    longName: "asc", //specify here that we are ordering the 'longName' field in ascending order (A->Z)
                },
                where: {
                    NOT: {
                        nodeType: NodeType.HALL
                    }
                }

            }),
        ); //end res.send (this is what will be sent to the client)
        console.info("Successfully gave you the nodes");
    } catch (err) {
        res.sendStatus(500);
        console.error("Unable to send Nodes");
    }
});

router.get("/byID", async function (req: Request, res: Response) {


    try {
        //try to send all the nodes to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.status(200).send(
            await PrismaClient.nodeDB.findMany({
                orderBy: {
                    nodeID: "asc", //specify here that we are ordering the 'longName' field in ascending order (A->Z)
                },
                where: {
                    NOT: {
                        nodeType: NodeType.HALL
                    }
                }

            }),
        ); //end res.send (this is what will be sent to the client)
        console.info("Successfully gave you the nodes");
    } catch (err) {
        res.sendStatus(500);
        console.error("Unable to send Nodes");
    }
});

router.get("/all", async function (req: Request, res: Response) {


    try {
        //try to send all the nodes to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.status(200).send(
            await PrismaClient.nodeDB.findMany({
                orderBy: {
                    longName: "asc", //specify here that we are ordering the 'longName' field in ascending order (A->Z)
                },


            }),
        ); //end res.send (this is what will be sent to the client)
        console.info("Successfully gave you the nodes");
    } catch (err) {
        res.sendStatus(500);
        console.error("Unable to send Nodes");
    }
});


router.get("/floor", async function (req: Request, res: Response) {
    const floor = floorToString(parseInt(req.query.floor as string));
    console.log("querying for node on floor " + floor);


    try {
        //try to send all the nodes to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.status(200).send(
            await PrismaClient.nodeDB.findMany({
                orderBy: {
                    longName: "asc", //specify here that we are ordering the 'longName' field in ascending order (A->Z)
                },
                where: {
                    floor: floor,
                    NOT: {
                        nodeType: NodeType.HALL
                    }

                },
            }),
        ); //end res.send (this is what will be sent to the client)
        console.info("Successfully gave you the nodes");
    } catch (err) {
        res.sendStatus(500);
        console.error("Unable to send Nodes");
    }
});

router.get("/floorWithHalls", async function (req: Request, res: Response) {
    const floor = floorToString(parseInt(req.query.floor as string));
    console.log("querying for node on floor " + floor);

    try {
        //try to send all the nodes to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.status(200).send(
            await PrismaClient.nodeDB.findMany({
                orderBy: {
                    longName: "asc", //specify here that we are ordering the 'longName' field in ascending order (A->Z)
                },
                where: {
                    floor: floor,
                },
            }),
        ); //end res.send (this is what will be sent to the client)
        console.info("Successfully gave you the nodes");
    } catch (err) {
        res.sendStatus(500);
        console.error("Unable to send Nodes");
    }
});

export default router;
