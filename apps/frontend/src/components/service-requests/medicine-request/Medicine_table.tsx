import React, {useEffect, useState} from "react";
import axios from "axios";
import {MedReq, Priorities, ServiceRequest} from "common/src/algorithms/Requests/Request.ts";
import {Employee} from "common/src/algorithms/Employee/Employee.ts";
import Status from "../../../../../../packages/common/src/algorithms/Requests/Status.ts";
import {requestFilters} from "../serviceRequestInterface.ts";


export default function Medicine_table({statusFilter, priorityFilter,employeeFilter,locationFilter}:requestFilters) {
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
            getMedRequests(statusFilter, priorityFilter,employeeFilter,locationFilter).then(result => {
                setMedRequestList(result);
            });




    }, [statusFilter, priorityFilter, employeeFilter, locationFilter]);

    return (
        <div className={"h-100 w-[42.5rem] overflow-auto rounded-xl "}>

                        <table className={"requestTable"} id={"request-table"}>
                            <thead>
                            <tr className={"tableTRHead"}>
                                <th className={"tableTD"}>ID</th>
                                <th className={"tableTD"}>Type</th>
                                <th className={"tableTD"}>Status</th>
                                <th className={"tableTD"}>Priority</th>
                                <th className={"tableTD"}>Employee Assigned</th>
                                <th className={"tableTD"}>Location ID</th>

                                <th className={"tableTD"}>Patient Name</th>
                                <th className={"tableTD"}>Patient DOB</th>
                                <th className={"tableTD"}>Patient Medical Rec. #</th>
                                <th className={"tableTD"}>Medication Name</th>
                                <th className={"tableTD"}>Medication Dosage</th>
                                <th className={"tableTD"}>Quant. of Doses</th>
                                <th className={"tableTD"}>Medication Form</th>
                                <th className={"tableTD"}>Medication Sig</th>

                                <th className={"tableTD"}>Extra Notes</th>
                            </tr>
                            </thead>
                            {/* populating here */}
                            <tbody>
                            {
                                //ids are startingNodeInput and endingNodeInput
                                medRequestList?.map((request, requestIndex) => {
                                    return (
                                        <tr className={"tableTR"} key={"Med_" + request[0].genReqID}>
                                            <td className={"tableTD"}>{request[1].reqID}</td>
                                            {/*ID       ^^*/}
                                            <td className={"tableTD"}>{request[1].reqType}</td>
                                            {/*type     ^^*/}
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
                                                    <option
                                                        className={"status-dropdown"}
                                                        value="Unassigned">
                                                        Unassigned
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
                                            {/*status   ^^*/}
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
                                            {/*priority ^^*/}
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
                                            {/*employee ^^*/}
                                            <td className={"tableTD"}>{request[1].reqLocationID}</td>
                                            {/*location ^^*/}

                                            <td className={"tableTD"}>{request[0].patientName}</td>
                                            {/*patient name          ^^*/}
                                            <td className={"tableTD"}>{attemptDOB(request[0])}</td>
                                            {/*patient DOB           ^^*/}
                                            <td className={"tableTD"}>{attemptMRN(request[0])}</td>
                                            {/*patient medical rec # ^^*/}
                                            <td className={"tableTD"}>{request[0].medName}</td>
                                            {/*medication name       ^^*/}
                                            <td className={"tableTD"}>{request[0].medStrength}</td>
                                            {/*medication dosage     ^^*/}
                                            <td className={"tableTD"}>{attemptQuant(request[0])}</td>
                                            {/*quant. of doses       ^^*/}
                                            <td className={"tableTD"}>{request[0].medForm}</td>
                                            {/*medication form       ^^*/}
                                            <td className={"tableTD"}>{request[0].medSig}</td>
                                            {/*medication sig        ^^*/}

                                            <td className={"tableTD"}>{request[1].extraInfo}</td>
                                            {/*extra info ^^*/}
                                        </tr>

                                    );
                                })
                            }
                            </tbody>
                        </table>


        </div>
    );

    function attemptMRN (medReq :MedReq) :string {
        if(medReq.patientMedRecNum){
            return medReq.patientMedRecNum.toString();
        }
        else{ return "No med rec # provided, medReq.patientMedRecNum is "+medReq.patientMedRecNum;}
    }
    function attemptDOB (medReq :MedReq) :string {
        if(medReq.patientDOB){
            return medReq.patientDOB.toString();
        }
        else{ return "No date provided";}
    }
    function attemptQuant (medReq :MedReq) :string {
        if(medReq.quantity){
            return medReq.quantity.toString();
        }
        else{ return "No dosage quantity provided";}
    }
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

async function getMedRequests(statusFilter:Status, priorityFilter:Priorities, employeeFilter:string, locationFilter:string) {
    const requests =
        await axios.get<[MedReq[], ServiceRequest[]]>("/api/serviceRequests/medReq/filter",{params: {status: statusFilter, priority: priorityFilter,
                employee:employeeFilter, location:locationFilter
            } });

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
