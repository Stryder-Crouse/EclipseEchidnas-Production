import {statusFilter} from "../serviceRequestInterface.ts";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {FlowReq, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import status from "../../../../../backend/src/algorithms/Requests/Status.ts";
// import Status from "../../../../../backend/src/algorithms/Requests/Status.ts";
// import {Employee} from "../../../../../backend/src/algorithms/Employee/Employee.ts";


export default function Flower_table({statusFilter: statusFilter}: statusFilter) {
    console.log(statusFilter);


    const [flowerRequest, setFlowerRequest] =
        useState<Array<[FlowReq, ServiceRequest]>>([]);


    useEffect(() => {
        console.log("hello");
        getflowerReq(statusFilter).then(result => {
            console.log("hello");
            setFlowerRequest(result);
        });
    },[statusFilter]);


    return (
        <div>

            <table className={"requestTable"} id={"request-table"}>
                <thead>
                <tr className={"tableTRHead"}>
                    <th className={"tableTD"}>Request Type</th>
                    <th className={"tableTD"}>Priority</th>
                    <th className={"tableTD"}>Sender</th>
                    <th className={"tableTD"}>Location</th>
                    <th className={"tableTD"}>Flower type</th>
                    <th className={"tableTD"}>Flower Quantity</th>
                    <th className={"tableTD"}>Flower Recepient</th>
                    <th className={"tableTD"}>Extra Info</th>
                    <th className={"tableTD"}>Status</th>
                    <th className={"tableTD"}>Message</th>
                </tr>
                </thead>
                {/* populating here */}
                <tbody>
                {
                    //ids are startingNodeInput and endingNodeInput

                    flowerRequest?.map((request) => {
                        return (
                            <tr className={"tableTR"} key={"Flow_" + request[0].genReqID}>
                                <td className={"tableTD"}>{request[1].reqType}</td>
                                <td className={"tableTD"}>{request[1].reqLocationID}</td>
                                <td className={"tableTD"}>{request[0].flowType}</td>
                                <td className={"tableTD"}>{request[0].sender}</td>
                                <td className={"tableTD"}>{request[0].receiver}</td>
                                <td className={"tableTD"}>{request[0].message}</td>
                                <td className={"tableTD"}>{request[0].quantity.toString()}</td>
                                <td className={"tableTD"}>{request[0].receiver}</td>
                            </tr>

                        );
                    })
                }
                </tbody>
            </table>


        </div>
    );
}

async function getflowerReq(statusFilter:status) {
    const requests = await axios.get<[FlowReq[], ServiceRequest[]]>("/api/serviceRequests/flowReq",
        {params: {status: statusFilter}});

    const flowRequests: Array<[FlowReq, ServiceRequest]> = [];
    for (let i = 0; i < requests.data[0].length; i++) {
        flowRequests.push([requests.data[0][i], requests.data[1][i]]);

    }
    console.log("flow");
    console.log(flowRequests);

    return flowRequests;

}
