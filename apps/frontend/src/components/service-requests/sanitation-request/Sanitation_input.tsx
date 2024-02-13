import React, {ChangeEvent, useState} from "react";
import {ReqTypes, sanReq, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import axios from "axios";
import RequestButtons from "../../buttons/RequestButtons.tsx";



export default function Sanitation_input() {
    const [sanitationLocation, setSanitationLocation] = useState("");
    const [priority,setPriority] = useState("");
    const [type,setType] = useState("");
    const [extraInfo,setExtraInfo] = useState("");

    async function submit() {


        try {
            //Make a Service Request Data Type and then a Med Request Data Type
            // this is bc Front End will be confused if we pass it a bunch of data so use data structures
            const servReq : ServiceRequest = {
                reqType: ReqTypes.sanReq,           //Set req type to med req automatically bc we only make med reqs
                reqLocationID: sanitationLocation,    //Need to know location of where the service request needs to be
                extraInfo: extraInfo,                      //no extra info is asked for a med req so just ignore (empty string)
                assignedUName: "No one",            //upon creation, no employee is assigned
                status: "Unassigned",             //upon creation, nobody is assigned, so set status to unassigned
                reqID:-1,
                reqPriority: priority
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
        setSanitationLocation("");
        setType("");
        setExtraInfo("");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sanitationLocationChange = (e:ChangeEvent<HTMLSelectElement>) => {
        setSanitationLocation(e.target.value);
    };

    return (
            <div
                className={"justify-items-center text-2xl border-2 border-gray-400 rounded-2xl p-10 flex flex-col gap-5 rounded-2"}>
                <p><b>Sanitation Requests</b></p>
                <div className="form-group">
                    <label className="label">Location: </label>
                    <input
                        value={sanitationLocation}
                        onChange={(e) => {
                            setSanitationLocation(e.target.value);
                        }}
                        type={"text"}
                        className={"border-2 p-2 border-black rounded-2xl grow"}
                    />
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
                    <label className="label">Priority </label>
                    <select
                        id={"priorityType"}
                        name={"priorityType"}
                        value={priority}
                        onChange={(e) => {
                            setPriority(e.target.value);
                        }}
                        className={"px-10 gap-5 py-3 flex flex-col rounded-2 border-white"}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Emergency">Emergency</option>
                    </select>
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
