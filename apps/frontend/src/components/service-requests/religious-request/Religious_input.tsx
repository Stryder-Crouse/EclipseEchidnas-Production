import React, {useEffect, useState} from "react";
import {CreateDropdown} from "../../CreateDropdown.tsx";
import RequestButtons from "../../buttons/RequestButtons.tsx";
import {Priority, Status} from "../priorityAndStatusEnums.tsx";
import {ReligRequest, ReqTypes, ServiceRequest} from "common/src/algorithms/Requests/Request.ts";
import axios from "axios";
import SimpleTextInput from "../../inputComponents/SimpleTextInput.tsx";
import {NodeDataBase} from "common/src/algorithms/DataBaseClasses/NodeDataBase.ts";
import {closeCard} from "../../service-request-cards/ReligionRequestCard.tsx";
import RequestSubmitToast from "../../toasts/RequestSubmitToast.tsx";


let longNames:string[] = [];

const priorityLevels =[Priority.low, "Medium", Priority.high, Priority.emergency];
export default function Religious_input({
    setIsPopupOpen
                                        }: closeCard) {

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

    let interID = setInterval(fadeEffect, 100);
    clearInterval(interID);

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
            reqPriority: priorityLevels[urgencyDDIndx],
            reqLocationID: locations[selected].nodeID,
            extraInfo: extraInfo,
            status: Status.unassigned,
            assignedUName: "No one", //should not matter
            reqID: -1, //should not matter
            time: null
        };
        console.log("urg");
        console.log(urgencyDDIndx);
        console.log(priorityLevels[urgencyDDIndx]);

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
            show();
        }
        else{
            console.log("Failed to record religious request");
        }
    }

    function show() {
        const tag: HTMLElement = document.getElementById("rel-popup") as HTMLElement;
        tag.style.opacity = "1";
        interID = setInterval(fadeEffect, 100);
    }

    function fadeEffect() {
        const target = document.getElementById("rel-popup") as HTMLElement;
        let opacity = target.style.opacity;
        if(Number(opacity) >= 0.97) {
            opacity = (Number(opacity) - 0.001).toString();
            target.style.opacity = opacity;
        } else if (Number(opacity) > 0) {
            opacity = (Number(opacity) - 0.1).toString();
            target.style.opacity = opacity;
        }

        if(Number(opacity) < 0) {
            clearInterval(interID);
        }
    }

    function closeReligiousForm(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
        event.preventDefault();
        setIsPopupOpen(false);
    }
    return (
        <div
            className={"mt-3 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl p-2 align-self-center"}>
            <form className={"p-2"}>
                <h1 className={"flex mb-3 justify-center font-bold text-xl"}>Religious Request</h1> {/* Div Title */}



                <div className={"flex"}>
                    {/* Patient Name */}
                    <div className={"flex flex-col mr-6"}>
                        <SimpleTextInput id={"name"} labelContent={"Patient Name "}
                                         inputStorage={nameP} setInputStorage={setNameP}
                                         inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                         divCSS={"grid justify-center items-center my-1.5 mb-1"} labelCSS={"mb-1"}
                                         placeHolderText={"e.g. Tim Apple"}>
                        </SimpleTextInput>

                        <div className="grid justify-center items-center my-1.5">
                            {/* Location */}
                            <label className="label">Location </label>
                            <CreateDropdown dropBtnName={"Locations"} dropdownID={"LocationReli"} isSearchable={true}
                                            populationArr={longNames} resetDropdown={resetDropdownLoc}
                                            setSelected={setSelected}
                                            inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                                            selectCSS={""}
                                            resetOnSelect={false} setResetDropdown={setResetDropdownLoc}/>

                        </div>

                        <div className={"grid justify-center items-center my-1.5 mb-1"}>
                            <label className="label">Priority </label>
                            <CreateDropdown dropBtnName={"Priority "} dropdownID={"UrgencyID"} isSearchable={false}
                                            populationArr={priorityLevels}
                                            setSelected={setUrgencyDDIndx}
                                            resetDropdown={resetDropdownUrg}
                                            resetOnSelect={false}
                                            inputCSS={"n/a"} selectCSS={"dropdown"}
                                            setResetDropdown={setResetDropdownUrg}/>
                        </div>
                    </div>
                    <div className={"flex flex-col"}>
                        {/* Religion */}
                        <div className={"grid justify-center items-center my-1.5 mb-1"}>
                            <label className="label">Religion </label>
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
                            <label className="label">Services Required </label>
                            <textarea placeholder={"e.g. Last Rights"}
                                      className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow" /*className may need to be different to have a larger area*/}
                                      onChange={(e) => setService(e.target.value)}
                                      id={"service"}
                                      value={service}
                                      required>
                    </textarea>
                        </div>
                        {/* Urgency */}

                        {/* Extra notes */}
                        <div className={"grid justify-center items-center my-1.5 mb-1"}>
                            <label className="label">Extra Notes </label>
                            <textarea placeholder={"Extra Notes"}
                                      className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow" /*className may need to be different to have a larger area*/}
                                      onChange={(e) => setExtraInfo(e.target.value)}
                                      id={"service"}
                                      value={extraInfo}
                                      >
                    </textarea>
                        </div>
                    </div>
                </div>




                <RequestButtons submit={handleSubmit}/>

            </form>
            <div className={"grid justify-center items-center m-auto my-1.5 mb-5"}>
                <button onClick={(event) => closeReligiousForm(event)} className={
                    "bg-tableText p-1 rounded-xl w-24 font-bold cursor-pointer flex justify-center m-auto mb-2 mt-5"}>
                    Close
                </button>

                <p className={"flex justify-center items-center mt-5"}>Created By: Alana and Grace</p>
            </div>
            <div id={"rel-popup"} className={"text-center flex justify-center m-auto opacity-0 "}>
                <RequestSubmitToast/>
            </div>
        </div>
    );


}


async function getLocations() {
    //load edges and node from database
    const nodesDB = await axios.get<NodeDataBase[]>("/api/load-nodes");
    return nodesDB.data;
}
