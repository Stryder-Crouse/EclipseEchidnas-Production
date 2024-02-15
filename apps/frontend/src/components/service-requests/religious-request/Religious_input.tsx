import React, {useEffect, useState} from "react";
import {CreateDropdown} from "../../CreateDropdown.tsx";
import RequestButtons from "../../buttons/RequestButtons.tsx";
import {Priority, Status} from "../priorityAndStatusEnums.tsx";
import {ReligRequest, ReqTypes, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import axios from "axios";
import SimpleTextInput from "../../inputComponents/SimpleTextInput.tsx";
import {NodeDataBase} from "../../../../../backend/src/DataBaseClasses/NodeDataBase.ts";

let longNames:string[] = [];

const priority =[Priority.low, Priority.normal, Priority.high, Priority.emergency];
export default function Religious_input() {
    const [service, setService] = useState("");
    const [nameP, setNameP] = useState("");

    const [extraInfo, setExtraInfo] = useState("");

    const [religionDDIndx, setReligionDDIndx] = useState(-1);
    const [urgencyDDIndx, setUrgencyDDIndx] = useState(-1);

    const [resetDropdownRel, setResetDropdownRel] = useState(false);
    const [resetDropdownUrg, setResetDropdownUrg] = useState(false);

    const [resetDropdownLoc, setResetDropdownLoc] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [locations, setLocations] = useState<NodeDataBase[]>([]);

    const religions = [
        "Buddhism",
        "Christianity (Catholicism)",
        "Christianity (Mormonism)",
        "Christianity (Non-Denominational)",
        "Christianity (Protestantism)",
        "Hinduism",
        "Islam",
        "Jainism",
        "Judaism",
        "Sikhism",
        "Shinto",
        "Other"];

    useEffect(()=>{
        getLocations().then(
            (result)=>{

                const locationLongName:string[] = [];
                setLocations(result);
                result.forEach((node)=>{ locationLongName.push(node.longName);});
                longNames=locationLongName;

            });

    },[]);
    async function handleSubmit() {
        //send to backend
        const data1: ReligRequest = {
            patientName: nameP,
            religion: religions[religionDDIndx],
            reqDescription: service,
            genReqID: -1,
        };
        const data0:ServiceRequest = {
            reqType: ReqTypes.religReq,
            reqPriority: priority[urgencyDDIndx],
            reqLocationID: locations[selected].nodeID,
            extraInfo: extraInfo,
            status: Status.unassigned,
            assignedUName: "No one", //should not matter
            reqID: -1 //should not matter
        };

        console.log(urgencyDDIndx);

        //clear fields
        setService("");
        setResetDropdownRel(true);
        setResetDropdownUrg(true);
        setNameP("");
        setResetDropdownLoc(true);
        setExtraInfo("");

        const res = await axios.post("/api/serviceRequests/religiousRequest", [data0,data1], {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.status === 200) {
            console.log("recorded religious request");
        }
        else{
            console.log("Failed to record religious request");
        }
    }

    return (
        <div className={"mt-3 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl p-2 align-self-center"}>
            <form className={"p-1"}>
                <h1 className={"flex mb-3 justify-center font-bold text-xl"}>Religious Request</h1> {/* Div Title */}
                {/* Location */}

                <div className="grid justify-center items-center my-1.5">

                    <label className="label">Location </label>
                    <CreateDropdown dropBtnName={"Locations"} dropdownID={"Location___"} isSearchable={true}
                                    populationArr={longNames} resetDropdown={resetDropdownLoc}
                                    setSelected={setSelected}
                                    inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                                    selectCSS={""}
                                    resetOnSelect={false} setResetDropdown={setResetDropdownLoc}/>

                </div>


                {/* Patient Name */}
                <SimpleTextInput id={"name"} labelContent={"Patient Name"}
                                 inputStorage={nameP} setInputStorage={setNameP}
                                 inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                 divCSS={"grid justify-center items-center my-1.5 mb-1"} labelCSS={"mb-1"}
                                 placeHolderText={"Patient Name"}>
                </SimpleTextInput>
                {/* Religion */}
                <div className={"grid justify-center items-center my-1.5 mb-1"}>
                    <CreateDropdown dropBtnName={"Religion"} dropdownID={"ReligionID"} isSearchable={false}
                                    populationArr={religions}
                                    setSelected={setReligionDDIndx}
                                    resetDropdown={resetDropdownRel}
                                    resetOnSelect={false}
                                    inputCSS={"n/a"} selectCSS={"dropdown"}
                                    setResetDropdown={setResetDropdownRel}/>
                </div>
                {/* Description */}
                <div className={"grid justify-center items-center my-1.5 mb-1"}>
                    <textarea placeholder={"Describe the religious service to be performed here."}
                              className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow" /*className may need to be different to have a larger area*/}
                              onChange={(e) => setService(e.target.value)}
                              id={"service"}
                              value={service}
                              required>
                    </textarea>
                </div>
                {/* Urgency */}
                <div className={"grid justify-center items-center my-1.5 mb-1"}>
                    <CreateDropdown dropBtnName={"Urgency"} dropdownID={"UrgencyID"} isSearchable={false}
                                    populationArr={priority}
                                    setSelected={setUrgencyDDIndx}
                                    resetDropdown={resetDropdownUrg}
                                    resetOnSelect={false}
                                    inputCSS={"n/a"} selectCSS={"dropdown"}
                                    setResetDropdown={setResetDropdownUrg}/>
                </div>
                {/* Extra notes */}
                <div className={"grid justify-center items-center my-1.5 mb-1"}>
                    <textarea placeholder={"Any extra notes?"}
                              className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow" /*className may need to be different to have a larger area*/}
                              onChange={(e) => setExtraInfo(e.target.value)}
                              id={"service"}
                              value={extraInfo}
                              required>
                    </textarea>
                </div>
                <RequestButtons submit={handleSubmit}/>
                <p className={"flex justify-center items-center -mt-5"}>Created By: Alana and Grace</p>
                {/*// this should technically take you to list of service request*/}
            </form>
        </div>
    );


}


async function getLocations() {
    //load edges and node from database
    const nodesDB = await axios.get<NodeDataBase[]>("/api/load-nodes");
    return nodesDB.data;
}
