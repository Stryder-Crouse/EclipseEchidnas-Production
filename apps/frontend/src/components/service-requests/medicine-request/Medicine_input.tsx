/** importations **/
import React, {ChangeEvent, useState} from "react";
import RequestButtons from "../../buttons/RequestButtons.tsx";

import axios from "axios";
import {MedReq, ReqTypes, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
//import SimpleTextInput from "../../inputComponents/SimpleTextInput.tsx";

export default function Medicine_input() {
    const [medRequestLocale, setMedRequestLocale] = useState("");
    const [medRequestDoses, setMedRequestDose] = useState("");
    const [medRequestType, setMedRequestType] = useState("");
    const [medRequestDosage, setMedRequestDosage] = useState("");

    //use state keeps info in boxes between renders (rerenders every now and then like a videogame)
    // in html, "value" is the variable being changed by the user's action
    // and onChange is the function specifier, so for example: value={medRequestLocale} and onChange={setMedRequestLocale}
    //reference html is at bottom of this file

    //Changed for database
    async function submit() {


        try {
            //Make a Service Request Data Type and then a Med Request Data Type
            // this is bc Front End will beconfused if we pass it a bunch of data so use data structures
            const servReq: ServiceRequest = {
                reqType: ReqTypes.medReq,           //Set req type to med req automatically bc we only make med reqs
                reqLocationID: medRequestLocale,    //Need to know location of where the service request needs to be
                extraInfo: "",                      //no extra info is asked for a med req so just ignore (empty string)
                assignedUName: "No one",            //upon creation, no employee is assigned
                status: "Unassigned",             //upon creation, nobody is assigned, so set status to unassigned
                reqID: -1,
                reqPriority: "Low"
            };

            //Make a Med Req after the service req (Med req needs service req's id, so med req cannot be made before)
            const medReqData: MedReq = {
                dosage: medRequestDosage,               //
                medType: medRequestType,                //etc etc etc
                numDoses: parseInt(medRequestDoses),    //
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


        } catch {
            console.error("Error with trying to save Service Req in ServiceRequestPage.tsx");
        }


    }

    function clear() {
        setMedRequestDosage("");
        setMedRequestLocale("");
        setMedRequestType("");
        setMedRequestDose("");
    }

    /**
     *
     * Getting Request Location in String
     */
    function handleMedRequestLocaleInput(e: ChangeEvent<HTMLInputElement>) {
        setMedRequestLocale(e.target.value);
    }

    function handleMedRequestDoseInput(e: ChangeEvent<HTMLInputElement>) {
        setMedRequestDose(e.target.value);
    }

    function handleMedRequestDosageInput(e: ChangeEvent<HTMLInputElement>) {
        setMedRequestDosage(e.target.value);
    }

    function handleMedRequestTypeInput(e: ChangeEvent<HTMLInputElement>) {
        setMedRequestType(e.target.value);
    }

    return (
            <div className={"mt-3 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl p-4 align-self-center"}>
                <form className={"p-1"}>
                    <h1 className={"flex mb-3 justify-center font-bold text-xl"}>Medicine Request</h1>
                    <div className={"grid justify-center items-center my-1.5"}>
                        <label form={"medRequestLocal"}>To Room Number</label>
                        <input
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            type={"text"}
                            id={"medRequestLocal"}
                            name={"medRequestLocal"}
                            placeholder={"To Room Number"}
                            value={medRequestLocale}
                            onChange={handleMedRequestLocaleInput}
                        />
                    </div>

                    {/*<SimpleTextInput id={"medRequestType"} textContent={"Medicine Type"}*/}
                    {/*                 divCSS={""} inputCSS={}*/}
                    {/*                 inputStorage={} labelCSS={}*/}
                    {/*                 placeHolderText={} setInputStorage={}>*/}

                    {/*</SimpleTextInput>*/}

                    <div className={"grid justify-center items-center my-1.5"}>
                        <label form={"medRequestType"}>Medicine Type</label>
                        <input
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            type={"text"}
                            id={"medRequestType"}
                            name={"medRequestType"}
                            placeholder={"Medicine Type"}
                            value={medRequestType}
                            onChange={handleMedRequestTypeInput}
                        />
                    </div>
                    <div className={"grid justify-center items-center my-1.5"}>
                        <label form={"medRequestDose"}>Medicine Dose</label>
                        <input
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            type={"text"}
                            id={"medRequestDose"}
                            name={"medRequestDoses"}
                            placeholder={"Medicine Doses"}
                            value={medRequestDoses}
                            onChange={handleMedRequestDoseInput}
                        />
                    </div>
                    <div className={"grid justify-center items-center my-1.5 mb-2"}>
                        <label form={"medRequestDosage"}>Amount</label>
                        <input
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            type={"text"}
                            id={"medRequestDosage"}
                            name={"medRequestDoses"}
                            placeholder={"Medicine Dosage"}
                            value={medRequestDosage}
                            onChange={handleMedRequestDosageInput}
                        />
                    </div>
                    <RequestButtons submit={submit}/>
                    <div className={"flex justify-center items-center my-1.5"}>
                        <p>Created By: Alex and Antonio</p>
                    </div>
                </form>
            </div>

    );
}
