import React, {useEffect, useState} from "react";
import axios from "axios";
import {sanReq, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import {statusFilter} from "../serviceRequestInterface.ts";
import {Employee} from "../../../../../backend/src/algorithms/Employee/Employee.ts";
import Status from "../../../../../backend/src/algorithms/Requests/Status.ts";


export default function Sanitation_table({statusFilter:statusFilter}:statusFilter) {
    console.log(statusFilter);

    const [sanRequestList, setSanRequestList] =
        useState<Array<[sanReq,ServiceRequest]>>([]);
    const [sanEmployees, setSanEmployees] =
        useState<Employee[]>([]);

    useEffect(()=>{
        let queryDone = false;

        if (!queryDone) {
            getEmployees().then(result=> {
                setSanEmployees(result);
            });
            getSanRequests(statusFilter).then(result=> {
                setSanRequestList(result);
            });

        }
        return ()=>{
            queryDone = true;
        };


    },[statusFilter]);

    return (
        <div>

            <table className={"requestTable"} id={"request-table"}>
                <thead>
                <tr className={"tableTRHead"}>
                    <th className={"tableTD"}>ID</th>
                    <th className={"tableTD"}>Request Type</th>
                    <th className={"tableTD"}>Priority</th>
                    <th className={"tableTD"}>Going To</th>
                    <th className={"tableTD"}>Why</th>
                    <th className={"tableTD"}>Status</th>
                    <th className={"tableTD"}>Employee</th>
                </tr>
                </thead>
                {/* populating here */}
                <tbody>
                {
                    //ids are startingNodeInput and endingNodeInput
                    sanRequestList?.map((request, requestIndex) => {
                        return (
                            <tr className={"tableTR"} key={"San_" + request[0].serviceReqID}>
                                <td className={"tableTD"}>{request[1].reqID}</td>
                                <td className={"tableTD"}>{request[1].reqType}</td>
                                <td className={"tableTD"}>
                                    <select
                                        value={request[1].reqPriority}
                                        id={"priorityDropdown" + request[1].reqID}
                                        onChange={
                                            (event) => {
                                                const eventHTML = event.target as HTMLSelectElement;
                                                onPriorityChange(eventHTML, requestIndex).then();
                                            }
                                        }
                                    >
                                        <option className={"priorityDropdown"} value="Low">Low</option>
                                        <option className={"priorityDropdown"} value="Medium">Medium
                                        </option>
                                        <option className={"priorityDropdown"} value="High">High</option>
                                        <option className={"priorityDropdown"} value="Emergency">Emergency
                                        </option>
                                    </select>
                                </td>
                                <td className={"tableTD"}>{request[1].reqLocationID}</td>
                                <td className={"tableTD"}>{request[0].type}</td>
                                <td className={"tableTD"}>
                                    <select
                                        value={request[1].status}
                                        id={"sanStatusDropdown" + request[1].reqID}
                                        onChange={
                                            (event) => {
                                                const eventHTML = event.target as HTMLSelectElement;
                                                onStatusChange(eventHTML, requestIndex).then();
                                            }
                                        }
                                    >
                                        <option className={"status-dropdown"}
                                                value="Unassigned">Unassigned
                                        </option>
                                        <option className={"status-dropdown"} value="Assigned">Assigned
                                        </option>
                                        <option className={"status-dropdown"} value="In Progress">In
                                            Progress
                                        </option>
                                        <option className={"status-dropdown"} value="Completed">Completed
                                        </option>
                                    </select>
                                </td>
                                <td className={"tableTD"}>
                                    <select
                                        value={request[1].assignedUName}
                                        onChange={
                                            (event) => {

                                                const eventHTML = event.target as HTMLSelectElement;
                                                onEmployeeChange(eventHTML, requestIndex).then();
                                            }
                                        }
                                    >
                                        {
                                            sanEmployees?.map((employee) => {
                                                console.log("request Index: " + requestIndex);
                                                console.log(request[0]);
                                                return renderEmployees(employee, request[0].serviceReqID.toString());
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>

                        );
                    })
                }
                </tbody>
            </table>
        </div>
    );

    function renderEmployees(employee: Employee, sanID: string) {
        return (
            <option
                className={"status-dropdown"}
                value={employee.userName}
                key={sanID + employee.userName}
            >
                {(employee.firstName + " "
                    + employee.lastName
                    + " (" + employee.designation + ")")}
            </option>
        );
    }

    async function onEmployeeChange(select: HTMLSelectElement, requestIndex: number) {


        const sanRequests = [...sanRequestList]; //make a copy of the array to update
        const thisRequest = sanRequests?.at(requestIndex);//use the copy to make changes

        if (thisRequest == undefined) {
            console.error("request not found from requesst index ");
            return;
        }

        if (select == null) {
            console.error("could not find request dropdown for request " + thisRequest[1].reqID);
            return;
        }


        if (select.value != "No one") {
            //change record to assigned
            thisRequest[1].status = Status.Assigned;
            //change employee to the new employee
            thisRequest[1].assignedUName = select.value;
            //database

            //set new record list to re render and update (MAKE SURE BEFORE POST REQUST)
            console.log("hello");
            setSanRequestList(sanRequests);

            try {
                await axios.post("/api/serviceRequests/changeUser",
                    {reqID: thisRequest[1].reqID, newAssignedUser: select.value as string, status: "Assigned"}, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });


            } catch (e) {
                console.error("failed to change user" + e);
            }


        } else {
            //change record to assigned
            thisRequest[1].status = Status.Unassigned;
            //change employee to the new employee
            thisRequest[1].assignedUName = select.value;

            //set new record list to re render and update
            console.log("hello2");
            setSanRequestList(sanRequests);

            try {
                await axios.post("/api/serviceRequests/changeUser",
                    {reqID: thisRequest[1].reqID, newAssignedUser: select.value as string, status: "Unassigned"}, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

            } catch (e) {
                console.error("faild to change user " + e);
            }
        }
        console.log("EE " + select.value);
    }

    async function onStatusChange(select: HTMLSelectElement, requestIndex: number) {

        const sanRequests = [...sanRequestList]; //make a copy of the array to update
        const thisRequest = sanRequests?.at(requestIndex);//use the copy to make changes
        if (thisRequest == undefined) {
            console.error("request not found from requesst index ");
            return;
        }

        //CHANGE
        if (thisRequest[1].assignedUName != "No one") {

            if (select == null) {
                console.error("could not find request dropdown for request " + thisRequest[1].reqID);
                return;
            }
            console.log("XD " + select.value);
            if (select.value == "Unassigned") {

                console.error("you cannot change the status of an assigned request to unassigned " + thisRequest[1].reqID);
                return;

            }

            //assign new status
            thisRequest[1].status = select.value;

            //set new record list to re render and update
            console.log("hello2");
            setSanRequestList(sanRequests);

            //database
            try {
                await axios.post("/api/serviceRequests/changeState",
                    {reqID: thisRequest[1].reqID, newState: select.value as string}, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
            } catch (e) {
                console.error("failed to change state");
            }
        } else {
            console.error("you cannot change the status of an unassigned request");
        }
    }

    async function onPriorityChange(select: HTMLSelectElement, requestIndex: number) {
        const sanRequests = [...sanRequestList]; //make a copy of the array to update
        const thisRequest = sanRequests?.at(requestIndex);//use the copy to make changes

        console.log("sanRequests: " + sanRequests);
        console.log("thisRequest" + thisRequest);

        if (thisRequest == undefined) {
            console.error("request not found from request index ");
            return;
        }

        if (select == null) {
            console.error("could not find request dropdown for request " + thisRequest[1].reqID);
            return;
        }

        //assign new status
        thisRequest[1].reqPriority = select.value;
        console.log("New Status: " + select.value);

        setSanRequestList(sanRequests);

        //update data in the DB
        try {
            await axios.post("/api/serviceRequests/changePriority",
                {reqID: thisRequest[1].reqID, newPriority: select.value as string}, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
        } catch {
            console.error("Failed to Change the Priority");
        }
    }

}

async function getSanRequests(statusFilter:Status) {
    const requests =
        await axios.get<[sanReq[], ServiceRequest[]]>("/api/serviceRequests/sanReq", {params: {status: statusFilter}});

    const sanRequests: Array<[sanReq, ServiceRequest]> = [];
    for (let i = 0; i < requests.data[0].length; i++) {
        sanRequests.push([requests.data[0][i], requests.data[1][i]]);

    }
    console.log("HI,HI");
    console.log(sanRequests);

    return sanRequests;

}

async function getEmployees() {
    const employees = await axios.get<Employee[]>("/api/employees/employees/med");
    return employees.data;
}
