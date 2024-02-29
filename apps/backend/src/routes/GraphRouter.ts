import express, {Request, Response, Router} from "express";
import {NodeDataBase, nodeDataBaseToNode} from "common/src/algorithms/DataBaseClasses/NodeDataBase.ts";
import {EdgeDataBase, edgeDataBasetoEdge} from "common/src/algorithms/DataBaseClasses/EdgeDataBase.ts";
import PrismaClient from "../bin/database-connection.ts";
import {Edge} from "common/src/algorithms/Graph/Edge.ts";
import {Graph} from "common/src/algorithms/Graph/Graph.ts";
import {Node, NodeType, NULLNODE} from "common/src/algorithms/Graph/Node.ts";
import {dijkstraFindClosestType} from "common/src/algorithms/Search/DijkstraFindClosestType.ts";


const router: Router = express.Router();

router.get("/ClosestType", async function (req: Request, res: Response) {
    const startNodeID: string = req.query.startNodeID as string;
    const targetType: NodeType = req.query.targetType as NodeType;

    const edgesDB = await PrismaClient.edgeDB.findMany() as EdgeDataBase[];
    const nodesDB = await PrismaClient.nodeDB.findMany() as NodeDataBase[];

    /* allocate some space for the nodes and edges */
    const edges: Array<Edge> = [];
    const nodes: Array<Node> = [];

    /* populate edges */
    edgesDB.forEach((edgeDB) => {
        edges.push(edgeDataBasetoEdge(edgeDB));
    });

    /* populate nodes */
    nodesDB.forEach((nodeDB) => {
        nodes.push(nodeDataBaseToNode(nodeDB));
    });

    /* construct a graph from the data */
    const graph = new Graph(nodes, edges);

    const startNode = graph.idToNode(startNodeID);
    //perfrom the Dystra search
    let result = dijkstraFindClosestType(startNode,targetType,graph);

    if(result==null){
        result=NULLNODE;
    }

    //get rid of result edges as it causes a circular return in json
    if(result!=NULLNODE){
        result.edges=[];
    }


    res.status(200).send(result);
});



export default router;
