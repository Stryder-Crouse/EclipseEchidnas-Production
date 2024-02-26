import React from "react";
import {requestFilters} from "../serviceRequestInterface.ts";
import {useState, useEffect} from "react";
import {OutsideTransport, Priorities} from "../../../../../../packages/common/src/algorithms/Requests/Request.ts";
import {ServiceRequest} from "../../../../../../packages/common/src/algorithms/Requests/Request.ts";
import axios from "axios";
import {Employee} from "../../../../../../packages/common/src/algorithms/Employee/Employee.ts";
import Status from "../../../../../../packages/common/src/algorithms/Requests/Status.ts";

async function getReqs(statusFilter: Status, priorityFilter:Priorities, employeeFilter:string, locationFilter:string) {
    const res =
        await axios.get<[OutsideTransport[],ServiceRequest[]]>
        ("api/serviceRequests/outsideTransport/filter", {params: {status: statusFilter, priority: priorityFilter,
                employee:employeeFilter, location:locationFilter
            } });
    const requests: Array<[OutsideTransport, ServiceRequest]> = [];
    for (let i = 0; i < res.data[0].length; i++) {
        requests.push([res.data[0][i], res.data[1][i]]);

    }
    console.log(requests);

    return requests;
}

async function getEmployees() {
    const employees = await
        axios.get<Employee[]>("/api/employees/employees/transport");
    return employees.data;
}

export default function Transportation_table({statusFilter, priorityFilter,employeeFilter,locationFilter}:requestFilters) {
    console.log(statusFilter,priorityFilter);

    const [reqList, setReqList] = useState<Array<[OutsideTransport, ServiceRequest]>>([]);
    const [transportEmployees, setTransportEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        let queryDone = false;

        if (!queryDone) {
            getEmployees().then(result => {
                setTransportEmployees(result);
            });
            getReqs(statusFilter,priorityFilter,employeeFilter,locationFilter).then(result => {
                setReqList(result);
            });
        }
        return () => {
            queryDone = true;
        };
    },[employeeFilter, locationFilter, priorityFilter, statusFilter]);

    function renderEmployees(employee:Employee, transportID:string) {
        return (
            <option
                value = {employee.userName}
                key = {transportID+employee.userName}
                >
                { (employee.firstName + " " + employee.lastName + " ("+employee.designation+")")}
            </option>
        );
    }

    async function onEmployeeChange(select: HTMLSelectElement, requestIndex: number) {

        const requests = [...reqList]; //make a copy of the array to update
        const thisRequest = requests?.at(requestIndex);//use the copy to make changes

        if(thisRequest== undefined){
            console.error("request not found from requesst index ");
            return;
        }

        if (select == null) {
            console.error("could not find request dropdown for request " + thisRequest[1].reqID);
            return;
        }

        if(select.value!="No one"){
            //change record to assigned
            thisRequest[1].status=Status.Assigned;
            //change employee to the new employee
            thisRequest[1].assignedUName=select.value;
            //database

            //set new record list to re render and update (MAKE SURE BEFORE POST REQUST)
            console.log("hello");
            setReqList(requests);

            try {
                await axios.post("/api/serviceRequests/changeUser",
                    {reqID: thisRequest[1].reqID, newAssignedUser: select.value as string, status: "Assigned"}, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

            }
            catch (e) {
                console.error("failed to change user" + e);
            }

        }
        else{
            //change record to assigned
            thisRequest[1].status=Status.Unassigned;
            //change employee to the new employee
            thisRequest[1].assignedUName=select.value;

            //set new record list to re render and update
            console.log("hello2");
            setReqList(requests);

            try {
                await axios.post("/api/serviceRequests/changeUser",
                    {reqID: thisRequest[1].reqID, newAssignedUser: select.value as string, status: "Unassigned"}, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

            }
            catch (e) {
                console.error("faild to change user "+e);
            }
        }
        console.log("EE " + select.value);
    }

    async function onPriorityChange(select: HTMLSelectElement, requestIndex: number) {
        const transReq = [...reqList]; //make a copy of the array to update
        const thisRequest = transReq?.at(requestIndex);//use the copy to make changes

        console.log("transRequests: " + transReq);
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

        setReqList(transReq);

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

    async function onStatusChange(select: HTMLSelectElement, requestIndex: number) {

        const requests = [...reqList]; //make a copy of the array to update
        const thisRequest = requests?.at(requestIndex);//use the copy to make changes
        if(thisRequest== undefined){
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

                //todo show visual error
                console.error("you cannot change the status of an assigned request to unassigned " + thisRequest[1].reqID);
                return;

            }

            //assign new status
            thisRequest[1].status=select.value;

            //set new record list to re render and update
            console.log("hello2");
            setReqList(requests);

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

    return (
        <div className={"h-100 w-[42.5rem] overflow-auto rounded-xl" }>
            <table>
                <thead>
                <tr className={"tableTRHead"}>
                    <th className={"tableTD"}>ID</th>
                    <th className={"tableTD"}>Type</th>
                    <th className={"tableTD"}>Status</th>
                    <th className={"tableTD"}>Priority</th>
                    <th className={"tableTD"}>Employee Assigned</th>
                    <th className={"tableTD"}>Location ID</th>
                    <th className={"tableTD"}>Destination</th>
                    <th className={"tableTD"}>Patient Name</th>
                    <th className={"tableTD"}>Transportation Mode</th>
                    <th className={"tableTD"}>Extra Notes</th>
                </tr>
                </thead>
                <tbody>
                {reqList?.map((request, requestIndex) => {
                    return (
                        <tr key={"Req_" + requestIndex} className={"tableTR"}>
                            <td className={"tableTD"}>{request[1].reqID}</td>
                            <td className={"tableTD"}>{request[1].reqType}</td>
                            <td className={"tableTD"}>
                                <select
                                    value={request[1].status}
                                    id={"transportRequestDropdown" + request[1].reqID}
                                    onChange={
                                        (event) => {
                                            const eventHTML = event.target as HTMLSelectElement;
                                            onStatusChange(eventHTML, requestIndex).then();
                                        }
                                    }>
                                    <option value={"Unassigned"}>Unassigned</option>
                                    <option value={"Assigned"}>Assigned</option>
                                    <option value={"In Progress"}>In Progress</option>
                                    <option value={"Completed"}>Completed</option>
                                </select>
                            </td>
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
                            <td className={"tableTD"}>
                                <select
                                    value={request[1].assignedUName}
                                    onChange={
                                        (event) => {
                                            const eventHTML = event.target as HTMLSelectElement;
                                            onEmployeeChange(eventHTML, requestIndex).then();
                                        }
                                    }>
                                    {
                                        transportEmployees?.map((employee) =>
                                            renderEmployees(employee, request[0].serviceReqID.toString()))
                                    }
                                </select>
                            </td>
                            <td className={"tableTD"}>{request[1].reqLocationID}</td>
                            <td className={"tableTD"}>{request[0].destination}</td>
                            <td className={"tableTD"}>{request[0].patientName}</td>
                            <td className={"tableTD"}>{request[0].modeOfTransport}</td>
                            <td className={"tableTD"}>{request[1].extraInfo}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );


}
