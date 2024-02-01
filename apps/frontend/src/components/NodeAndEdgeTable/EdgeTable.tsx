import React from "react";

function EdgeTable() {
  return (
    <div className={"table-container"}>
      <span className={"caption-container"}>
        <span className={"table-title"}>Current Edge .CSV File</span>
      </span>
      <div className={"table-wrapper"}>
        <table>
          <thead>
            <tr>
              <th>edgeID</th>
              <th>startNode</th>
              <th>endNode</th>
            </tr>
          </thead>
          <tbody id={"table-rows"}>
            <tr>
              <td className={"node-id"}>CHALL008</td>
              <td>2255</td>
              <td>849</td>
            </tr>
            <tr>
              <td className={"node-id"}>CCONF002L1</td>
              <td>2665</td>
              <td>1043</td>
            </tr>
            <tr>
              <td className={"node-id"}>CCONF003L1</td>
              <td>2445</td>
              <td>1245</td>
            </tr>
            <tr>
              <td className={"node-id"}>CDEPT002L1</td>
              <td>1980</td>
              <td>844</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EdgeTable;
