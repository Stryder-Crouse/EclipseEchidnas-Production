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


// // Whenever a get request is made to /CSVnode, send back the data from the node file.
// router.get("/CSVnode", async function (req: Request, res: Response) {
//   let allNodesString = null;
//   try {
//     //calculate file location
//     const csvLocation = path.resolve(__dirname, "../../resources/L1Nodes.csv");
//     //read file into string
//     allNodesString = fs.readFileSync(csvLocation, "utf-8");
//   } catch (error) {
//     console.error("CSV node file not found");
//     res.status(204); // and send 204
//     return;
//   }
//   //send file data if no errors
//   res.status(200).send(allNodesString);
// });
//
// // Whenever a get request is made to /CSVedge, send back the data from the edge file.
// router.get("/CSVedge", async function (req: Request, res: Response) {
//   let allEdgeString = null;
//   try {
//     //calculate file location
//     const csvLocation = path.resolve(__dirname, "../../resources/L1Edges.csv");
//     //read file into string
//     allEdgeString = fs.readFileSync(csvLocation, "utf-8");
//   } catch (error) {
//     console.error("CSV edge file not found");
//     res.status(204); // and send 204
//     return;
//   }
//
//   res.status(200).send(allEdgeString);
// });

export default router;
