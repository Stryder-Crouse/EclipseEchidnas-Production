/** importations **/
import React, {useEffect, useState} from "react";
import RequestButtons from "../../buttons/RequestButtons.tsx";

import axios from "axios";
import {MedReq, ReqTypes, ServiceRequest} from "common/src/algorithms/Requests/Request.ts";
import SimpleTextInput from "../../inputComponents/SimpleTextInput.tsx";
import {CreateDropdown} from "../../CreateDropdown.tsx";
import {NodeDataBase} from "common/src/algorithms/DataBaseClasses/NodeDataBase.ts";
import {closeMedicineCard} from "../../service-request-cards/MedicineRequestCard.tsx";
//import SimpleTextInput from "../../inputComponents/SimpleTextInput.tsx";
import RequestSubmitToast from "../../toasts/RequestSubmitToast.tsx";
let longNames:string[] = [];

export default function Medicine_input({
    setIsPopupOpen
                                       }:closeMedicineCard) {

    const [medRequestDoses, setMedRequestDose] = useState("");
    const [medRequestForm, setMedRequestForm] = useState("");
    const [medRequestDosage, setMedRequestDosage] = useState("");
    const [patientName, setPatientName] = useState("");
    const [patientDob, setPatientDob] = useState(new Date());
    const [medicineSig, setMedicineSig] = useState("");
    const [patientMedRec, setPatientMedrec] = useState("");

    //use state keeps info in boxes between renders (rerenders every now and then like a videogame)
    // in html, "value" is the variable being changed by the user's action
    // and onChange is the function specifier, so for example: value={medRequestLocale} and onChange={setMedRequestLocale}
    //reference html is at bottom of this file

    const [resetDropdown, setResetDropdown] = useState(false);
    const [resetMedFormDropdown, setResetMedFormDropdown] = useState(false);
    const [selectedName, setSelectedName] = useState(-1);
    const [selected, setSelected] = useState(-1);
    const [locations, setLocations] = useState<NodeDataBase[]>([]);
    const medArr = ["Tylenol", "Pepcid", "Ciprofloxacin"];

    let interID = setInterval(fadeEffect, 100);
    clearInterval(interID);

    const [extraInfo, setExtraInfo] = useState("");

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
                reqPriority: "Low",
                reqLocationID: locations[selected].nodeID,    //Need to know location of where the service request needs to be
                extraInfo: extraInfo,
                status: "Unassigned",             //upon creation, nobody is assigned, so set status to unassigned
                assignedUName: "No one",            //upon creation, no employee is assigned
                time: null,
                reqID: -1
            };

            if(isNaN(parseInt(patientMedRec))){
                console.error("patientMedRec was supposed to be a number");
            }
            if(isNaN(parseInt(medRequestDosage))){
                console.error("medRequestDosage was supposed to be a number");
            }
            //TODO FNFN Create Inputs for new variables below: patientName, patientDOB, patientMedRecordNum, medForm, medSig
            //Make a Med Req after the service req (Med req needs service req's id, so med req cannot be made before)
            const medReqData: MedReq = {
                patientName: patientName,
                patientDOB: patientDob,
                patientMedRecordNum: parseInt(patientMedRec),
                medStrength: medRequestDosage,
                medName: medArr[selectedName],
                quantity: parseInt(medRequestDoses),
                medForm: medRequestForm,
                medSig: medicineSig,
                genReqID: -1    // default is 0, but is always changed to the value of the newly created Service Req
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
        const tag: HTMLElement = document.getElementById("med-popup") as HTMLElement;
        tag.style.opacity = "1";
        interID = setInterval(fadeEffect, 100);
    }

    function fadeEffect() {
        const target = document.getElementById("med-popup") as HTMLElement;
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
        setMedRequestForm("");
        setMedRequestDose("");
        setMedicineSig("");
        setPatientDob(new Date());
        setPatientName("");
        setPatientMedrec("");
        setResetMedFormDropdown(true);
        setExtraInfo("");
        setSelectedName(-1);
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


                <SimpleTextInput id={"patientName"}
                                 labelContent={"Patient Name"}
                                 inputStorage={patientName} setInputStorage={setPatientName}
                                 inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                 divCSS={"grid justify-center items-center my-1.5"} labelCSS={""} placeHolderText={""}>

                </SimpleTextInput>
                <div className="grid justify-center items-center my-1.5">

                    <label className="label">Patient DoB </label>
                    <input className={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                           type="date" id={"patientDob"} name={"patientDob"}
                           onChange={(e) => {
                               if (e.target.valueAsDate != null) {
                                   setPatientDob(e.target.valueAsDate);
                               }
                           }
                           }

                    ></input>
                </div>
                <SimpleTextInput id={"patientMedRec"}
                                 labelContent={"Patient Medical Record Number"}
                                 inputStorage={patientMedRec} setInputStorage={setPatientMedrec}
                                 inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                                 divCSS={"grid justify-center items-center my-1.5"} labelCSS={""}
                                 placeHolderText={""}></SimpleTextInput>
                <div className="grid justify-center items-center my-1.5">

                    <label className="label">Location </label>
                    <CreateDropdown dropBtnName={"Locations"} dropdownID={"LocationMed"} isSearchable={true}
                                    populationArr={longNames} resetDropdown={resetDropdown}
                                    setSelected={setSelected}
                                    inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                                    selectCSS={""}
                                    resetOnSelect={false} setResetDropdown={setResetDropdown}/>

                </div>


                <div className={"grid justify-center items-center my-1.5"}>
                    <label className="label">Medicine Name</label>
                    <CreateDropdown
                        dropBtnName={"Form"}
                        dropdownID={"medicineForm"}
                        populationArr={medArr}
                        isSearchable={true}
                        resetOnSelect={false}
                        resetDropdown={resetMedFormDropdown}
                        setResetDropdown={setResetMedFormDropdown}
                        setSelected={setSelectedName}
                        inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                        selectCSS={""}>
                    </CreateDropdown>
                </div>

                <SimpleTextInput id={"medRequestType"} labelContent={"Medicine Form"} inputStorage={medRequestForm}
                                 setInputStorage={setMedRequestForm}
                                 inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                 divCSS={"grid justify-center items-center my-1.5"} labelCSS={""}
                                 placeHolderText={""}>
                </SimpleTextInput>


                <SimpleTextInput id={"medRequestDosage"} labelContent={"Medicine Strength"}
                                 inputStorage={medRequestDosage}
                                 setInputStorage={setMedRequestDosage}
                                 inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                 divCSS={"grid justify-center items-center my-1.5"} labelCSS={""}
                                 placeHolderText={""}>
                </SimpleTextInput>


                <SimpleTextInput id={"medRequestSig"} labelContent={"SIG"} inputStorage={medicineSig}
                                 setInputStorage={setMedicineSig}
                                 inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                 divCSS={"grid justify-center items-center my-1.5"} labelCSS={""}
                                 placeHolderText={""}>
                </SimpleTextInput>
                <div className={"grid justify-center items-center my-1.5 mb-1"}>
                    <textarea placeholder={"Extra Info: "}
                              className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow" /*className may need to be different to have a larger area*/}
                              onChange={(e) => setExtraInfo(e.target.value)}
                              id={"service"}
                              value={extraInfo}
                              required>
                    </textarea>
                </div>

                <RequestButtons submit={submit}/>

            </form>
            <div className={"grid justify-center items-center m-auto my-1.5 mb-5"}>
                <button onClick={(event) => closeMedicineForm(event)} className={
                    "bg-tableText p-1 rounded-xl w-24 font-bold cursor-pointer flex justify-center m-auto mb-2 mt-5"}>
                    Close
                </button>

                <p className={"flex justify-center items-center mt-5"}>Created By: Alex and Antonio</p>
            </div>
            <div id={"med-popup"} className={"text-center flex justify-center m-auto opacity-0 "}>
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

