
import FullSideNavBarComponent from "../../components/FullSideNavBarComponent.tsx";
import CsvPageTableContainer from "../../components/csvPage/CsvPageTableContainer.tsx";


function NodeEdgeTablePage() {
    return(
        <div className="flex h-screen overflow-x-hidden">
            <div className="z-10">
                <FullSideNavBarComponent/>
            </div>
            <div className="flex items-center justify-center w-full  min-w-[100%] mt-5 -ml-[7.5%]">
                <CsvPageTableContainer/>
            </div>
        </div>

    );
}

export default NodeEdgeTablePage;
