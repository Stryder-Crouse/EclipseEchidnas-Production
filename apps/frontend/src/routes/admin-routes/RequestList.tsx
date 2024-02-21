import React from "react";
import ServiceRequestOutputTables from "../../components/service-requests/ServiceRequestOutputTables.tsx";
import FullSideNavBarComponent from "../../components/FullSideNavBarComponent.tsx";
//import ServiceRequestStats from "../../components/service-requests/ServiceRequestStats.tsx";
import PieChartStatsPriority from "../../components/service-requests/PieChartStatsPriority.tsx";
import PieChartStatsType from "../../components/service-requests/PieChartStatsType.tsx";
import PieChartStatsStatus from "../../components/service-requests/PieChartStatsStatus.tsx";
function RequestList() {

    return (
        <div className="flex h-lvh">
            <FullSideNavBarComponent/>
            <ServiceRequestOutputTables></ServiceRequestOutputTables>

            <PieChartStatsPriority></PieChartStatsPriority>
            <PieChartStatsType></PieChartStatsType>
            <PieChartStatsStatus></PieChartStatsStatus>
        </div>
    );


}


export default RequestList;

