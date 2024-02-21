/** importations **/
import React, {useEffect, useState} from "react";
import RequestButtons from "../../buttons/RequestButtons.tsx";

import axios from "axios";
import {MedReq, ReqTypes, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import SimpleTextInput from "../../inputComponents/SimpleTextInput.tsx";
import {CreateDropdown} from "../../CreateDropdown.tsx";
import {NodeDataBase} from "../../../../../backend/src/DataBaseClasses/NodeDataBase.ts";
import {closeMedicineCard} from "../../service-request-cards/MedicineRequestCard.tsx";
//import SimpleTextInput from "../../inputComponents/SimpleTextInput.tsx";

let longNames:string[] = [];

export default function Medicine_input({
    setIsPopupOpen
                                       }:closeMedicineCard) {

    const [medRequestDoses, setMedRequestDose] = useState("");
    const [medRequestType, setMedRequestType] = useState("");
    const [medRequestDosage, setMedRequestDosage] = useState("");

    //use state keeps info in boxes between renders (rerenders every now and then like a videogame)
    // in html, "value" is the variable being changed by the user's action
    // and onChange is the function specifier, so for example: value={medRequestLocale} and onChange={setMedRequestLocale}
    //reference html is at bottom of this file

    const [resetDropdown, setResetDropdown] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [locations, setLocations] = useState<NodeDataBase[]>([]);

    let interID = setInterval(fadeEffect, 100);
    clearInterval(interID);

    useEffect(()=>{
        getLocations().then(
            (result)=>{

                const locationLongName:string[] = [];
                setLocations(result);
                result.forEach((node)=>{ locationLongName.push(node.longName);});
                longNames=locationLongName;

            });

    },[]);

    //Changed for database
    async function submit() {


        try {
            //Make a Service Request Data Type and then a Med Request Data Type
            // this is bc Front End will beconfused if we pass it a bunch of data so use data structures
            const servReq: ServiceRequest = {
                reqType: ReqTypes.medReq,           //Set req type to med req automatically bc we only make med reqs
                reqLocationID: locations[selected].nodeID,    //Need to know location of where the service request needs to be
                extraInfo: "",                      //no extra info is asked for a med req so just ignore (empty string)
                assignedUName: "No one",            //upon creation, no employee is assigned
                status: "Unassigned",             //upon creation, nobody is assigned, so set status to unassigned
                reqID: -1,
                reqPriority: "Low",
                time: null
            };

            //TODO FNFN Create Inputs for new variables below: patientName, patientDOB, patientMedReqNum, medForm, medSig
            //Make a Med Req after the service req (Med req needs service req's id, so med req cannot be made before)
            const medReqData: MedReq = {
                patientName: "CREATEINPUT",
                patientDOB: new Date(),
                patientMedReqNum: 0,
                medForm: "CREATEINPUT",
                medSig: "CREATEINPUT",
                medStrength: medRequestDosage,               //
                medName: medRequestType,                //etc etc etc
                quantity: parseInt(medRequestDoses),    //
                genReqID: -1,    // default is 0, but is always changed to the value of the newly created Service Req
            };
            clear();

            //Post Med Req to DB (pass in objects of MedReq and ServiceRequest as an array)
            await axios.post("/api/serviceRequests/medReq",
                [servReq, medReqData], {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

            show();
        } catch {
            console.error("Error with trying to save Service Req in ServiceRequestPage.tsx");
        }


    }

    function show() {
        const tag: HTMLElement = document.getElementById("popup") as HTMLElement;
        tag.style.opacity = "1";
        interID = setInterval(fadeEffect, 100);
    }

    function fadeEffect() {
        const target = document.getElementById("popup") as HTMLElement;
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

    function clear() {
        setMedRequestDosage("");
        setResetDropdown(true);
        setMedRequestType("");
        setMedRequestDose("");
    }

    function closeMedicineForm(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
        event.preventDefault();
        setIsPopupOpen(false);
    }
    return (
        <div
            className={"mt-3 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl p-4 align-self-center"}>
            <form className={"p-2"}>
                <h1 className={"flex mb-3 justify-center font-bold text-xl"}>Medicine Request</h1>


                <div className="grid justify-center items-center my-1.5">

                    <label className="label">Location </label>
                    <CreateDropdown runOnChange={()=>{return -1;}}
                                    dropBtnName={"Locations"} dropdownID={"LocationMed"} isSearchable={true}
                                    populationArr={longNames} resetDropdown={resetDropdown}
                                    setSelected={setSelected}
                                    inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                                    selectCSS={""}
                                    resetOnSelect={false} setResetDropdown={setResetDropdown}/>

                </div>


                <SimpleTextInput id={"medRequestType"} labelContent={"Medicine Type"} inputStorage={medRequestType}
                                 setInputStorage={setMedRequestType}
                                 inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                 divCSS={"grid justify-center items-center my-1.5"} labelCSS={""}
                                 placeHolderText={""}>
                </SimpleTextInput>


                <SimpleTextInput id={"medRequestDose"} labelContent={"Medicine Dose"} inputStorage={medRequestDoses}
                                 setInputStorage={setMedRequestDose}
                                 inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                 divCSS={"grid justify-center items-center my-1.5"} labelCSS={""}
                                 placeHolderText={""}>
                </SimpleTextInput>

                <SimpleTextInput id={"medRequestDosage"} labelContent={"Amount"} inputStorage={medRequestDosage}
                                 setInputStorage={setMedRequestDosage}
                                 inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                 divCSS={"grid justify-center items-center my-1.5"} labelCSS={""}
                                 placeHolderText={""}>
                </SimpleTextInput>

                <RequestButtons submit={submit}/>

            </form>
            <div className={"grid justify-center items-center m-auto my-1.5 mb-5"}>
                <button onClick={(event) => closeMedicineForm(event)} className={
                    "bg-tableText p-1 rounded-xl w-24 font-bold cursor-pointer flex justify-center m-auto mb-2 mt-5"}>
                    Close
                </button>
                <div id={"popup"} className={"text-center opacity-0 text-submitSuccess"}>
                    <h3>
                        Successfully submitted!
                    </h3>
                </div>
                <p className={"flex justify-center items-center mt-5"}>Created By: Alex and Antonio</p>
            </div>
        </div>

    );
}

async function getLocations() {
    //load edges and node from database
    const nodesDB = await axios.get<NodeDataBase[]>("/api/load-nodes");
    return nodesDB.data;
}

