//import React, {useEffect, useState} from "react";
//import axios from "axios";
import {statusFilter} from "../serviceRequestInterface.ts";
//import {FlowReq, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";

export default function Flower_table({statusFilter:statusFilter}:statusFilter) {
    console.log(statusFilter);

    // const [data, setData] = useState<{ flowReqs: FlowReq[]; serviceReqs: ServiceRequest[]; }>({flowReqs: [], serviceReqs: []});
    //
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(`/api/serviceRequests/flowReq?status=${statusFilter}`);
    //             setData({
    //                 flowReqs: response.data[0],
    //                 serviceReqs: response.data[1],
    //             });
    //         } catch (error) {
    //             console.error("Error fetching requests");
    //         }
    //     };
    //
    //     fetchData();
    //
    // }, [statusFilter]); // Execute the effect whenever statusFilter changes

    return (
        <div >
            {/* make your table in here  */}
            Flower request table
        </div>
    );


}
