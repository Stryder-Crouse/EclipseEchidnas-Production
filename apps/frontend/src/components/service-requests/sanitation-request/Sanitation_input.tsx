import React, { useEffect, useState} from "react";
import {ReqTypes, sanReq, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import axios from "axios";
import RequestButtons from "../../buttons/RequestButtons.tsx";
import {CreateDropdown} from "../../CreateDropdown.tsx";
import {NodeDataBase} from "../../../../../backend/src/DataBaseClasses/NodeDataBase.ts";







const longNames:string[] = [];


export default function Sanitation_input() {

    const [type,setType] = useState("");
    const [extraInfo,setExtraInfo] = useState("");

    const [resetDropdownPriority, setResetDropdownPriority] = useState(false);
    const [priorityIndex, setPriorityIndex] = useState(-1);

    const [resetDropdown, setResetDropdown] = useState(false);
    const [selected, setSelected] = useState(-1);

    const [locations, setLocations] = useState<NodeDataBase[]>([]);

    const priorityArr = ["Low", "Medium", "High", "Emergency"];


    useEffect(()=>{
        getLocations().then(
            (result)=>{
                setLocations(result);
                result.forEach((node)=>{ longNames.push(node.longName);});

            });

    },[]);



        async function submit() {


        try {
            //Make a Service Request Data Type and then a Med Request Data Type
            // this is bc Front End will be confused if we pass it a bunch of data so use data structures
            const servReq : ServiceRequest = {
                reqType: ReqTypes.sanReq,           //Set req type to med req automatically bc we only make med reqs
                reqLocationID: locations[selected].nodeID,    //Need to know location of where the service request needs to be
                extraInfo: extraInfo,                      //no extra info is asked for a med req so just ignore (empty string)
                assignedUName: "No one",            //upon creation, no employee is assigned
                status: "Unassigned",             //upon creation, nobody is assigned, so set status to unassigned
                reqID:-1,
                reqPriority: priorityArr[priorityIndex]
            };

            //Make a Med Req after the service req (Med req needs service req's id, so med req cannot be made before)
            const sanReqData: sanReq = {
                serviceReqID: -1, // default is 0, but is always changed to the value of the newly created Service Req
                type: type
            };
            clear();

            //Post Med Req to DB (pass in objects of sanReq and ServiceRequest as an array)
            await axios.post("/api/serviceRequests/sanReq",
                [servReq,sanReqData], {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });


        } catch {
            console.error("Error with trying to save Service Req in ServiceRequestPage.tsx");
        }


    }

    function clear() {

        setType("");
        setExtraInfo("");
        setResetDropdownPriority(true);
        setResetDropdown(true);
    }



    return (
            <div
                className={"justify-items-center text-2xl border-2 border-gray-400 rounded-2xl p-10 flex flex-col gap-5 rounded-2"}>
                <p><b>Sanitation Requests</b></p>
                <div className="form-group">
                    <label className={"location"}>Location</label>
                    <CreateDropdown dropBtnName={"Locations"} dropdownID={"Location"} isSearchable={true}
                                    populationArr={longNames} resetDropdown={resetDropdown}
                                    setSelected={setSelected}
                                    inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                                    selectCSS={""}
                                    resetOnSelect={false} setResetDropdown={setResetDropdown}/>
                </div>
                <div className="form-group">
                    <label className="label">What Happened: </label>
                    <input
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                        }}
                        type={"text"}
                        className={"border-2 p-2 border-black rounded-2xl grow"}
                    />
                </div>
                <div className="form-group">
                    <label className={"Priority"}>Priority</label>
                    <CreateDropdown
                        dropBtnName={"Priority"}
                        dropdownID={"Priority"}
                        populationArr={priorityArr}
                        isSearchable={false}
                        resetOnSelect={false}
                        resetDropdown={resetDropdownPriority}
                        setResetDropdown={setResetDropdownPriority}
                        setSelected={setPriorityIndex}
                        selectCSS={""}
                        inputCSS={""}
                    />

                </div>
                <div className="form-group">
                    <label className="label">Extra Info: </label>
                    <input
                        value={extraInfo}
                        onChange={(e) => {
                            setExtraInfo(e.target.value);
                        }}
                        type={"text"}
                        className={"border-2 p-10 border-black rounded-2xl grow"}
                    />
                </div>
                <RequestButtons submit={submit}/>
            </div>
    );


}

async function getLocations() {
    //load edges and node from database
    const nodesDB = await axios.get<NodeDataBase[]>("/api/load-nodes");
    return nodesDB.data;
}
