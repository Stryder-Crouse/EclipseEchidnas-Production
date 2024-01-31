import React, { useEffect } from "react";
import ExitButton from "../components/ExitButton.tsx";
import "../css/requestList.css";
function RequestList() {
  useEffect(() => {
    //set background to first floor on component load
    document.body.style.backgroundColor =
      "url(/src/images/backgroundHospitalImage.jpg)";
  }, []);

  return (
    <div className={"table-container"}>
      <span className={"caption-container"}>
        <span className={"table-title"}>Request Log</span>
      </span>
      <div className={"table-wrapper"}>
        <table>
          <thead>
            <tr>
              <th>Request Type</th>
              <th>From</th>
              <th>Going To</th>
              <th>Placeholder</th>
            </tr>
          </thead>
          <tbody id={"table-rows"}>
            <tr>
              <td className={"node-id"}>Medicine</td>
              <td>CDEPT002L1</td>
              <td>CDEPT003L1</td>
              <td>Placeholder</td>
            </tr>
            <tr>
              <td className={"node-id"}>Medicine</td>
              <td>CDEPT002L1</td>
              <td>CDEPT003L1</td>
              <td>Placeholder</td>
            </tr>
            <tr>
              <td className={"node-id"}>Medicine</td>
              <td>CDEPT002L1</td>
              <td>CDEPT003L1</td>
              <td>Placeholder</td>
            </tr>
            <tr>
              <td className={"node-id"}>Medicine</td>
              <td>CDEPT002L1</td>
              <td>CDEPT003L1</td>
              <td>Placeholder</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ExitButton />
    </div>
  );
}

export default RequestList;
