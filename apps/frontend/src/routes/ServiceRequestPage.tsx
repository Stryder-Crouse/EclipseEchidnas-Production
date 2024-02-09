/** importations **/
import React from "react";
import "../css/route-css/medicineRequest.css";
import AdminPageNavBar from "../components/navigation-bar/AdminPageNavBar.tsx";

import ServiceRequestInput from "../components/service-requests/ServiceRequestInput.tsx";

export default function ServiceRequestPage() {


  return (
    <div>
      <AdminPageNavBar />
      <ServiceRequestInput/>
    </div>
  );
}
