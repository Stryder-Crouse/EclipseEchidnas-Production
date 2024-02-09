import React from "react";

import "../../css/route-css/requestList.css";

import ServiceRequestOutputTables from "../../components/service-requests/ServiceRequestOutputTables.tsx";
import AdminPageNavBar from "../../components/navigation-bar/AdminPageNavBar.tsx";









function RequestList() {

    return (
        <div>
            <AdminPageNavBar />
            <ServiceRequestOutputTables></ServiceRequestOutputTables>
    </div>
  );



}




export default RequestList;

