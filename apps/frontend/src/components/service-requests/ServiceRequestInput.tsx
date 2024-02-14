import React, {useState} from "react";
import "../../css/component-css/ServicePage.css";
import {ReqTypes} from "../../../../backend/src/algorithms/Requests/Request.ts";

//from https://github.com/frontend-joe/react-widgets for css
import Flower_input from "./flower-request/Flower_input.tsx";
import Religious_input from "./religious-request/Religious_input.tsx";
import Medicine_input from "./medicine-request/Medicine_input.tsx";
import Transportation_Input from "./transportation-outside-request/Transportation_Input.tsx";
import Sanitation_input from "./sanitation-request/Sanitation_input.tsx";

export default function ServiceRequestInput() {


    //const [statusFilter , setStatusFilter ] = useState("");
    const [curentServiceRequest , setCurentServiceRequest ] = useState(ReqTypes.flowReq);
    console.log(curentServiceRequest);

    // useEffect(() => {
    //
    //
    // }, []);

    return (
        <div className="tabs-container">
            <ul className="tabs">
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
                {/* the content to be populated with each request */}
                {
                    generateSelectedTable()
                }
            </div>
        </div>
    );

    function generateSelectedTable(){
        // For each div/request to overlay
        switch(curentServiceRequest)
        {
            case ReqTypes.flowReq:
                return (<Flower_input/>);
            case ReqTypes.religReq:
                return (<Religious_input/>);
            case ReqTypes.medReq:
                return (<Medicine_input/>);
            case ReqTypes.tranReq:
                return (<Transportation_Input/>);
            case ReqTypes.sanReq:
                return (<Sanitation_input/>);
            default:
                return(<div> bad state</div>);

        }

    }


}
