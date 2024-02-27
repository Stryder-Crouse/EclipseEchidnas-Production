import express, {Request, Response, Router} from "express";
// import PrismaClient from "../bin/database-connection.ts";
// import axios from "axios";

import {ManagementClient} from "auth0";
// import {params} from "http-errors";


const router: Router = express.Router();

const auth0 = new ManagementClient({
    domain: 'dev-w3apfgzf8dmf8bgm.us.auth0.com',
    clientId: 'iGb2hrQNGmRDlIeWtp1su1FyxEESYIaQ',
    clientSecret: 'X6dJjiFvyKGEpv0Wf32eRZp7wHclLhdDWC_qgt6URftYjvVagJ1fDzLL5foEz9hh',
});


router.get("/", async function (req: Request, res: Response) {
    const userID: string = req.query.userID as string;
    console.log("UName: " + userID);

    await auth0.users.delete({id: userID}).then((authRes)=>{ console.log(authRes.data); });

    res.sendStatus(200);
});



export default router;
