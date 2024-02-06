import React from "react";
import ExitButton from "../../components/buttons/ExitButton.tsx";
import AdminPageNavBar from "../../components/navigation-bar/AdminPageNavBar.tsx";
import "../../css/route-css/requestList.css";
import axios from "axios";
import {MedReq} from "../../../../backend/src/algorithms/Requests/Request.ts";

function RequestList() {
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
                            </tr>
                            </thead>
                            {/* populating here */}
                        </table>
                    </div>
                    <ExitButton />
                </div>
            </div>
        </div>
    );
}

//may need onload for other ones as well

populateRequests().then();

//test type REMOVE LATER
export type request = {
    startLocation: string;
    endLocation: string;
    requestType: string;
};

/**
 * This function populates the request table with requests
 * SHOULD ONLY BE RUN ONCE.
 */
async function populateRequests() {
    console.log("RAN");

  const requests = await axios.get<MedReq[]>("/api/serviceRequests/medReq");

    //fine dropdown div in the html on the page
    const table = document.getElementById("request-table");

    console.log(table);
    console.log(requests.data + "hi");

  //for each node
  requests.data.forEach( function a (newRequest: MedReq) {
    //create tr element to store the record
    const tableRow = document.createElement("tr");
    //create td tags for data from record
    const reqType = document.createElement("td");
    reqType.textContent = "Medicine request";
    reqType.setAttribute("class", "node-id");

    const reqStartLoc = document.createElement("td");
    reqStartLoc.textContent = newRequest.genReqID.toString();   //idk if the to string works

        const reqMedType = document.createElement("td");
        reqMedType.textContent = newRequest.medType;

        const reqDosage = document.createElement("td");
        reqDosage.textContent = newRequest.dosage;

        const reqAmount = document.createElement("td");
        reqAmount.textContent = newRequest.numDoses.toString();

        //append data elements together to one row
        tableRow.appendChild(reqType);
        tableRow.appendChild(reqStartLoc);
        tableRow.appendChild(reqMedType);
        tableRow.appendChild(reqDosage);
        tableRow.appendChild(reqAmount);

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

export default RequestList;

