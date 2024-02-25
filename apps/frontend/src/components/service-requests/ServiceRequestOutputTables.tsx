import React, {useEffect, useState} from "react";
import "../../css/component-css/ServicePage.css";
import {ReqTypes, Priorities} from "../../../../../packages/common/src/algorithms/Requests/Request.ts";

//from https://github.com/frontend-joe/react-widgets for css

import Flower_table from "./flower-request/Flower_table.tsx";
import Religious_table from "./religious-request/Religious_table.tsx";
import Medicine_table from "./medicine-request/Medicine_table.tsx";
import Status from "../../../../../packages/common/src/algorithms/Requests/Status.ts";


import Transportation_table from "./transportation-outside-request/Transportation_table.tsx";
import Sanitation_table from "./sanitation-request/Sanitation_table.tsx";
import ServiceRequest_Table from "./service-request/ServiceRequest_Table.tsx";
import PieChartStatsAll from "./Stats/PieChartStatsAll.tsx";
import PieChartStatsServiceRequest from "./Stats/PieChartStatsServiceRequest.tsx";
import {Employee} from "../../../../../packages/common/src/algorithms/Employee/Employee.ts";
import axios from "axios";

import {NodeDataBase} from "../../../../../packages/common/src/algorithms/DataBaseClasses/NodeDataBase.ts";



const statuses = [Status.Any,Status.Unassigned,Status.Assigned,Status.InProgress,Status.Completed];
const priority = [Priorities.any, Priorities.low, Priorities.medium, Priorities.high, Priorities.emergency];


export default function ServiceRequestOutputTables() {


    const [statusFilter , setStatusFilter ] = useState(Status.Any);
    const [priorityFilter , setPriorityFilter ] = useState(Priorities.any);
    const [employeeFilter , setEmployeeFilter ] = useState("Any");



    const [locationFilter , setLocationFilter ] = useState("Any");

    const [curentServiceRequest , setCurentServiceRequest ] = useState(ReqTypes.serviceRequest);

    const [statsToggle , setStatsToggle ]
        = useState(false);

    const [employeesList , setEmployeesList ]
        = useState<Employee[]>([]);
    const [locations, setLocations] = useState<NodeDataBase[]>([]);

    console.log(curentServiceRequest);
    console.log(setStatusFilter);
    console.log(locationFilter);



    useEffect(() => {
        //fetches servReqs from the db to update the frontend table

        getEmployees().then((result)=>{setEmployeesList(result);});
        getLocations().then(
            (result)=>{
                setLocations(result);


            });
    }, []);



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


                <div className={"filterDiv"}>
                    <div className={"statusFilterDiv"}>
                        <label form={"designation"}><b>Status</b></label>
                        <select
                            className={" border-black"}
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
                        <label form={"designation"}><b>Priority</b></label>
                        <select
                            className={" border-black"}
                            value={priorityFilter}
                            onChange={
                                (e) => {
                                    setPriorityFilter(e.target.value as Priorities);
                                }
                            }
                        >
                            {
                                priority?.map((prior) => {
                                    return (
                                        <option
                                            className={"statis-dropdown"}
                                            value={prior}
                                            key={prior + "_filterPrior"}
                                        >
                                            {prior}
                                        </option>
                                    );
                                })

                            }
                        </select>

                    </div>
                    <div className={"statusFilterDiv"}>
                        <label form={"designation"}><b>Location</b></label>
                        <select
                            className={""}
                            value={locationFilter}
                            onChange={
                                (e) => {
                                    //console.log(e.target.value);
                                    setLocationFilter(e.target.value);
                                }
                            }
                        >
                            <option
                                className={"statis-dropdown"}
                                value={"Any"}

                            >
                                Any
                            </option>
                            {
                                locations?.map((loc) => {
                                    return (
                                        <option
                                            className={"statis-dropdown"}
                                            value={loc.nodeID}
                                            key={loc.nodeID + "_location"}
                                        >
                                            {loc.nodeID}
                                        </option>
                                    );
                                })

                            }
                        </select>
                    </div>
                    <div className={"statusFilterDiv"}>
                        <label form={"designation"}><b>Employee</b></label>
                        <select
                            className={" w-32"}
                            value={employeeFilter}
                            onChange={
                                (e) => {
                                    setEmployeeFilter(e.target.value);
                                }
                            }
                        >
                            <option
                                className={"statis-dropdown"}
                                value={"Any"}

                            >
                                Any
                            </option>
                            {
                                employeesList?.map((emp) => {
                                    return (
                                        <option
                                            className={"statis-dropdown"}
                                            value={emp.userName}
                                            key={emp + "_filterPrior"}
                                        >
                                            {(emp.firstName + " "
                                                + emp.lastName
                                                + " (" + emp.designation + ")")}
                                        </option>
                                    );
                                })

                            }
                        </select>

                    </div>

                        {/*toggle*/}
                        <label className="flex items-center cursor-pointer ml-2 bg-transparent">
                            <input type="checkbox"
                                   checked={statsToggle}
                                   className="sr-only peer"
                                   onChange={(event) => {
                                       setStatsToggle(event.target.checked);
                                   }}
                            />
                            <div
                                className=" relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
                            dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                            peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border
                            after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-1"><b>Stats</b></span>
                        </label>



                </div>

                {/* the content to be populated with each request*/}
                {
                    generateSelectedTable()
                }
            </div>
        </div>
    );

    function generateSelectedTable() {
        // For each div/request to overlay

        if (statsToggle) {
            switch (curentServiceRequest) {
                case ReqTypes.flowReq:
                    return (<PieChartStatsServiceRequest
                        urlToGetStats={"/api/serviceRequests/flowReq/statistics"} urlForBuildingStats={"/api/serviceRequests/flowReq/building-statistics"}>
                    </PieChartStatsServiceRequest>);
                case ReqTypes.religReq:
                    return (<PieChartStatsServiceRequest
                        urlToGetStats={"/api/serviceRequests/religiousRequest/statistics"} urlForBuildingStats={"/api/serviceRequests/religiousRequest/building-statistics"}>
                    </PieChartStatsServiceRequest>);
                case ReqTypes.medReq:
                    return (<PieChartStatsServiceRequest
                        urlToGetStats={"/api/serviceRequests/medReq/statistics"} urlForBuildingStats={"/api/serviceRequests/medReq/building-statistics"}>
                    </PieChartStatsServiceRequest>);
                case ReqTypes.tranReq:
                    return (<PieChartStatsServiceRequest
                        urlToGetStats={"/api/serviceRequests/outsideTransport/statistics"} urlForBuildingStats={"/api/serviceRequests/outsideTransport/building-statistics"}>
                    </PieChartStatsServiceRequest>);
                case ReqTypes.sanReq:
                    return (<PieChartStatsServiceRequest
                        urlToGetStats={"/api/serviceRequests/sanReq/statistics"} urlForBuildingStats={"/api/serviceRequests/sanReq/building-statistics"}>
                    </PieChartStatsServiceRequest>);
                case ReqTypes.serviceRequest:
                    return (<PieChartStatsAll></PieChartStatsAll>);
                default:
                    return (<div> bad state</div>);

            }

        }

        switch (curentServiceRequest) {
            case ReqTypes.flowReq:
                return (<Flower_table statusFilter={statusFilter} priorityFilter={priorityFilter} employeeFilter={employeeFilter} locationFilter={locationFilter}/>);
            case ReqTypes.religReq:
                return (<Religious_table statusFilter={statusFilter} priorityFilter={priorityFilter} employeeFilter={employeeFilter} locationFilter={locationFilter}/>);
            case ReqTypes.medReq:
                return (<Medicine_table statusFilter={statusFilter} priorityFilter={priorityFilter} employeeFilter={employeeFilter} locationFilter={locationFilter}/>);
            case ReqTypes.tranReq:
                return (<Transportation_table statusFilter={statusFilter} priorityFilter={priorityFilter} employeeFilter={employeeFilter} locationFilter={locationFilter}/>);
            case ReqTypes.sanReq:
                return (<Sanitation_table statusFilter={statusFilter} priorityFilter={priorityFilter} employeeFilter={employeeFilter} locationFilter={locationFilter}/>);
            case ReqTypes.serviceRequest:
                return (<ServiceRequest_Table statusFilter={statusFilter} priorityFilter={priorityFilter} employeeFilter={employeeFilter} locationFilter={locationFilter}/>);
            default:
                return (<div> bad state</div>);

        }

    }


}

async function getEmployees() {
    const employees = await axios.get<Employee[]>("/api/employees/employees");
    return employees.data;

}

async function getLocations() {
    //load edges and node from database
    const nodesDB = await axios.get<NodeDataBase[]>("/api/load-nodes/byID");
    return nodesDB.data;
}
