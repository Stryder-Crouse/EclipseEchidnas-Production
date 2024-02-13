import React, {useEffect, useState} from "react";
import AdminPageNavBar from "../../components/navigation-bar/AdminPageNavBar.tsx";
import "../../css/route-css/requestList.css";
import axios from "axios";
import {MedReq, ServiceRequest} from "../../../../backend/src/algorithms/Requests/Request.ts";
import {Employee} from "../../../../backend/src/algorithms/Employee/Employee.ts";
import Status from "../../../../backend/src/algorithms/Requests/Status.ts";


function OLDRequestList() {

    const [medRequestList, setMedRequestList] =
        useState<Array<[MedReq,ServiceRequest]>>([]);
    const [medEmployees, setMedEmployees] =
        useState<Employee[]>([]);





    //todo FNFN fix with proper population code
    useEffect(()=>{
        let queryDone = false;

        if (!queryDone) {
            getEmployees().then(result=>{ setMedEmployees(result);});
            getMedRequests().then(result=>{ setMedRequestList(result);});

        }
        return ()=>{
            queryDone = true;
        };


    },[]);

    return (
        <div>
            <AdminPageNavBar />

            <div className={"request-table-container"}>
                <div className={"table-container"}>
            <span className={"caption-container"}>
              <span className={"table-title"}>Request Log</span>
            </span>
            <div className={"table-wrapper"}>
              <table className={"requestTable"} id={"request-table"}>
                <thead>
                <tr>
                    <th>Request Type</th>
                    <th>Priority</th>
                    <th>Going To</th>
                    <th>Medicine type</th>
                    <th>Dosage</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Employee</th>
                </tr>
                </thead>
                {/* populating here */}
                  <tbody>
                  {
                      //id's are startingNodeInput and endingNodeInput
                      medRequestList?.map((request,requestIndex) => {
                          return (
                              <tr key={"Med_"+request[0].genReqID}>
                                  <td className={"node-id"}>{request[1].reqType}</td>
                                  <td>
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
                                          <option className={"priorityDropdown"} value="Medium">Medium</option>
                                          <option className={"priorityDropdown"} value="High">High</option>
                                          <option className={"priorityDropdown"} value="Emergency">Emergency</option>
                                      </select>
                                  </td>
                                  <td>{request[1].reqLocationID}</td>
                                  <td>{request[0].medType}</td>
                                  <td>{request[0].dosage}</td>
                                  <td>{request[0].numDoses.toString()}</td>
                                  <td>
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
                                          <option className={"status-dropdown"} value="Unassigned">Unassigned</option>
                                          <option className={"status-dropdown"} value="Assigned">Assigned</option>
                                          <option className={"status-dropdown"} value="In Progress">In Progress</option>
                                          <option className={"status-dropdown"} value="Completed">Completed</option>
                                      </select>
                                  </td>
                                  <td>
                                      <select
                                          value={request[1].assignedUName}
                                          onChange={
                                            (event)=>
                                            {

                                                const eventHTML = event.target as HTMLSelectElement;
                                                onEmployeeChange(eventHTML,requestIndex).then();
                                            }
                                          }
                                      >
                                          {
                                              medEmployees?.map((employee) =>
                                                  renderEmployees(employee,request[0].genReqID.toString()))
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
          </div>
        </div>
    </div>
  );

    function renderEmployees(employee:Employee,medID:string){
        return (
            <option
                className={"statis-dropdown"}
                value = {employee.userName}
                key = {medID+employee.userName}
            >
                {(employee.firstName + " "
                +employee.lastName
                + " ("+employee.designation+")")}
            </option>
        );
    }

    async function onEmployeeChange(select: HTMLSelectElement, requestIndex: number) {


        const medRequests = [...medRequestList]; //make a copy of the array to update
        const thisRequest = medRequests?.at(requestIndex);//use the copy to make changes

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
            setMedRequestList(medRequests);

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
            setMedRequestList(medRequests);

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

        const medRequests = [...medRequestList]; //make a copy of the array to update
        const thisRequest = medRequests?.at(requestIndex);//use the copy to make changes
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
                console.error("faild to change state");
            }


        } else {



            //todo visual error
            console.error("you cannot change the status of an unassigned request");
        }


    }
    async function onPriorityChange(select: HTMLSelectElement, requestIndex: number) {
        const medRequests = [...medRequestList]; //make a copy of the array to update
        const thisRequest = medRequests?.at(requestIndex);//use the copy to make changes

        console.log("medRequests: "+medRequests);
        //console.log("servReq: "+servReq);
        //console.log("thisReq: "+thisReq);
        console.log("thisRequest" + thisRequest);

        if(thisRequest== undefined){
            console.error("request not found from request index ");
            return;
        }

        if (select == null) {
            console.error("could not find request dropdown for request " + thisRequest[1].reqID);
            return;
        }

        //assign new status
        thisRequest[1].reqPriority=select.value;
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




//get service requests and medical request and employees
async function getMedRequests() {
    const requests = await axios.get<[MedReq[], ServiceRequest[]]>("/api/serviceRequests/medReq");

    const medRequests:Array<[MedReq,ServiceRequest]> = [];
    for(let i=0;i<requests.data[0].length;i++){
        medRequests.push([requests.data[0][i],requests.data[1][i]]);

    }
    console.log(medRequests);

    return medRequests;

}

async function getEmployees() {
    const employees = await axios.get<Employee[]>("/api/employees/employees/med");
    return employees.data;

}






//todo clean up -stryder

// used in populate function





/**
 * This function populates the request table with requests
 * SHOULD ONLY BE RUN ONCE.
 */

// async function populateRequests() {
//     console.log("RAN");
//
//   const requests = await axios.get<[MedReq[],ServiceRequest[]]>("/api/serviceRequests/medReq");
//     const employees = await axios.get<Employee[]>("/api/employees/employees/med");
//     console.log("hihi:"+employees.data);
//     //fine dropdown div in the html on the page
//     const table = document.getElementById("request-table");
//
//     console.log(table);
//     console.log(requests.data + "hi");
//
//     if(requests.data[0].length != requests.data[1].length){
//         console.error("med and serv arrays not equal in length");
//         return;
//     }
//     //for each request
//     for(let i=0; i< requests.data[0].length;i++){
//         const medReq:MedReq = requests.data[0][i];
//         const servReq:ServiceRequest = requests.data[1][i];
//
//         //create tr element to store the record
//         const tableRow = document.createElement("tr");
//         //create td tags for data from record
//         const reqType = document.createElement("td");
//         reqType.textContent = "Medicine Request";
//         reqType.setAttribute("class", "node-id");
//
//         const reqStartLoc = document.createElement("td");
//         reqStartLoc.textContent = servReq.reqLocationID;   //idk if the to string works
//
//         const reqMedType = document.createElement("td");
//         reqMedType.textContent = medReq.medType;
//
//         const reqDosage = document.createElement("td");
//         reqDosage.textContent = medReq.dosage;
//
//         const reqAmount = document.createElement("td");
//         reqAmount.textContent = medReq.numDoses.toString();
//
//         // status drop down
//         const reqStatus = document.createElement("td");
//         const select = document.createElement("select");
//         select.id = "requestDropdown"+servReq.reqID;
//         select.className="status-dropdown";
//
//
//         select.innerHTML =
//             '                <option className={"status-dropdown"} value="Unassigned">Unassigned</option>\n' +
//             '                <option className={"status-dropdown"} value="Assigned">Assigned</option>\n' +
//             '                <option className={"status-dropdown"} value="In Progress">In Progress</option>\n' +
//             '                <option className={"status-dropdown"} value="Completed">Completed</option>\n';
//         //todo remove this do proper popualtion code
//         select.onchange = (e)=>{
//             const event = e.target as HTMLSelectElement;
//             onStatusChange(event,servReq.reqID,servReq.assignedUName);
//         };
//
//
//         reqStatus.appendChild(select);
//
//         //set value afther appending the options
//         select.value = servReq.status;
//
//         // employee drop down
//         const reqEmployee = document.createElement("td");
//
//
//         const selectEmp = document.createElement("select");
//         selectEmp.id = "employeeDropdown"+servReq.reqID;
//         selectEmp.className="status-dropdown";
//
//         reqEmployee.appendChild(selectEmp);
//
//
//         employees.data.forEach((employee)=>{
//             const newOption = document.createElement("option");
//             newOption.className="status-dropdown";
//             newOption.value = employee.userName;
//             newOption.textContent = employee.firstName + " " +employee.lastName + " ("+employee.designation+")";
//             selectEmp.appendChild(newOption);
//
//
//
//         });
//
//         //todo remove this do proper popualtion code
//         selectEmp.onchange = (e)=>{
//             const event = e.target as HTMLSelectElement;
//             onEmployeeChange(event,servReq.reqID);
//         };
//
//
//         //
//         // //set value afther appending the options
//         selectEmp.value = servReq.assignedUName;
//
//
//
//         //append data elements together to one row
//         tableRow.appendChild(reqType);
//         tableRow.appendChild(reqStartLoc);
//         tableRow.appendChild(reqMedType);
//         tableRow.appendChild(reqDosage);
//         tableRow.appendChild(reqAmount);
//         tableRow.appendChild(reqStatus);
//
//         tableRow.appendChild(reqEmployee);
//
//         if (table == null) {
//             return;
//         }
//
//         //add new row element to table
//         table.appendChild(tableRow);
//
//     }
//
//
// }



// async function getRequests() {
//   try {
//     //MAKE SURE TO PASS THE TYPE axios.get<TYPE> to get the data out correctly
//     //the node[] make the data a node array type (axios does the conversion for us)
//     const response = await axios.get<Node[]>("/api/load-nodes");
//     console.log(response);
//     return response.data;
//   } catch (err) {
//     throw new Error("Error getting Nodes");
//   }
// }

export default OLDRequestList;

