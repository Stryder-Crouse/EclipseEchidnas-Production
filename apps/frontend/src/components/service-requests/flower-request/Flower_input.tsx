import React from "react";
// import axios from "axios";
// import {FlowReq, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";

// async function submit(){
//     const serviceRequest: ServiceRequest = {
//         reqType: ,
//         reqLocationID: ,
//         extraInfo:  ,
//         status:  ,
//         assignedUName:  ,
//         reqPriority:  ,
//         reqID: ,
//     };
//
//     const flowerRequest: FlowReq = {
//         flowType: ,
//         quantity: ,
//         sender: ,
//         receiver: ,
//         message: ,
//         genReqID: ,
//     };
//
//     const sendInfo = {serviceRequest,flowerRequest};
//
//     try{
//         await axios.post(
//             "/api/serviceRequests/flowReq",
//             sendInfo,
//             {
//                 headers: {
//                     "Content-Type":
//                     "application/json",
//                 },
//             },
//         );
//     } catch(error){
//         throw new Error("Error with sending flower request");
//     }
// }


export default function Flower_input() {


    return (
        <div>
            {/* make your input form in here  */}
            Flower request input form HELLOOO

            <div className={"flex justify-center items-center my-1.5"}>
                <p>Created By: Shiivek and Szymon</p>
            </div>
        </div>
    );


}
