import React from "react";
import ServiceRequestOutputTables from "../../components/service-requests/ServiceRequestOutputTables.tsx";
import FullSideNavBarComponent from "../../components/FullSideNavBarComponent.tsx";
//import ServiceRequestStats from "../../components/service-requests/ServiceRequestStats.tsx";
import PieChartStatsAll from "../../components/service-requests/StatsPie/PieChartStatsAll.tsx";
function RequestList() {

    return (
        <div className="flex h-lvh">
            <FullSideNavBarComponent/>
            <ServiceRequestOutputTables></ServiceRequestOutputTables>
            <PieChartStatsAll></PieChartStatsAll>
        </div>
    );


}


export default RequestList;

