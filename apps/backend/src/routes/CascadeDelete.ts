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


router.post("/", async function (req: Request, res: Response) {
    const username = req.query.username as string;
    console.log("UName: " + username);

    await auth0.users.delete({id: "auth0|65d66bda0177410b09a14e3c"}).then((authRes)=>{ console.log(authRes.data); });

    res.send(200);

    // const initialInfo: string = "https://dev-hca27okc2srfyen8.us.auth0.com/api/v2/auth0|65d66bda0177410b09a14e3c";
    // //initialInfo += data[0];
    // let accessToken = await getAccessTokenSilently({
    //     authorizationParams: {
    //         audience: "https://dev-hca27okc2srfyen8.us.auth0.com/api/v2/",
    //         scope: "read:current_users",
    //     }
    // });
    //
    // console.log("User: " + user!.sub);
    //
    // const userDetails = `https://dev-hca27okc2srfyen8.us.auth0.com/api/v2/users/${user!.sub}`;
    //
    // console.log("User Details:" + userDetails);
    //
    // const response = await fetch(userDetails, {
    //     headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //     }
    // });
    //
    // console.log((await response.json()));
    //
    //
    // try
    // {
    //     const config = {
    //         method: 'delete',
    //         maxBodyLength: Infinity,
    //         url: initialInfo,
    //         headers: {
    //             "authorization": "Bearer TOKEN"
    //         }
    //     };
    //
    //     axios.request(config).then((response) => {
    //         console.log("Response from Auth0 deleting" + JSON.stringify(response.data));
    //     });
    // } catch {
    //     console.log("Error with deleting from Auth0");
    // }
});



export default router;
