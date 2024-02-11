import React from "react";
import {statusFilter} from "../serviceRequestInterface.ts";
import {useState, useEffect} from "react";
import {OutsideTransport} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import axios from "axios";

//todo BNBN Adapt this page get and post requests to the project, also had to add placeholders for some data,
// see below listed as **Field Name** in table call

async function getReqs() {
    const res = await axios.get("api/serviceRequest/outsideTransport");
    return res.data;
}

export default function Transportation_table({statusFilter:statusFilter}:statusFilter) {
    console.log(statusFilter);

    const [reqList, setReqList] = useState<OutsideTransport[]>([]);

    useEffect(() => {
        let queryDone = false;

        if (!queryDone) {
            getReqs().then(result => {
                setReqList(result);
            });
        }
        return () => {
            queryDone = true;
        };
    });

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Request Type:</th>
                    <th>Priority Level:</th>
                    <th>Status:</th>
                    <th>Patient Name:</th>
                    <th>Patient Room:</th>
                    <th>Destination:</th>
                    <th>Mode of Transportation</th>
                    <th>Additional Notes:</th>
                </tr>
                </thead>
                <tbody>
                {reqList?.map((request, requestIndex) => {
                    return (
                        <tr key={"Req_" + requestIndex}>
                            <td>Outside Transport</td>
                            <td>**Priority Level**</td>
                            <td>**Status**</td>
                            <td>{request.patientName}</td>
                            <td>**Patient Room**</td>
                            <td>{request.destination}</td>
                            <td>{request.modeOfTransport}</td>
                            <td>**Additional Notes**</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );


}
