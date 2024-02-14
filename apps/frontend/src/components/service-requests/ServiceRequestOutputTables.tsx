import React, {useState} from "react";
import "../../css/component-css/ServicePage.css";
import {ReqTypes} from "../../../../backend/src/algorithms/Requests/Request.ts";

//from https://github.com/frontend-joe/react-widgets for css

import Flower_table from "./flower-request/Flower_table.tsx";
import Religious_table from "./religious-request/Religious_table.tsx";
import Medicine_table from "./medicine-request/Medicine_table.tsx";
import status from "../../../../backend/src/algorithms/Requests/Status.ts";

import Transportation_table from "./transportation-outside-request/Transportation_table.tsx";
import Sanitation_table from "./sanitation-request/Sanitation_table.tsx";
import ServiceRequest_Table from "./service-request/ServiceRequest_Table.tsx";

export default function ServiceRequestOutputTables() {


    const [statusFilter , setStatusFilter ] = useState(status.Any);

    const [curentServiceRequest , setCurentServiceRequest ] = useState(ReqTypes.serviceRequest);
    console.log(curentServiceRequest);
    console.log(setStatusFilter);

    // useEffect(() => {
    //
    //
    // }, []);

    return (
        <div className="tabs-container">
            <ul className="tabs">
                <li>
                    <a id={"button_" + ReqTypes.flowReq} title="Flower Request" className={"tabButton"} onClick={() => {
                        setCurentServiceRequest(ReqTypes.serviceRequest);
                    }}>
                        Service Requests
                    </a>
                </li>
                <li>
                    <a id={"button_" + ReqTypes.flowReq} title="Flower Request" className={"tabButton"} onClick={() => {
                        setCurentServiceRequest(ReqTypes.flowReq);
                    }}>
                        Flower Request
                    </a>
                </li>
                <li>
                    <a id={"button_" + ReqTypes.religReq} title="Religious Request" className={"tabButton"}
                       onClick={() => {
                           setCurentServiceRequest(ReqTypes.religReq);
                       }}>
                        Religious Request
                    </a>
                </li>
                <li>
                    <a id={"button_" + ReqTypes.medReq} title="Medicine Request" className={"tabButton"}
                       onClick={() => {
                           setCurentServiceRequest(ReqTypes.medReq);
                       }}>
                        Medicine Request
                    </a>
                </li>
                <li>
                    <a id={"button_" + ReqTypes.tranReq} title="Transportation Request" className={"tabButton"}
                       onClick={() => {
                           setCurentServiceRequest(ReqTypes.tranReq);
                       }}>
                        Transportation Request
                    </a>
                </li>
                <li>
                    <a id={"button_" + ReqTypes.sanReq} title="Sanitation Request" className={"tabButton"}
                       onClick={() => {
                           setCurentServiceRequest(ReqTypes.sanReq);
                       }}>
                        Sanitation Request
                    </a>
                </li>

            </ul>
            <div className="tab-content-wrapper">
                {/* the content to be populated with each request*/}
                {
                    generateSelectedTable()
                }
            </div>
        </div>
    );

    function generateSelectedTable() {
        // For each div/request to overlay
        switch(curentServiceRequest)
        {
            case ReqTypes.flowReq:
                return (<Flower_table statusFilter={statusFilter}/>);
            case ReqTypes.religReq:
                return (<Religious_table statusFilter={statusFilter}/>);
            case ReqTypes.medReq:
                return (<Medicine_table statusFilter={statusFilter}/>);
            case ReqTypes.tranReq:
                return (<Transportation_table statusFilter={statusFilter}/>);
            case ReqTypes.sanReq:
                return (<Sanitation_table statusFilter={statusFilter}/>);
            case ReqTypes.serviceRequest:
                return (<ServiceRequest_Table statusFilter={statusFilter}/>);
            default:
                return(<div> bad state</div>);

        }

    }


}
