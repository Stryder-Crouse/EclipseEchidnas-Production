
import FullSideNavBarComponent from "../../components/FullSideNavBarComponent.tsx";
import CsvPageTableContainer from "../../components/csvPage/CsvPageTableContainer.tsx";
import ImportExportButtons from "../../components/NodeAndEdgeTable/ImportExportButtons.tsx";

function NodeEdgeTablePage() {
    return(
        <div className="flex h-lvh">
            <div className="z-10">
                <FullSideNavBarComponent/>
            </div>
            <div className={"flex flex-col w-lvw -ml-10"}>
                <div className={""}>
                    <ImportExportButtons/>
                </div>
                <div >
                    <CsvPageTableContainer/>
                </div>
            </div>


        </div>
    );
}

export default NodeEdgeTablePage;
