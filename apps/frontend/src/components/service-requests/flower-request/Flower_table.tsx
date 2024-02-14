
import {statusFilter} from "../serviceRequestInterface.ts";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {FlowReq,ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
// import Status from "../../../../../backend/src/algorithms/Requests/Status.ts";
// import {Employee} from "../../../../../backend/src/algorithms/Employee/Employee.ts";




    export default function Flower_table({statusFilter:statusFilter}:statusFilter) {
    console.log(statusFilter);


            const [flowerRequest, setFlowerRequest] =
                useState<Array<[FlowReq, ServiceRequest]>>([]);


            useEffect(() => {
                let queryDone = false;

                if (!queryDone) {
                    getflowerReq().then(result => {
                        setFlowerRequest(result);
                    });

                }
                return () => {
                    queryDone = true;
                };
            });

            // const [data, setData] = useState<{ flowReqs: FlowReq[]; serviceReqs: ServiceRequest[]; }>({flowReqs: [], serviceReqs: []});
            //
            // useEffect(() => {
            //     const fetchData = async () => {
            //         try {
            //             const response = await axios.get(`/api/serviceRequests/flowReq?status=${statusFilter}`);
            //             setData({
            //                 flowReqs: response.data[0],
            //                 serviceReqs: response.data[1],
            //             });
            //         } catch (error) {
            //             console.error("Error fetching requests");
            //         }
            //     };
            //
            //     fetchData();
            //
            // }, [statusFilter]); // Execute the effect whenever statusFilter changes

            return (
                <div>
                    <div>

                        <div className={"request-table-container"}>
                            <div className={"table-container"}>
            <span className={"caption-container"}>
              <span className={"table-title"}>Flower Requests </span>
            </span>
                                <div className={"table-wrapper"}>
                                    <table className={"requestTable"} id={"request-table"}>
                                        <thead>
                                        <tr>
                                            <th>Request Type</th>
                                            <th>Priority</th>
                                            <th>Sender</th>
                                            <th>Location</th>
                                            <th>Flower type</th>
                                            <th>Flower Quantity</th>
                                            <th>Flower Recepient</th>
                                            <th>Extra Info</th>
                                            <th>Status</th>
                                            <th>Message</th>
                                        </tr>
                                        </thead>
                                        {/* populating here */}
                                        <tbody>
                                        {
                                            //ids are startingNodeInput and endingNodeInput
                                            flowerRequest?.map((request) => {
                                                return (
                                                    <tr key={"Flow_" + request[0].genReqID}>
                                                        <td className={"node-id"}>{request[1].reqType}</td>
                                                        <td>{request[1].reqLocationID}</td>
                                                        <td>{request[0].flowType}</td>
                                                        <td>{request[0].sender}</td>
                                                        <td>{request[0].receiver}</td>
                                                        <td>{request[0].message}</td>
                                                        <td>{request[0].quantity.toString()}</td>
                                                        <td>{request[0].receiver}</td>
                                                    </tr>

                                                );
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        async function getflowerReq() {
            const requests = await axios.get<[FlowReq[], ServiceRequest[]]>("/api/serviceRequests/flowReq");

            const flowRequests: Array<[FlowReq, ServiceRequest]> = [];
            for (let i = 0; i < requests.data[0].length; i++) {
                flowRequests.push([requests.data[0][i], requests.data[1][i]]);

            }
            console.log(flowRequests);

            return flowRequests;

        }
