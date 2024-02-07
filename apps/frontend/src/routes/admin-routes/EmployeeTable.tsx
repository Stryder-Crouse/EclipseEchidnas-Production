import React, { useEffect} from "react";
//import ExitButton from "../../components/buttons/ExitButton.tsx";
import AdminPageNavBar from "../../components/navigation-bar/AdminPageNavBar.tsx";
import "../../css/route-css/EmployeeTable.css";
import axios from "axios";
import { Employee } from "../../../../backend/src/algorithms/Employee/Employee.ts";

let ran = false;

function EmployeeTable() {

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
              <span className={"table-title"}>Employee Table</span>
            </span>
                    <div className={"table-wrapper"}>
                        <table className={"requestTable"} id={"request-table"}>
                            <thead>
                            <tr>
                                <th>User Name</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Designation</th>
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

//populateRequests().then();

//test type REMOVE LATER
// export type request = {
//     startLocation: string;
//     endLocation: string;
//     requestType: string;
// };

/**
 * This function populates the request table with requests
 * SHOULD ONLY BE RUN ONCE.
 */


async function populateRequests() {
    console.log("RAN");

    const empReqs = await axios.get<Employee[]>("/api/employees/employees");

    //fine dropdown div in the html on the page
    const table = document.getElementById("request-table");

    console.log(table);

    //for each node
    empReqs.data.forEach(function (newRequest: Employee) {
        //create tr element to store the record
        const tableRow = document.createElement("tr");

        // //create td tags for data from record
        // const reqType = document.createElement("td");
        // reqType.textContent = "Medicine request";
        // reqType.setAttribute("class", "node-id");

        const userName = document.createElement("td");
        userName.textContent = newRequest.userName;
        userName.setAttribute("class","node-id");

        const firstName = document.createElement("td");
        firstName.textContent = newRequest.firstName;

        const lastName = document.createElement("td");
        lastName.textContent = newRequest.lastName;

        const designation = document.createElement("td");
        designation.textContent = newRequest.designation.toString();

        //append data elements together to one row
        tableRow.appendChild(userName);
        tableRow.appendChild(firstName);
        tableRow.appendChild(lastName);
        tableRow.appendChild(designation);
        //tableRow.appendChild(reqAmount);

        if (table == null) {
            return;
        }

        //add new row element to table
        table.appendChild(tableRow);
    });
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

export default EmployeeTable;
