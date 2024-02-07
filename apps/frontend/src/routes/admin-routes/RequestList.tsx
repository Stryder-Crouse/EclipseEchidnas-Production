import React, {useEffect} from "react";
import AdminPageNavBar from "../../components/navigation-bar/AdminPageNavBar.tsx";
import "../../css/route-css/requestList.css";
import axios from "axios";
import {MedReq, ServiceRequest} from "../../../../backend/src/algorithms/Requests/Request.ts";



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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onStatusChange(servReqID:number, employee:string){

    //CHANGE
    if(employee!="a"){
        const select = document.getElementById("request"+servReqID);
        if(select==null){
            console.error("could not find request dropdown for request " + servReqID);
            return;
        }
        console.log("XD "+select.getAttribute("value"));
        if(select.getAttribute("value")=="unassigned"){
            select.setAttribute("value","assigned");
            console.error("you cannot change the status of an assigned request to unassigned" + servReqID);
        }



    }
    else{
        console.error("you cannot change the status of an unassigned request");
    }



}


/**
 * This function populates the request table with requests
 * SHOULD ONLY BE RUN ONCE.
 */

async function populateRequests() {
    console.log("RAN");

  const requests = await axios.get<[MedReq[],ServiceRequest[]]>("/api/serviceRequests/medReq");

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

        const reqStatus = document.createElement("td");
        reqStatus.innerHTML = '<select id={"request"+servReq.reqID} onClick={} >\n' +
            '                <option className={"unassigned"} value={status.Unassigned}>Unassigned</option>\n' +
            '                <option className={"assigned"} value={status.Assigned}>Assigned</option>\n' +
            '                <option className={"progressed"} value={status.InProgress}>In Progress</option>\n' +
            '                <option className={"completed"} value={status.Completed}>Completed</option>\n' +
            '            </select>';



        //append data elements together to one row
        tableRow.appendChild(reqType);
        tableRow.appendChild(reqStartLoc);
        tableRow.appendChild(reqMedType);
        tableRow.appendChild(reqDosage);
        tableRow.appendChild(reqAmount);
        tableRow.appendChild(reqStatus);

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

