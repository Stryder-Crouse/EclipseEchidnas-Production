import React, {useEffect, useState} from "react";
import axios from "axios";
import {MedReq, Priorities, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import {Employee} from "../../../../../backend/src/algorithms/Employee/Employee.ts";
import Status from "../../../../../backend/src/algorithms/Requests/Status.ts";
import {requestFilters} from "../serviceRequestInterface.ts";


export default function Medicine_table({statusFilter, priorityFilter}:requestFilters) {
    console.log(statusFilter);

    const [medRequestList, setMedRequestList] =
        useState<Array<[MedReq, ServiceRequest]>>([]);
    const [medEmployees, setMedEmployees] =
        useState<Employee[]>([]);


    //todo FNFN fix with proper population code
    useEffect(() => {



            getEmployees().then(result => {
                setMedEmployees(result);
            });
            getMedRequests(statusFilter, priorityFilter).then(result => {
                setMedRequestList(result);
            });




    }, [statusFilter, priorityFilter]);

    return (
        <div>

                        <table className={"requestTable"} id={"request-table"}>
                            <thead>
                            <tr className={"tableTRHead"}>
                                <th className={"tableTD"}>Request Type</th>
                                <th className={"tableTD"}>Priority</th>
                                <th className={"tableTD"}>Going To</th>
                                <th className={"tableTD"}>Medicine type</th>
                                <th className={"tableTD"}>Dosage</th>
                                <th className={"tableTD"}>Amount</th>
                                <th className={"tableTD"}>Status</th>
                                <th className={"tableTD"}>Employee</th>
                            </tr>
                            </thead>
                            {/* populating here */}
                            <tbody>
                            {
                                //ids are startingNodeInput and endingNodeInput
                                medRequestList?.map((request, requestIndex) => {
                                    return (
                                        <tr className={"tableTR"} key={"Med_" + request[0].genReqID}>
                                            <td className={"tableTD"} >{request[1].reqType}</td>
                                            <td className={"tableTD"}>
                                                <select
                                                    value={request[1].reqPriority}
                                                    id={"priorityDropdown" + request[1].reqID}
                                                    onChange={
                                                        (event) => {
                                                            const eventHTML = event.target as HTMLSelectElement;
                                                            onPriorityChange(eventHTML, requestIndex).then();/////todo RYAN (uncomment when done with function)
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
                                            <td className={"tableTD"}>{request[0].medName}</td>
                                            <td className={"tableTD"}>{request[0].medStrength}</td>
                                            <td className={"tableTD"}>{request[0].quantity.toString()}</td>
                                            <td className={"tableTD"}>
                                                <select
                                                    value={request[1].status}
                                                    id={"medStatusDropdown" + request[1].reqID}
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
                                                        medEmployees?.map((employee) =>
                                                            renderEmployees(employee, request[0].genReqID.toString()))
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

    function renderEmployees(employee: Employee, medID: string) {
        return (
            <option

                className={"status-dropdown"}
                value={employee.userName}
                key={medID + employee.userName}
            >
                {(employee.firstName + " "
                    + employee.lastName
                    + " (" + employee.designation + ")")}
            </option>
        );
    }

    async function onEmployeeChange(select: HTMLSelectElement, requestIndex: number) {


        const medRequests = [...medRequestList]; //make a copy of the array to update
        const thisRequest = medRequests?.at(requestIndex);//use the copy to make changes

        if (thisRequest == undefined) {
            console.error("request not found from request index ");
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

            //set new record list to re-render and update (MAKE SURE BEFORE POST REQUEST)
            console.log("hello");
            setMedRequestList(medRequests);

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

            //set new record list to re-render and update
            console.log("hello2");
            setMedRequestList(medRequests);

            try {
                await axios.post("/api/serviceRequests/changeUser",
                    {reqID: thisRequest[1].reqID, newAssignedUser: select.value as string, status: "Unassigned"}, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

            } catch (e) {
                console.error("failed to change user " + e);
            }
        }

        console.log("EE " + select.value);


    }

    async function onStatusChange(select: HTMLSelectElement, requestIndex: number) {

        const medRequests = [...medRequestList]; //make a copy of the array to update
        const thisRequest = medRequests?.at(requestIndex);//use the copy to make changes
        if (thisRequest == undefined) {
            console.error("request not found from request index ");
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

                //todo show visual error
                console.error("you cannot change the status of an assigned request to unassigned " + thisRequest[1].reqID);
                return;

            }

            //assign new status
            thisRequest[1].status = select.value;

            //set new record list to re-render and update
            console.log("hello2");
            setMedRequestList(medRequests);

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

            //todo visual error
            console.error("you cannot change the status of an unassigned request");
        }


    }

    async function onPriorityChange(select: HTMLSelectElement, requestIndex: number) {
        const medRequests = [...medRequestList]; //make a copy of the array to update
        const thisRequest = medRequests?.at(requestIndex);//use the copy to make changes

        console.log("medRequests: " + medRequests);
        //console.log("servReq: "+servReq);
        //console.log("thisReq: "+thisReq);
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

        //const servReqList = medRequests[1];
        //setReqPriority(medRequests);    //thisRequest[1]
        setMedRequestList(medRequests);

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

async function getMedRequests(statusFilter:Status, priorityFilter: Priorities) {
    const requests =
        await axios.get<[MedReq[], ServiceRequest[]]>("/api/serviceRequests/medReq",{params: {status: statusFilter, priority: priorityFilter} });

    const medRequests: Array<[MedReq, ServiceRequest]> = [];
    for (let i = 0; i < requests.data[0].length; i++) {
        medRequests.push([requests.data[0][i], requests.data[1][i]]);

    }
    console.log(medRequests);

    return medRequests;

}

async function getEmployees() {
    const employees = await axios.get<Employee[]>("/api/employees/employees/med");
    return employees.data;

}
