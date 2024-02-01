import React from "react";

// @ts-expect-error //for some reason it cant find happy-dom even though it works fine
import { HTMLInputElement } from "happy-dom";

function EdgeTable() {
  function inputFile() {
    const input = document.createElement("input");
    input.type = "file";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files[0];

      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      reader.onload = () => {
        console.log("reader");
        console.log(reader.result);
      };
    };

    input.click();
  }

  return (
    <div className={"table-container"}>
      <span className={"caption-container"}>
        <span className={"table-title"}>Current .CSV File</span>
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
      <div className={"import-and-export"}>
        <button className={"export"} onClick={inputFile}>
          Import .csv
        </button>

        <button className={"export"}>Export Current</button>
      </div>
    </div>
  );
}

export default EdgeTable;
