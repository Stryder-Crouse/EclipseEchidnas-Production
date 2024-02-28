import express, {Router, Request, Response} from "express";
import {Edge} from "../../../../packages/common/src/algorithms/Graph/Edge.ts";
import {Node} from "common/src/algorithms/Graph/Node.ts";

import {
    NodeDataBase,
    nodeDataBaseToNode, nodeToNodeDataBase,

} from "../../../../packages/common/src/algorithms/DataBaseClasses/NodeDataBase.ts";
import {
    EdgeDataBase,
    edgeDataBasetoEdge, edgeToEdgeDataBase,

} from "../../../../packages/common/src/algorithms/DataBaseClasses/EdgeDataBase.ts";
import PrismaClient from "../bin/database-connection.ts";
import {Graph} from "../../../../packages/common/src/algorithms/Graph/Graph.ts";


import multer from "multer";
import {readEdgeCSV, readNodeCSV} from "../algorithms/readCSV.ts";
import fs from "fs";
// import {Employee} from "common/src/algorithms/Employee/Employee.ts";

// import fs from "fs";
// import * as path from "path";

const router: Router = express.Router();

const upload = multer({dest: 'uploadedCSVs/'});


//load recived cvs file into the database
router.route("/").post(upload.array("csv", 2), async function (req: Request, res: Response) {

    const nodeFile = req.files as Express.Multer.File[];

    if (req.files == null) {
        console.error("Bad");
        return;
    }
    const nodesString = fs.readFileSync(nodeFile[0].path, "utf-8");
    const edgeString = fs.readFileSync(nodeFile[1].path, "utf-8");
    console.log("DATA");
    console.log(nodesString);
    console.log("DATA 2");
    console.log(edgeString);

    const nodes: Array<Node> = readNodeCSV(nodesString);
    const edges: Array<Edge> = readEdgeCSV(edgeString);

    //convert to db node
    const edgeDBArray: EdgeDataBase[] = [];
    const nodeDBArray: NodeDataBase[] = [];

    edges.forEach((edge) => {
        const newEdgeDB = edgeToEdgeDataBase(edge);
        edgeDBArray.push(newEdgeDB);
    });

    nodes.forEach((node) => {
        const newNodeDB = nodeToNodeDataBase(node);
        nodeDBArray.push(newNodeDB);
    });

    try {
        //drop current node and edge table as well as all table
        //that rely on them e.g med request
        //empty out the Database
        await PrismaClient.$transaction([
            PrismaClient.edgeDB.deleteMany(),
            PrismaClient.medReq.deleteMany(),
            PrismaClient.sanReq.deleteMany(),
            PrismaClient.religiousReq.deleteMany(),
            PrismaClient.outsideTransport.deleteMany(),
            PrismaClient.flowReq.deleteMany(),
            PrismaClient.serviceRequest.deleteMany(),
            PrismaClient.nodeDB.deleteMany()
        ]);
        //add in all the Nodes and Edges that are in the sent above CSV file
        await PrismaClient.nodeDB.createMany({data: nodeDBArray});
        await PrismaClient.edgeDB.createMany({data: edgeDBArray});
        res.sendStatus(200);
    } catch (error) {
        console.error("could not add csv files to db");
        res.sendStatus(500); // and send 204
        return;
    }
});

//todo clean up -stryder
//remake database into two csv files and send it out
router.get("/", async function (req: Request, res: Response) {
    let nodesFileString = null;
    let edgeFileString = null;

    //get edges and node from database
    const nodesDB = (await PrismaClient.nodeDB.findMany({
        orderBy: {
            longName: "asc", //specify here that we are ordering the 'longName' field in ascending order (A->Z)
        },
    })) as NodeDataBase[];
    const edgesDB = (await PrismaClient.edgeDB.findMany()) as EdgeDataBase[];

    //convert to use string methiods change???
    const edges: Array<Edge> = [];
    const nodes: Array<Node> = [];

    edgesDB.forEach((edgeDB) => {
        edges.push(edgeDataBasetoEdge(edgeDB));
    });

    nodesDB.forEach((nodeDB) => {
        nodes.push(nodeDataBaseToNode(nodeDB));
    });

    const graph = new Graph(nodes, edges);

    nodesFileString = graph.nodesToString();
    edgeFileString = graph.edgesToString();
    //console.log("Node");
    //console.log(nodesFileString);
    //console.log("EDGE");
    //console.log(edgeFileString);
    try {
        res.status(200).send([nodesFileString, edgeFileString]);
    } catch (error) {
        console.error("could not export node and edge table data");
        res.sendStatus(500); // and send 204
        return;
    }
});


//Importing of Node CSV into DB is handled here

async function nodeHandleCSVImport(req: Request, res: Response): Promise<void> {

    console.log("Node post: Node CSV import requested");


    const nodeFile: Express.Multer.File[] = req.files as Express.Multer.File[];


    if (nodeFile == null) {
        console.error("Node File is Bad");
        res.status(500).send("Node CSV was null");
        return;
    }


    const nodeDataString: string = fs.readFileSync(nodeFile[0].path, "utf-8");

    /* turn the string into an array of employees */
    const nodeArray: Array<Node> = readNodeCSV(nodeDataString);


    const nodeDBArray: NodeDataBase[] = [];



    nodeArray.forEach((node) => {
        const newNodeDB = nodeToNodeDataBase(node);
        nodeDBArray.push(newNodeDB);
    });

    // console.log("Node only data");
    // console.log(nodeArray);

    try {
        /* DROP TABLE * */
        await PrismaClient.$transaction([
            PrismaClient.edgeDB.deleteMany(),
            PrismaClient.medReq.deleteMany(),
            PrismaClient.sanReq.deleteMany(),
            PrismaClient.religiousReq.deleteMany(),
            PrismaClient.outsideTransport.deleteMany(),
            PrismaClient.flowReq.deleteMany(),
            PrismaClient.serviceRequest.deleteMany(),
            PrismaClient.nodeDB.deleteMany(),
        ]);

        /* shove it into a clean prisma */
        await PrismaClient.nodeDB.createMany({data: nodeDBArray});
        console.log("Node successfully uploaded");
        res.sendStatus(200);
    } catch {
        console.error("Could not add Node CSV data to DB");
        res.sendStatus(500);
        return;
    }
}

router.route("/CSV-Import-Node").post(upload.array("csv", 1), nodeHandleCSVImport);








//Importing of Edge CSV into DB is handled here
async function edgeHandleCSVImport(req: Request, res: Response): Promise<void> {

    console.log("Edge post: Edge CSV import requested");


    const edgeFile: Express.Multer.File[] = req.files as Express.Multer.File[];


    if (edgeFile == null) {
        console.error("Edge File is Bad");
        res.status(500).send("Edge CSV was null");
        return;
    }


    const edgeDataString: string = fs.readFileSync(edgeFile[0].path, "utf-8");

    /* turn the string into an array of employees */
    const edgeArray: Array<Edge> = readEdgeCSV(edgeDataString);


    const edgeDBArray: EdgeDataBase[] = [];



    edgeArray.forEach((edge) => {
        const newEdgeDB = edgeToEdgeDataBase(edge);
        edgeDBArray.push(newEdgeDB);
    });

    // console.log("Edge only data");
    // console.log(edgeArray);

    try {
        /* DROP TABLE * */
        await PrismaClient.$transaction([
            PrismaClient.edgeDB.deleteMany()
        ]);

        /* shove it into a clean prisma */
        await PrismaClient.edgeDB.createMany({data: edgeDBArray});
        console.log("Edge successfully uploaded");
        res.sendStatus(200);
    } catch {
        console.error("Could not add Edge CSV data to DB");
        res.sendStatus(500);
        return;
    }
}


router.route("/CSV-Import-Edge").post(upload.array("csv", 1), edgeHandleCSVImport);

export default router;
