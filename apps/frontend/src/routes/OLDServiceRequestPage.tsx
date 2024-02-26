/** importations **/
import React, { ChangeEvent, useState } from "react";

import AdminPageNavBar from "../components/navigation-bar/AdminPageNavBar.tsx";
import RequestButtons from "../components/buttons/RequestButtons.tsx";
import ExitButton from "../components/buttons/ExitButton.tsx";

import axios from "axios";
import {MedReq, ReqTypes, ServiceRequest} from "../../../../packages/common/src/algorithms/Requests/Request.ts";

export default function OLDServiceRequestPage() {


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
        const servReq : ServiceRequest = {
            reqType: ReqTypes.medReq,           //Set req type to med req automatically bc we only make med reqs
            reqLocationID: medRequestLocale,    //Need to know location of where the service request needs to be
            extraInfo: "",                      //no extra info is asked for a med req so just ignore (empty string)
            assignedUName: "No one",            //upon creation, no employee is assigned
            status: "Unassigned",             //upon creation, nobody is assigned, so set status to unassigned
            reqID:-1,
            reqPriority:"Low",
            time: null
        };

        //Make a Med Req after the service req (Med req needs service req's id, so med req cannot be made before)
        const medReqData: MedReq = {
            patientName: "CREATEINPUT",
            patientDOB: new Date(),
            patientMedRecNum: 0,
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
            [servReq,medReqData], {
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
    <div>
      <AdminPageNavBar />
      <div className={"servicePage grid"}>
        <table>
          {/*th need to be in a table please change it later to a a tag or b tag*/}
          <tbody>
            <tr>
              <th>Medicine Request</th>
            </tr>
          </tbody>
        </table>

        <form className={"medicine-form"}>
          <div className={"text-field"}>
            <input
              className={"input-fields"}
              type={"text"}
              id={"medRequestLocal"}
              name={"medRequestLocal"}
              placeholder={"Location"}
              value={medRequestLocale}
              onChange={handleMedRequestLocaleInput}
            />
          </div>
          <div className={"text-field"}>
            <input
              className={"input-fields"}
              type={"text"}
              id={"medRequestType"}
              name={"medRequestType"}
              placeholder={"Medicine Type"}
              value={medRequestType}
              onChange={handleMedRequestTypeInput}
            />
          </div>
          <div className={"text-field"}>
            <input
              className={"input-fields"}
              type={"text"}
              id={"medRequestDose"}
              name={"medRequestDoses"}
              placeholder={"Medicine Doses"}
              value={medRequestDoses}
              onChange={handleMedRequestDoseInput}
            />
          </div>
          <div className={"text-field"}>
            <input
              className={"input-fields"}
              type={"text"}
              id={"medRequestDose"}
              name={"medRequestDoses"}
              placeholder={"Medicine Dosage"}
              value={medRequestDosage}
              onChange={handleMedRequestDosageInput}
            />
          </div>
          <RequestButtons submit={submit} />
          {/*// this should technically take you to list of service request*/}
        </form>
        <ExitButton />
      </div>
    </div>
  );
}
