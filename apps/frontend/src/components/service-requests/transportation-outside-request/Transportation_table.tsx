import React from "react";
import {statusFilter} from "../serviceRequestInterface.ts";
import {useState, useEffect} from "react";
import {OutsideTransport} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import {ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import axios from "axios";
import {Employee} from "../../../../../backend/src/algorithms/Employee/Employee.ts";
import Status from "../../../../../backend/src/algorithms/Requests/Status.ts";

async function getReqs() {
    const res = await axios.get("api/serviceRequest/outsideTransport");
    return res.data;
}

async function getEmployees() {
    const employees = await
        axios.get<Employee[]>("/api/employees/employees/transport");
    return employees.data;
}

export default function Transportation_table({statusFilter:statusFilter}:statusFilter) {
    console.log(statusFilter);

    const [reqList, setReqList] = useState<Array<[OutsideTransport, ServiceRequest]>>([]);
    const [transportEmployees, setTransportEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        let queryDone = false;

        if (!queryDone) {
            getEmployees().then(result => {
                setTransportEmployees(result);
            });
            getReqs().then(result => {
                setReqList(result);
            });
        }
        return () => {
            queryDone = true;
        };
    },[]);

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
                console.error("faild to change state");
            }

        } else {

            console.error("you cannot change the status of an unassigned request");
        }


    }

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Request ID:</th>
                    <th>Priority Level:</th>
                    <th>Status:</th>
                    <th>Assigned Employee:</th>
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
                            <td>{request[1].reqID}</td>
                            <td>{request[1].reqPriority}</td>
                            <td>
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
                            <td>
                                <select
                                    value={request[1].assignedUName}
                                    onChange={
                                        (event)=>
                                            {
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
                            <td>{request[0].patientName}</td>
                            <td>{request[0].destination}</td>
                            <td>{request[0].destination}</td>
                            <td>{request[0].modeOfTransport}</td>
                            <td>{request[1].extraInfo}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );


}
