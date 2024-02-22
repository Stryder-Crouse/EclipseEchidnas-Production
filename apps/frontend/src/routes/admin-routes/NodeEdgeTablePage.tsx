
import FullSideNavBarComponent from "../../components/FullSideNavBarComponent.tsx";
import ImportExportButtons from "../../components/NodeAndEdgeTable/ImportExportButtons.tsx";
import NodeTable from "../../components/NodeAndEdgeTable/NodeTable.tsx";
import EdgeTable from "../../components/NodeAndEdgeTable/EdgeTable.tsx";

function NodeEdgeTablePage() {
    return(
        <div className="flex h-lvh">
            <div className="z-10">
                <FullSideNavBarComponent/>
            </div>
            <div className="flex flex-col w-lvw -ml-10">
                <ImportExportButtons/>
                <NodeTable/>
                <EdgeTable/>
            </div>

        </div>
    );
}

export default NodeEdgeTablePage;
