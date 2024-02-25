import React, {useEffect, useState} from "react";
import "../../../css/component-css/ServiceRequestTable.css";
import Status from "../../../../../../packages/common/src/algorithms/Requests/Status.ts";
import {Priorities, ServiceRequest} from "common/src/algorithms/Requests/Request.ts";
import axios from "axios";
import {Employee} from "common/src/algorithms/Employee/Employee.ts";
import {requestFilters} from "../serviceRequestInterface.ts";



/******

 Sorry Grace, but your dropdown dos not work here(for this use case)! Do not get mad; nothing personal
 -Ryan

 ********/

// async function getStats(){
//     const stats = await axios.get("/api/serviceRequests/serviceReq/statistics");
// }
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



export default function ServiceRequest_Table({statusFilter, priorityFilter,employeeFilter,locationFilter}:requestFilters) {
    console.log(priorityFilter);


    //set the variable serviceRequests to the value returned when setServiceRequests is called
    const [serviceRequests , setServiceRequests ] 
        = useState<ServiceRequest[]>([]);

    //set the variable serviceRequests to the value returned when setServiceRequests is called
    const [employees , setEmployees ]
        = useState<Employee[]>([]);



    //will rerun every single time statusFilter is changed (updates table for new entries)
    useEffect(() => {
        //fetches servReqs from the db to update the frontend table
        getServiceRequest(statusFilter,priorityFilter,employeeFilter,locationFilter).then((result)=>{setServiceRequests(result);});
        getEmployees().then((result)=>{setEmployees(result);});
    }, [employeeFilter, locationFilter, priorityFilter, statusFilter]);



    //make table of Service Requests
    return (
        <div className={"h-100 w-[42.5rem] overflow-auto"}>

            {/* make your table in here  */}
            <table className={"medTable"}>
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
                                <th className={"tableTD"}>{request.reqID}</th>
                                <th className={"tableTD"}>{request.reqType}</th>
                                <th className={"tableTD"}>
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
                                        <option className={"status-dropdown"} value="Unassigned">Unassigned</option>
                                        <option className={"status-dropdown"} value="Assigned">Assigned</option>
                                        <option className={"status-dropdown"} value="In Progress">In Progress</option>
                                        <option className={"status-dropdown"} value="Completed">Completed</option>
                                    </select>
                                </th>
                                <th className={"tableTD"}>
                                    <select
                                        className={""}
                                        value={request.reqPriority}     //sets dropdown to request's value
                                        id={"medStatusDropdown" + request.reqID}
                                        onChange={
                                            (event) => {
                                                const eventHTML = event.target as HTMLSelectElement;
                                                onPriorityChange(eventHTML, requestIndex).then();   //whenever priority is changed
                                            }
                                        }
                                    >
                                        <option className={"status-dropdown"} value="Low">Low</option>
                                        <option className={"status-dropdown"} value="Medium">Medium</option>
                                        <option className={"status-dropdown"} value="High">High</option>
                                        <option className={"status-dropdown"} value="Emergency">Emergency</option>
                                    </select>
                                </th>
                                <th className={"tableTD"}>
                                    <select
                                        className={""}
                                        value={request.assignedUName}
                                        onChange={
                                            (event) => {

                                                const eventHTML = event.target as HTMLSelectElement;
                                                onEmployeeChange(eventHTML, requestIndex).then();
                                            }
                                        }
                                    >
                                        {
                                            employees?.map((employee) =>
                                                renderEmployees(employee, request.reqID.toString()))
                                        }
                                    </select>
                                </th>
                                <th className={"tableTD"}>{request.reqLocationID}</th>
                                <td className={"tableTD"}>{request.extraInfo}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        </div>
    );


    function renderEmployees(employee: Employee, reqID: string) {
        return (
            <option
                className={"statis-dropdown"}
                value={employee.userName}
                key={reqID + employee.userName}
            >
                {(employee.firstName + " "
                    + employee.lastName
                    + " (" + employee.designation + ")")}
            </option>
        );
    }

    async function onPriorityChange(select: HTMLSelectElement, requestIndex: number) {
        const requests = [...serviceRequests]; //make a copy of the array to update (useState only rerenders when pointer changes)
        const thisRequest = serviceRequests?.at(requestIndex);//use the copy to make changes

        console.log("medRequests: " + requests);
        //console.log("servReq: "+servReq);
        //console.log("thisReq: "+thisReq);
        console.log("thisRequest" + thisRequest);

        if (thisRequest == undefined) {
            console.error("request not found from request index ");
            return;
        }

        if (select == null) {
            console.error("could not find request dropdown for request " + thisRequest.reqID);
            return;
        }

        //assign new status
        thisRequest.reqPriority = select.value;
        console.log("New Status: " + select.value);

        //const servReqList = medRequests[1];
        //setReqPriority(medRequests);    //thisRequest[1]
        setServiceRequests(requests);

        //update data in the DB
        try {
            await axios.post("/api/serviceRequests/changePriority",
                {reqID: thisRequest.reqID, newPriority: select.value as string}, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
        } catch {
            console.error("Failed to Change the Priority");
        }
    }

    async function onStatusChange(select: HTMLSelectElement, requestIndex: number) {

        const requests = [...serviceRequests]; //make a copy of the array to update
        const thisRequest = serviceRequests?.at(requestIndex);//use the copy to make changes
        if(thisRequest== undefined){
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
            thisRequest.status=select.value;

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

    async function onEmployeeChange(select: HTMLSelectElement, requestIndex: number) {


        const requests = [...serviceRequests]; //make a copy of the array to update
        const thisRequest = requests?.at(requestIndex);//use the copy to make changes

        if(thisRequest== undefined){
            console.error("request not found from requesst index ");
            return;
        }

        if (select == null) {
            console.error("could not find request dropdown for request " + thisRequest.reqID);
            return;
        }



        if(select.value!="No one"){
            //change record to assigned
            thisRequest.status=Status.Assigned;
            //change employee to the new employee
            thisRequest.assignedUName=select.value;
            //database

            //set new record list to re render and update (MAKE SURE BEFORE POST REQUST)
            console.log("hello");
            setServiceRequests(requests);

            try {
                await axios.post("/api/serviceRequests/changeUser",
                    {reqID: thisRequest.reqID, newAssignedUser: select.value as string, status: "Assigned"}, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });


            }
            catch (e) {
                console.error("faild to change user" + e);
            }


        }
        else{
            //change record to assigned
            thisRequest.status=Status.Unassigned;
            //change employee to the new employee
            thisRequest.assignedUName=select.value;

            //set new record list to re render and update
            console.log("hello2");
            setServiceRequests(requests);

            try {
                await axios.post("/api/serviceRequests/changeUser",
                    {reqID: thisRequest.reqID, newAssignedUser: select.value as string, status: "Unassigned"}, {
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

async function getEmployees() {
    const employees = await axios.get<Employee[]>("/api/employees/employees");
    return employees.data;

}


