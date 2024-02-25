import axios from "axios";
import {useState,useEffect} from "react";
import {FlowReq, Priorities, ServiceRequest} from "../../../../../../packages/common/src/algorithms/Requests/Request.ts";
import Status from "../../../../../../packages/common/src/algorithms/Requests/Status.ts";
import {Employee} from "../../../../../../packages/common/src/algorithms/Employee/Employee.ts";
import {requestFilters} from "../serviceRequestInterface.ts";
// import Status from "../../../../../backend/src/algorithms/Requests/Status.ts";
// import {Employee} from "../../../../../backend/src/algorithms/Employee/Employee.ts";


export default function Flower_table({statusFilter, priorityFilter,employeeFilter,locationFilter}:requestFilters) {
    console.log(statusFilter ,priorityFilter);


    const [flowerRequest, setFlowerRequest] =
        useState<Array<[FlowReq, ServiceRequest]>>([]);
    const [flowerEmployees, setFlowerEmployees] =
        useState<Employee[]>([]);

    useEffect(() => {
        console.log("hello");
        getEmployees().then(result=> {
            setFlowerEmployees(result);
        });
        getflowerReq(statusFilter, priorityFilter,employeeFilter,locationFilter).then(result => {
            console.log("hello");
            setFlowerRequest(result);
        });
    },[employeeFilter, locationFilter, priorityFilter, statusFilter]);


    return (
        <div className={"h-100 w-[42.5rem] overflow-auto "}>

            <table className={"requestTable"} id={"request-table"}>
                <thead>
                <tr className={"tableTRHead"}>
                    <th className={"tableTD"}>ID</th>
                    <th className={"tableTD"}>Type</th>
                    <th className={"tableTD"}>Status</th>
                    <th className={"tableTD"}>Priority</th>
                    <th className={"tableTD"}>Employee Assigned</th>
                    <th className={"tableTD"}>Location ID</th>
                    <th className={"tableTD"}>Sender</th>
                    <th className={"tableTD"}>Flower type</th>
                    <th className={"tableTD"}>Flower Quantity</th>
                    <th className={"tableTD"}>Flower Recepient</th>
                    <th className={"tableTD"}>Message</th>
                    <th className={"tableTD"}>Extra Notes</th>
                </tr>
                </thead>
                {/* populating here */}
                <tbody>
                {
                    //ids are startingNodeInput and endingNodeInput

                    flowerRequest?.map((request, requestIndex) => {
                        return (
                            <tr className={"tableTR"} key={"Flow_" + request[0].genReqID}>

                                <td className={"tableTD"}>{request[1].reqID}</td>
                                <td className={"tableTD"}>{request[1].reqType}</td>
                                {/*type*/}
                                <td className={"tableTD"}> {/*status*/}
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
                                <td className={"tableTD"}> {/*priority*/}
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
                                <td className={"tableTD"}> {/*employee*/}
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
                                            flowerEmployees?.map((employee) => {
                                                console.log("request Index: " + requestIndex);
                                                console.log(request[0]);
                                                return renderEmployees(employee, request[0].genReqID.toString());
                                            })
                                        }
                                    </select>
                                </td>

                                <td className={"tableTD"}>{request[1].reqLocationID}</td>
                                {/*location*/}
                                <td className={"tableTD"}>{request[0].sender}</td>
                                <td className={"tableTD"}>{request[0].flowType}</td>
                                <td className={"tableTD"}>{request[0].quantity.toString()}</td>
                                <td className={"tableTD"}>{request[0].receiver}</td>
                                <td className={"tableTD"}>{request[0].message}</td>
                                <td className={"tableTD"}>{request[1].extraInfo}</td>
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

    async function onPriorityChange(select: HTMLSelectElement, requestIndex: number) {
        const requests = [...flowerRequest]; //make a copy of the array to update (useState only rerenders when pointer changes)
        const thisRequest = requests?.at(requestIndex);//use the copy to make changes

        console.log("medRequests: " + requests);
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
        setFlowerRequest(requests);

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

        const requests = [...flowerRequest]; //make a copy of the array to update
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
            setFlowerRequest(requests);

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



            //todo visual error
            console.error("you cannot change the status of an unassigned request");
        }


    }

    async function onEmployeeChange(select: HTMLSelectElement, requestIndex: number) {


        const requests = [...flowerRequest]; //make a copy of the array to update
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
            setFlowerRequest(requests);

            try {
                await axios.post("/api/serviceRequests/changeUser",
                    {reqID: thisRequest[1].reqID, newAssignedUser: select.value as string, status: "Assigned"}, {
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
            thisRequest[1].status=Status.Unassigned;
            //change employee to the new employee
            thisRequest[1].assignedUName=select.value;

            //set new record list to re render and update
            console.log("hello2");
            setFlowerRequest(requests);

            try {
                await axios.post("/api/serviceRequests/changeUser",
                    {reqID: thisRequest[1].reqID, newAssignedUser: select.value as string, status: "Unassigned"}, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

            }
            catch (e) {
                console.error("failed to change user "+e);
            }
        }

        console.log("EE " + select.value);


    }


}

async function getflowerReq(statusFilter:Status, priorityFilter:Priorities, employeeFilter:string, locationFilter:string) {
    const requests = await axios.get<[FlowReq[], ServiceRequest[]]>("/api/serviceRequests/flowReq/filter",
        {params: {status: statusFilter, priority: priorityFilter,
                employee:employeeFilter, location:locationFilter
            } });

    const flowRequests: Array<[FlowReq, ServiceRequest]> = [];
    for (let i = 0; i < requests.data[0].length; i++) {
        flowRequests.push([requests.data[0][i], requests.data[1][i]]);

    }
    console.log("flow");
    console.log(flowRequests);

    return flowRequests;

}

async function getEmployees() {
    const employees = await axios.get<Employee[]>("/api/employees/employees/flow");
    return employees.data;
}
