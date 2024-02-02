// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { HTMLInputElement } from "happy-dom";
import React from "react";

function ImportExportButtons() {
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
    <div className={"import-and-export"}>
      <button className={"export"} onClick={inputFile}>
        Import .csv
      </button>
      <button className={"export"}>Export Current</button>
    </div>
  );
}

export default ImportExportButtons;
