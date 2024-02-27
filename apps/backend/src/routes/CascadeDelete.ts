import express, {Request, Response, Router} from "express";
// import PrismaClient from "../bin/database-connection.ts";
// import axios from "axios";

import {ManagementClient} from "auth0";
// import {params} from "http-errors";


const router: Router = express.Router();

const auth0 = new ManagementClient({
    domain: 'dev-hca27okc2srfyen8.us.auth0.com',
    clientId: 'sjOBn2g3OxSS11LMuXopKBZ4mao8drry',
    clientSecret: 'B0rX2U4tbxl9fO_SNNfgOgQxo9lrqGd2ti2CPqNwUxUxcMESdONNeZcK52Ec4g4d',
});


router.get("/", async function (req: Request, res: Response) {
    const userID: string = req.query.userID as string;
    console.log("UName: " + userID);

    await auth0.users.delete({id: userID}).then((authRes)=>{ console.log(authRes.data); });

    res.sendStatus(200);
});



export default router;
