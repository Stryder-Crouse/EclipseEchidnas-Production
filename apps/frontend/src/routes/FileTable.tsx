import "../css/file-table.css";
import React, { useEffect } from "react";
import ExitButton from "../components/ExitButton.tsx";
import AdminPageNavBar from "../components/AdminPageNavBar.tsx";
import NodeTable from "../components/NodeAndEdgeTable/NodeTable.tsx";
import EdgeTable from "../components/NodeAndEdgeTable/EdgeTable.tsx";
import ImportExportButtons from "../components/NodeAndEdgeTable/ImportExportButtons.tsx";

function FileTable() {
  useEffect(() => {
    //set background to first floor on component load
    document.body.style.backgroundColor =
      "url(/src/images/backgroundHospitalImage.jpg)";
  }, []);

  return (
    <div>
      <div>
        <AdminPageNavBar />
      </div>
      <div className={"nodeEdge-container"}>
        <ImportExportButtons />
        <NodeTable />
        <EdgeTable />
      </div>
      <div>
        <ExitButton />
      </div>
    </div>
  );
}

// <div className={"sideBySideTables"} style={
//     {
//         position: "fixed",
//         textAlign: "center",
//
//     }}>
//
// </div>
export default FileTable;
