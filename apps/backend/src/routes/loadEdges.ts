// import express, { Router, Request, Response } from "express";
// import { Edge } from "../algorithms/Graph/Edge.ts";
// import { readEdgeCSV } from "../algorithms/readCSV.ts";
// import PrismaClient from "../bin/database-connection.ts"; //may also be wrong
// import path from "path";
// import fs from "fs";
//
// const router: Router = express.Router();
//
// router.post("/", async function (req: Request, res: Response) {
//   //posting to the website from the website (localhost to localhost LOL)
//   let allEdgeString = "";
//
//   //EDGES
//
//   try {
//     const edgeCsvLocation = path.resolve(
//       __dirname,
//       "../../resources/L1Edges.csv",
//     );
//     allEdgeString = fs.readFileSync(edgeCsvLocation, "utf-8");
//   } catch (error) {
//     console.error("CVS edge file not found");
//     res.status(204); // and send 204
//     return;
//   }
//   const edgeArray: Edge[] = readEdgeCSV(allEdgeString);
//
//   await Promise.all(
//     edgeArray.map(async (edgeData) => {
//       try {
//         // Attempt to create in the database
//         await PrismaClient.edgeDB.create({
//           // .edge comes from the "Model node" we created in the schema.prisma file
//           data: {
//             edgeID: edgeData.id,
//             startNode: {
//               connect: { nodeID: edgeData.startNode.id },
//             },
//             endNode: {
//               connect: { nodeID: edgeData.endNode.id },
//             },
//           },
//         }); //this line should be changed, also
//         console.info("Successfully saved edge"); // Log that it was successful
//       } catch (error) {
//         // Log any failures
//         console.error(`Unable to save edge ${edgeData.id}: ${error}`);
//         res.sendStatus(400); // Send error
//         return; // Don't try to send duplicate statuses
//       }
//     }),
//   );
// });
//
// router.get("/", async function (req: Request, res: Response) {
//   try {
//     //try to send all the edges to the client
//     res.send(await PrismaClient.edgeDB.findMany());
//     //This is just for debugging and sends a message to the console
//     console.info("\n\n\n\n\n\nSuccessfully gave you the edges\n\n\n\n\n\n");
//   } catch (err) {
//     //this sends an error message to the server's console, which is viewable
//     // by going to the 'inspect' tab on the website
//     console.error("\n\n\n\n\n\nUnable to send Edges\n\n\n\n\n\n");
//   }
// });
//
// export default router;
