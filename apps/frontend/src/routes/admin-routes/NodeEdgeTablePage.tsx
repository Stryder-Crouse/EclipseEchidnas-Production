
import React from "react";
//import ExitButton from "../../components/buttons/ExitButton.tsx";
import AdminPageNavBar from "../../components/navigation-bar/AdminPageNavBar.tsx";
import NodeTable from "../../components/NodeAndEdgeTable/NodeTable.tsx";
import EdgeTable from "../../components/NodeAndEdgeTable/EdgeTable.tsx";
import ImportExportButtons from "../../components/NodeAndEdgeTable/ImportExportButtons.tsx";

function NodeEdgeTablePage() {
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
export default NodeEdgeTablePage;
