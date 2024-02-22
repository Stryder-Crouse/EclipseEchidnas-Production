import React from "react";
import ServiceRequestOutputTables from "../../components/service-requests/ServiceRequestOutputTables.tsx";
import FullSideNavBarComponent from "../../components/FullSideNavBarComponent.tsx";
//import ServiceRequestStats from "../../components/service-requests/ServiceRequestStats.tsx";

function RequestList() {

    return (
        <div className="flex h-lvh">
            <FullSideNavBarComponent/>
            <ServiceRequestOutputTables></ServiceRequestOutputTables>
        </div>
    );


}


export default RequestList;

