import React, {useEffect, useState} from "react";
import axios from "axios";
import {Priorities, ReligRequest, ServiceRequest} from "../../../../../../packages/common/src/algorithms/Requests/Request.ts";
import {Employee} from "../../../../../../packages/common/src/algorithms/Employee/Employee.ts";
//import AdminPageNavBar from "../../navigation-bar/AdminPageNavBar.tsx";
import Status from "../../../../../../packages/common/src/algorithms/Requests/Status.ts";
import {requestFilters} from "../serviceRequestInterface.ts";




export default function Religious_table({statusFilter, priorityFilter,employeeFilter,locationFilter}:requestFilters) {
    console.log(statusFilter,priorityFilter);

    const [religRequestList, setReligRequestList] =
        useState<Array<[ReligRequest, ServiceRequest]>>([]);
    const [religEmployees, setReligEmployees] =
        useState<Employee[]>([]);


    //todo FNFN fix with proper population code
    useEffect(() => {

            getEmployees().then(result => {
                setReligEmployees(result);
            });
            getReligRequests(statusFilter, priorityFilter,employeeFilter,locationFilter).then(result => {
                setReligRequestList(result);
            });




    }, [statusFilter, priorityFilter, employeeFilter, locationFilter]);

    return (
        <div>


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
                                <th className={"tableTD"}>Religion</th>
                                <th className={"tableTD"}>Service requested</th>
                                <th className={"tableTD"}>Extra Notes</th>
                            </tr>
                            </thead>
                            {/* populating here */}
                            <tbody>
                            {
                                //ids are startingNodeInput and endingNodeInput
                                religRequestList?.map((request, requestIndex) => {
                                    return (
                                        <tr className={"tableTR"} key={"Relig_" + request[0].genReqID}>
                                            <td className={"tableTD"}>{request[1].reqID}</td>
                                            <td className={"tableTD"}>{request[1].reqType}</td>
                                            <td className={"tableTD"}> {/*status*/}
                                                <select
                                                    value={request[1].status}
                                                    id={"religStatusDropdown" + request[1].reqID}
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
                                            <td className={"tableTD"}> {/*priority*/}
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
                                                        religEmployees?.map((employee) =>
                                                            renderEmployees(employee, request[0].genReqID.toString()))
                                                    }
                                                </select>
                                            </td>
                                            <td className={"tableTD"}>{request[1].reqLocationID}</td>
                                            {/*location*/}
                                            <td className={"tableTD"}>{request[0].patientName}</td>
                                            <td className={"tableTD"}>{request[0].religion}</td>
                                            <td className={"tableTD"}>{request[0].reqDescription}</td>
                                            <td className={"tableTD"}>{request[1].extraInfo}</td>
                                        </tr>

                                    );
                                })
                            }
                            </tbody>
                        </table>
        </div>

    );

    function renderEmployees(employee: Employee, religID: string) {
        return (
            <option

                className={"status-dropdown"}
                value={employee.userName}
                key={religID + employee.userName}
            >
                {(employee.firstName + " "
                    + employee.lastName
                    + " (" + employee.designation + ")")}
            </option>
        );
    }

    async function onEmployeeChange(select: HTMLSelectElement, requestIndex: number) {


        const religRequests = [...religRequestList]; //make a copy of the array to update
        const thisRequest = religRequests?.at(requestIndex);//use the copy to make changes

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
            setReligRequestList(religRequests);

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
            setReligRequestList(religRequests);

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

        const religRequests = [...religRequestList]; //make a copy of the array to update
        const thisRequest = religRequests?.at(requestIndex);//use the copy to make changes
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
            setReligRequestList(religRequests);

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
        const religRequests = [...religRequestList]; //make a copy of the array to update
        const thisRequest = religRequests?.at(requestIndex);//use the copy to make changes

        console.log("religRequests: " + religRequests);
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
        setReligRequestList(religRequests);

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

async function getReligRequests(statusFilter:Status, priorityFilter:Priorities, employeeFilter:string, locationFilter:string) {
    const requests =
        await axios.get<[ReligRequest[], ServiceRequest[]]>("/api/serviceRequests/religiousRequest/filter",{params: {status: statusFilter, priority: priorityFilter,
                employee:employeeFilter, location:locationFilter
            } });

    const religRequests: Array<[ReligRequest, ServiceRequest]> = [];
    for (let i = 0; i < requests.data[0].length; i++) {
        religRequests.push([requests.data[0][i], requests.data[1][i]]);

    }
    console.log(religRequests);

    return religRequests;

}

async function getEmployees() {
    const employees = await axios.get<Employee[]>("/api/employees/employees/rel");
    return employees.data;


}
