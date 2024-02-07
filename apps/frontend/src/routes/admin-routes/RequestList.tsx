import React, {useEffect} from "react";
import AdminPageNavBar from "../../components/navigation-bar/AdminPageNavBar.tsx";
import "../../css/route-css/requestList.css";
import axios from "axios";
import {MedReq, ServiceRequest} from "../../../../backend/src/algorithms/Requests/Request.ts";
import {Employee} from "../../../../backend/src/algorithms/Employee/Employee.ts";




let ran = false;

function RequestList() {

    //todo FNFN fix with proper population code
    useEffect(()=>{
        if(!ran){
            populateRequests().then();

            ran=true;
        }

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
                    <th>Going To</th>
                    <th>Medicine type</th>
                    <th>Dosage</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Employee</th>
                </tr>
                </thead>
                {/* populating here */}
              </table>
            </div>
          </div>
        </div>
    </div>
  );
}

//may need onload for other ones as well

//test type REMOVE LATER
export type request = {
    startLocation: string;
    endLocation: string;
    requestType: string;
};


//todo clean up -stryder

// used in populate function

async function onStatusChange(select: HTMLSelectElement, servReqID: number, employee: string) {

    //CHANGE
    if (employee != "No one") {

        if (select == null) {
            console.error("could not find request dropdown for request " + servReqID);
            return;
        }
        console.log("XD " + select.value);
        if (select.value == "Unassigned") {

            //todo show visual error
            console.error("you cannot change the status of an assigned request to unassigned " + servReqID);
            select.value="Assigned";

        }

        //database
        try {
            await axios.post("/api/serviceRequests/changeState",
                {reqID: servReqID, newState: select.value as string}, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
        } catch (e) {
            console.error("faild to change state");
        }


    } else {
        select.value="Unassigned";
        //todo visual error
        console.error("you cannot change the status of an unassigned request");
    }


}

//todo clean up -stryder

async function onEmployeeChange(select: HTMLSelectElement, servReqID: number) {


    if (select == null) {
        console.error("could not find request dropdown for request " + servReqID);
        return;
    }

    //defult status of same record to assigned
    const statusSelect = document.getElementById("requestDropdown"+servReqID) as HTMLSelectElement;

    if(select.value!="No one"){


        statusSelect.value="Assigned"; //DOES NOT CAUSE onStatusChange to fire so the post call changes this for us

        //update status dropdown event listener
        statusSelect.onchange = (e)=>{
            const event = e.target as HTMLSelectElement;
            onStatusChange(event,servReqID,select.value);
        };



        //database

        try {
            await axios.post("/api/serviceRequests/changeUser",
                {reqID: servReqID, newAssignedUser: select.value as string, status: "Assigned"}, {
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
        statusSelect.value="Unassigned";

        //update status dropdown event listener
        statusSelect.onchange = (e)=>{
            const event = e.target as HTMLSelectElement;
            onStatusChange(event,servReqID,select.value);
        };
        try {
            await axios.post("/api/serviceRequests/changeUser",
                {reqID: servReqID, newAssignedUser: select.value as string, status: "Unassigned"}, {
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


/**
 * This function populates the request table with requests
 * SHOULD ONLY BE RUN ONCE.
 */

async function populateRequests() {
    console.log("RAN");

  const requests = await axios.get<[MedReq[],ServiceRequest[]]>("/api/serviceRequests/medReq");
    const employees = await axios.get<Employee[]>("/api/employees/employees/med");
    console.log("hihi:"+employees.data);
    //fine dropdown div in the html on the page
    const table = document.getElementById("request-table");

    console.log(table);
    console.log(requests.data + "hi");

    if(requests.data[0].length != requests.data[1].length){
        console.error("med and serv arrays not equal in length");
        return;
    }
    //for each request
    for(let i=0; i< requests.data[0].length;i++){
        const medReq:MedReq = requests.data[0][i];
        const servReq:ServiceRequest = requests.data[1][i];

        //create tr element to store the record
        const tableRow = document.createElement("tr");
        //create td tags for data from record
        const reqType = document.createElement("td");
        reqType.textContent = "Medicine Request";
        reqType.setAttribute("class", "node-id");

        const reqStartLoc = document.createElement("td");
        reqStartLoc.textContent = servReq.reqLocationID;   //idk if the to string works

        const reqMedType = document.createElement("td");
        reqMedType.textContent = medReq.medType;

        const reqDosage = document.createElement("td");
        reqDosage.textContent = medReq.dosage;

        const reqAmount = document.createElement("td");
        reqAmount.textContent = medReq.numDoses.toString();

        // status drop down
        const reqStatus = document.createElement("td");
        const select = document.createElement("select");
        select.id = "requestDropdown"+servReq.reqID;
        select.className="status-dropdown";


        select.innerHTML =
            '                <option className={"status-dropdown"} value="Unassigned">Unassigned</option>\n' +
            '                <option className={"status-dropdown"} value="Assigned">Assigned</option>\n' +
            '                <option className={"status-dropdown"} value="In Progress">In Progress</option>\n' +
            '                <option className={"status-dropdown"} value="Completed">Completed</option>\n';
        //todo remove this do proper popualtion code
        select.onchange = (e)=>{
            const event = e.target as HTMLSelectElement;
            onStatusChange(event,servReq.reqID,servReq.assignedUName);
        };


        reqStatus.appendChild(select);

        //set value afther appending the options
        select.value = servReq.status;

        // employee drop down
        const reqEmployee = document.createElement("td");


        const selectEmp = document.createElement("select");
        selectEmp.id = "employeeDropdown"+servReq.reqID;
        selectEmp.className="status-dropdown";

        reqEmployee.appendChild(selectEmp);


        employees.data.forEach((employee)=>{
            const newOption = document.createElement("option");
            newOption.className="status-dropdown";
            newOption.value = employee.userName;
            newOption.textContent = employee.firstName + " " +employee.lastName + " ("+employee.designation+")";
            selectEmp.appendChild(newOption);



        });

        //todo remove this do proper popualtion code
        selectEmp.onchange = (e)=>{
            const event = e.target as HTMLSelectElement;
            onEmployeeChange(event,servReq.reqID);
        };


        //
        // //set value afther appending the options
        selectEmp.value = servReq.assignedUName;



        //append data elements together to one row
        tableRow.appendChild(reqType);
        tableRow.appendChild(reqStartLoc);
        tableRow.appendChild(reqMedType);
        tableRow.appendChild(reqDosage);
        tableRow.appendChild(reqAmount);
        tableRow.appendChild(reqStatus);

        tableRow.appendChild(reqEmployee);

        if (table == null) {
            return;
        }

        //add new row element to table
        table.appendChild(tableRow);

    }


}



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

export default RequestList;

