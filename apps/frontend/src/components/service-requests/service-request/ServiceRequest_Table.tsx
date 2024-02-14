import React from "react";
import {statusFilter} from "../serviceRequestInterface.ts";




export default function ServiceRequest_Table({statusFilter:statusFilter}:statusFilter) {
    console.log(statusFilter);

    return (
        <div >
            {/* make your table in here  */}
            Service request table
        </div>
    );


}
