import React from "react";
import ExitButton from "../components/ExitButton.tsx";
import AdminPageNavBar from "../components/AdminPageNavBar.tsx";
import "../css/requestList.css";

function RequestList() {
  return (
    <div>
      <AdminPageNavBar />

      <div className={"table-container"}>
        <span className={"caption-container"}>
          <span className={"table-title"}>Request Log</span>
        </span>
        <div className={"table-wrapper"}>
          <table className={"requestTable"} id={"request-table"}>
            <thead>
              <tr>
                <th>Request Type</th>
                <th>From</th>
                <th>Going To</th>
              </tr>
            </thead>
            {/* populating here */}
          </table>
        </div>
        <ExitButton />
      </div>
    </div>
  );
}

//may need onload for other ones as well
onload = () => {
  populateRequests().then();
};

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

  //tests data REMOVE ONCE DONE
  const r1: request = {
    requestType: "Medicine Delivery",
    startLocation: "CDEPT002L1",
    endLocation: "CDEPT002L1",
  };
  const r2: request = {
    requestType: "Medicine Delivery",
    startLocation: "hi",
    endLocation: "me",
  };
  const r3: request = {
    requestType: "Medicine Delivery",
    startLocation: "chris",
    endLocation: "sir",
  };
  const r4: request = {
    requestType: "Medicine Delivery",
    startLocation: "XD",
    endLocation: "ww",
  };
  const r5: request = {
    requestType: "Medicine Delivery",
    startLocation: "pog",
    endLocation: "wong",
  };

  const requests: request[] = [];
  requests.push(r1);
  requests.push(r2);
  requests.push(r3);
  requests.push(r4);
  requests.push(r5);

  //fine dropdown div in the html on the page
  const table = document.getElementById("request-table");

  console.log(table);

  //for each node
  requests.forEach(function (newRequest: request) {
    //create tr element to store the record
    const tableRow = document.createElement("tr");
    //create td tags for data from record
    const reqType = document.createElement("td");
    reqType.textContent = newRequest.requestType;
    reqType.setAttribute("class", "node-id");

    const reqStartLoc = document.createElement("td");
    reqStartLoc.textContent = newRequest.startLocation;

    const reqEndLoc = document.createElement("td");
    reqEndLoc.textContent = newRequest.endLocation;

    //append data elements together to one row
    tableRow.appendChild(reqType);
    tableRow.appendChild(reqStartLoc);
    tableRow.appendChild(reqEndLoc);

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
