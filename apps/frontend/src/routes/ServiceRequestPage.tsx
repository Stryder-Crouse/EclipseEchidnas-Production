/** importations **/
import React, { ChangeEvent, useState } from "react";
import "../css/route-css/medicineRequest.css";
import AdminPageNavBar from "../components/navigation-bar/AdminPageNavBar.tsx";
import RequestButtons from "../components/buttons/RequestButtons.tsx";
import ExitButton from "../components/buttons/ExitButton.tsx";

import axios from "axios";
import {MedReq, ReqTypes, ServiceRequest} from "../../../backend/src/algorithms/Requests/Request.ts";

export default function ServiceRequestPage() {
  const [medRequestLocale, setMedRequestLocale] = useState("");
  const [medRequestDoses, setMedRequestDose] = useState("");
  const [medRequestType, setMedRequestType] = useState("");
  const [medRequestDosage, setMedRequestDosage] = useState("");

  //Changed for database
  async function submit() {
    if (medRequestLocale !== "") {
      console.log(medRequestLocale);
    }

    try {
        //const tempNode = await axios.get<Node>("/api/load-nodes/one-node" + medRequestLocale);
        const servReq : ServiceRequest = {
            reqType: ReqTypes.medReq,
            reqLocationID: medRequestLocale,
            extraInfo: "",
            assignedUName: "No one",
            status: "Not Assigned",
        };

        console.log("EEEEEEpic");

        try {
            //Post Req to DB (also store it so I can get the id for the med req)
            const reqid = await axios.post("/api/serviceRequests/serviceReq", servReq, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // console.log(reqid);

            const medReqData: MedReq = {
                dosage: medRequestDosage,
                medType: medRequestType,
                numDoses: parseInt(medRequestDoses),
                genReqID: reqid.data.genReqID,
            };

            // console.log("\n\nIMPORTANT STUFF\n\n");
            // console.log(medReqData);


            //post Med Req to DB
            await axios.post("/api/serviceRequests/medReq", medReqData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // console.log(medReqData);

        } catch (err) {
            throw new Error("Error with loading Reqs/Med Reqs");
        }
    } catch {
        console.error("HUUUUUUUUUUUUUUUUGE issue with getting one node");
    }





  }

  /**
   *
   * Getting Request Location in String
   */
  function handleMedRequestLocaleInput(e: ChangeEvent<HTMLInputElement>) {
    setMedRequestLocale(e.target.value);
  }

  /**
   * @param par1 -
   * @param par2 -
   * @param par3 -
   * @param par4 -
   * @param par5 -
   *
   * @returns
   *
   * @param e
   */
  function handleMedRequestDoseInput(e: ChangeEvent<HTMLInputElement>) {
    setMedRequestDose(e.target.value);
  }

  /**
   * @param par1 -
   * @param par2 -
   * @param par3 -
   * @param par4 -
   * @param par5 -
   *
   * @returns
   * @param e
   */
  function handleMedRequestDosageInput(e: ChangeEvent<HTMLInputElement>) {
    setMedRequestDosage(e.target.value);
  }

  /**
   *
   * @param e
   */
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
