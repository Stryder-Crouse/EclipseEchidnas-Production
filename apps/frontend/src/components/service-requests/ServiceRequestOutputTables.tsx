import React, {useState,useEffect} from "react";
import "../../css/component-css/ServicePage.css";
import axios from "axios";
import {ReqTypes, Priorities} from "../../../../backend/src/algorithms/Requests/Request.ts";
import {CreateDropdown} from "../CreateDropdown.tsx";
//from https://github.com/frontend-joe/react-widgets for css
import Flower_table from "./flower-request/Flower_table.tsx";
import Religious_table from "./religious-request/Religious_table.tsx";
import Medicine_table from "./medicine-request/Medicine_table.tsx";
import Status from "../../../../backend/src/algorithms/Requests/Status.ts";

import Transportation_table from "./transportation-outside-request/Transportation_table.tsx";
import Sanitation_table from "./sanitation-request/Sanitation_table.tsx";
import ServiceRequest_Table from "./service-request/ServiceRequest_Table.tsx";
import {NodeDataBase} from "../../../../backend/src/DataBaseClasses/NodeDataBase.ts";
import {Employee} from "../../../../backend/src/algorithms/Employee/Employee.ts";

const type = [ReqTypes.medReq,ReqTypes.religReq,ReqTypes.flowReq,ReqTypes.sanReq,ReqTypes.tranReq,ReqTypes.serviceRequest];
const priority = [Priorities.any,Priorities.low,Priorities.medium,Priorities.high,Priorities.emergency];
const statuses = [Status.Any,Status.Unassigned,Status.Assigned,Status.InProgress,Status.Completed];


let longNames:string[] = [];
let longerNames:string[] = [];
export default function ServiceRequestOutputTables() {

    const [PriorityFilter, setPriorityFilter] = useState<Priorities>(Priorities.any);
   const [resetDropdown, setResetDropdown] = useState(false);
    //const [selected, setSelected] = useState();
    const [statusFilter , setStatusFilter ] = useState(Status.Any);
    const [curentServiceRequest , setCurentServiceRequest ] = useState(ReqTypes.serviceRequest);
    //const [locations, setLocations] = useState<NodeDataBase[]>([]);
    const [selected, setSelected] = useState(-1);
    console.log(curentServiceRequest);
    console.log(setStatusFilter);
    console.log(selected);

    useEffect(()=>{
        getLocations().then(
            (result)=>{

                const locationLongName:string[] = [];
                //setLocations(result);
                result.forEach((node)=>{ locationLongName.push(node.longName);});
                longNames=locationLongName;

            });

    },[]);

    useEffect(()=>{
        getEmployees().then(
            (result)=>{

                const EmployeeLongName:string[] = [];
                //setLocations(result);
                result.forEach((node)=>{ EmployeeLongName.push(node.userName);});
                longerNames=EmployeeLongName;

            });

    },[]);


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
                <div className={"flex"}>

                    <div className={"statusFilterDiv"}>
                        <label form={"designation"}><b>Priority</b></label><br/>
                        <select
                            value={PriorityFilter}
                            onChange={
                                (e) => {
                                    setPriorityFilter(e.target.value as Priorities);
                                }
                            }
                        >
                            {
                                priority?.map((priority) => {
                                    return (
                                        <option
                                            className={"statis-dropdown"}
                                            value={priority}
                                            key={priority + "_filterStatus"}
                                        >
                                            {priority}
                                        </option>
                                    );
                                })
                            }
                        </select>

                    </div>

                    <div className={"statusFilterDiv"}>
                        <label form={"designation"}><b>Status</b></label><br/>
                        <select
                            value={statusFilter}
                            onChange={
                                (e) => {
                                    setStatusFilter(e.target.value as Status);
                                }
                            }
                        >
                            {
                                statuses?.map((stat) => {
                                    return (
                                        <option
                                            className={"statis-dropdown"}
                                            value={stat}
                                            key={stat + "_filterStatus"}
                                        >
                                            {stat}
                                        </option>
                                    );
                                })

                            }
                        </select>

                    </div>

                    <div className={"statusFilterDiv"}>
                        <label form={"designation"}><b>Request Specific</b></label><br/>
                        <select
                            value={curentServiceRequest}
                            onChange={
                                (e) => {
                                    setCurentServiceRequest(e.target.value as ReqTypes);
                                }
                            }
                        >
                            {
                                type?.map((ReqTypes) => {
                                    return (
                                        <option
                                            className={"statis-dropdown"}
                                            value={ReqTypes}
                                            key={ReqTypes + "_filterStatus"}
                                        >
                                            {ReqTypes}
                                        </option>
                                    );
                                })
                            }
                        </select>

                    </div>

                    <div className={"statusFilterDiv"}>
                        <label className="label">Location </label>
                        <CreateDropdown dropBtnName={"Locations"} dropdownID={"LocationFlow"} isSearchable={true}
                                        populationArr={longNames} resetDropdown={resetDropdown}
                                        setSelected={setSelected}
                                        inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                                        selectCSS={""}
                                        resetOnSelect={false} setResetDropdown={setResetDropdown}/>
                    </div>

                    <div className={"statusFilterDiv"}>
                        <label className="label"> Employees </label>
                        <CreateDropdown dropBtnName={"Employees"} dropdownID={"Employee Names"} isSearchable={true}
                                        populationArr={longerNames} resetDropdown={resetDropdown}
                                        setSelected={setSelected}
                                        inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                                        selectCSS={""}
                                        resetOnSelect={false} setResetDropdown={setResetDropdown}/>
                    </div>
                </div>
                {
                    generateSelectedTable()
                }
            </div>


        </div>
    );


    function generateSelectedTable() {
        // For each div/request to overlay
        switch (curentServiceRequest) {
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
                return (<div> bad state</div>);

        }

    }


}

async function getLocations() {
    //load edges and node from database
    const nodesDB = await axios.get<NodeDataBase[]>("/api/load-nodes");
    return nodesDB.data;
}


async function getEmployees()  {
    const employees = await axios.get<Employee[]>("/api/employees/employees");
    return employees.data;
}
