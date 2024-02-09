import React from "react";
import {statusFilter} from "../serviceRequestInterface.ts";




export default function Medicine_table({statusFilter:statusFilter}:statusFilter) {
    console.log(statusFilter);

    return (
        <div>
            {/* make your table in here  */}
            Medicine request table
        </div>
    );


}
