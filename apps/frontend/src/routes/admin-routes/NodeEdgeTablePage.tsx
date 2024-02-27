
import FullSideNavBarComponent from "../../components/FullSideNavBarComponent.tsx";
import CsvPageTableContainer from "../../components/csvPage/CsvPageTableContainer.tsx";


function NodeEdgeTablePage() {
    return(
        <div className="flex h-screen overflow-x-hidden">
            <div className="z-10">
                <FullSideNavBarComponent/>
            </div>
            <div className="relative justify-center  items-center m-auto ">
                <CsvPageTableContainer/>
            </div>
        </div>

    );
}

export default NodeEdgeTablePage;
