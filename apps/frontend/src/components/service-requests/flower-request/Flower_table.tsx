import React from "react";
//import axios from "axios";
import {statusFilter} from "../serviceRequestInterface.ts";

// async function populateRequests(){
//     try{
//         const response = await axios.get("/api/serviceRequests/flowReq)");
//         const [flowReqs, serviceReqs] = response.data;
//     }catch(error){
//         console.error("Error fetching requests");
//     }
// }


export default function Flower_table({statusFilter:statusFilter}:statusFilter) {
    console.log(statusFilter);

    return (
        <div >
            {/* make your table in here  */}
            Flower request table
        </div>
    );


}
