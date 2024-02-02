import "../css/file-table.css";
import React from "react";
import ExitButton from "../components/ExitButton.tsx";
import AdminPageNavBar from "../components/AdminPageNavBar.tsx";
import NodeTable from "../components/NodeAndEdgeTable/NodeTable.tsx";
import EdgeTable from "../components/NodeAndEdgeTable/EdgeTable.tsx";
import ImportExportButtons from "../components/NodeAndEdgeTable/ImportExportButtons.tsx";

function FileTable() {
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
