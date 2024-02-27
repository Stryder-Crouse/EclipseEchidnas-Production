import React, {useEffect, useState} from "react";
import "../../../css/component-css/ServiceRequestTable.css";
import Status from "../../../../../../packages/common/src/algorithms/Requests/Status.ts";
import {Priorities, ServiceRequest} from "common/src/algorithms/Requests/Request.ts";
import axios from "axios";
import {requestFilters} from "../serviceRequestInterface.ts";


//todo FNFN statistics get for AJ
//const stats = await axios.get("/api/serviceRequests/serviceReq/statistics");
// stats.data.total is num of service requests
// stats.data.medReq is num of med requests
// stats.data.religReq is num of relig req
// stats.data.flowReq is num of flow req
// stats.data.sanReq is num of san req
// stats.data.tranReq is number tran req
// stats.data.lowPrio is number of low prio
// stats.data.medPrio is num of med prio
// stats.data.highPrio num of high prio
// stats.data.emergPrio num of emergency prio
// stats.data.unassigned num of unassigned
// stats.data.assigned num of assigned
// stats.data.inProgress num of in progress
// stats.data.completed num of completed



export default function ServiceRequest_Table_Protected({statusFilter, priorityFilter, employeeFilter, locationFilter}:requestFilters) {
    console.log(priorityFilter);

    //set the variable serviceRequests to the value returned when setServiceRequests is called
    const [serviceRequests, setServiceRequests]
        = useState<ServiceRequest[]>([]);



    //will rerun every single time statusFilter is changed (updates table for new entries)
    useEffect(() => {
        //fetches servReqs from the db to update the frontend table
        getServiceRequest(statusFilter, priorityFilter, employeeFilter, locationFilter).then((result) => {
            setServiceRequests(result);
        });

    }, [employeeFilter, locationFilter, priorityFilter, statusFilter]);


    //make table of Service Requests
    return (
        <div className={"h-100 w-[42.5rem] overflow-auto rounded-xl"}>

            {/* make your table in here  */}
            <table className={"medTable overflow-y-scroll"}>
                <thead>
                <tr className={"tableTRHead"}>
                    <th className={"tableTD"}>ID</th>
                    <th className={"tableTD"}>Type</th>
                    <th className={"tableTD"}>Status</th>
                    <th className={"tableTD"}>Priority</th>
                    <th className={"tableTD"}>Employee Assigned</th>
                    <th className={"tableTD"}>Location ID</th>
                    <th className={"tableTD"}>Extra Notes</th>
                </tr>
                </thead>
                <tbody>
                {/*populate the table with records in the medRequests useState*/}
                {
                    //make a new array where all the service request values are on the table (array of html to be rendered)
                    serviceRequests.map((request, requestIndex) => {
                        return (
                            <tr className={"tableTR"}>
                                <td className={"tableTD"}>{request.reqID}</td>
                                <td className={"tableTD"}>{request.reqType}</td>
                                <td className={"tableTD"}>
                                    <select
                                        className={""}
                                        value={request.status}
                                        id={"medStatusDropdown" + request.reqID}
                                        onChange={
                                            (event) => {
                                                const eventHTML = event.target as HTMLSelectElement;
                                                onStatusChange(eventHTML, requestIndex).then();
                                            }
                                        }
                                    >
                                        <option className={"status-dropdown"} unselectable={"on"}
                                                value="Unassigned">Unassigned
                                        </option>
                                        <option className={"status-dropdown"} value="Assigned">Assigned</option>
                                        <option className={"status-dropdown"} value="In Progress">In Progress</option>
                                        <option className={"status-dropdown"} value="Completed">Completed</option>
                                    </select>
                                </td>
                                <td className={"tableTD"}>{request.reqPriority}</td>
                                <td className={"tableTD"}>{request.assignedUName}</td>
                                <td className={"tableTD"}>{request.reqLocationID}</td>
                                <td className={"tableTD"}>{request.extraInfo}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        </div>
    );


    async function onStatusChange(select: HTMLSelectElement, requestIndex: number) {

        const requests = [...serviceRequests]; //make a copy of the array to update
        const thisRequest = serviceRequests?.at(requestIndex);//use the copy to make changes
        if (thisRequest == undefined) {
            console.error("request not found from requesst index ");
            return;
        }

        //CHANGE
        if (thisRequest.assignedUName != "No one") {

            if (select == null) {
                console.error("could not find request dropdown for request " + thisRequest.reqID);
                return;
            }
            console.log("XD " + select.value);
            if (select.value == "Unassigned") {

                //todo show visual error
                console.error("you cannot change the status of an assigned request to unassigned " + thisRequest.reqID);
                return;

            }

            //assign new status
            thisRequest.status = select.value;

            //set new record list to re render and update
            console.log("hello2");
            setServiceRequests(requests);

            //database
            try {
                await axios.post("/api/serviceRequests/changeState",
                    {reqID: thisRequest.reqID, newState: select.value as string}, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
            } catch (e) {
                console.error("faild to change state");
            }


        } else {


            //todo visual error
            console.error("you cannot change the status of an unassigned request");
        }


    }
}

//query the Database for all service requests that fit the current filter (filter can be empty)
async function getServiceRequest(statusFilter:Status, priorityFilter:Priorities, employeeFilter:string, locationFilter:string) {
    const serviceRequest =
        await axios.get<ServiceRequest[]>("/api/serviceRequests/serviceReq/filter", {params: {status: statusFilter, priority: priorityFilter,
                employee:employeeFilter, location:locationFilter
            } });
    // console.log("sss");
    // console.log(serviceRequest.data);
    return serviceRequest.data;
}
