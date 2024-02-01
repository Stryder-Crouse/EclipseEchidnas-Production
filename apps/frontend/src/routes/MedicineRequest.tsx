/** importations **/
import React, { ChangeEvent, useState } from "react";
import "../css/medicineRequest.css";
import AdminPageNavBar from "../components/AdminPageNavBar.tsx";
import RequestButtons from "../components/RequestButtons.tsx";
import ExitButton from "../components/ExitButton.tsx";

export default function MedicineRequest() {
  const [medRequestLocale, setMedRequestLocale] = useState("");
  const [medRequestDoses, setMedRequestDose] = useState("");
  const [medRequestType, setMedRequestType] = useState("");
  const [medRequestDosage, setMedRequestDosage] = useState("");

  function submit() {
    if (medRequestLocale !== "") {
      console.log(medRequestLocale);
    }
  }

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
        <form className={"medicine-form"}>
          <div className={"medicine-radio"}>
            <input
              type={"radio"}
              id={"medRequest"}
              name={"request"}
              value={"Medicine Request"}
            />
            <label form={"medRequest"}>Medicine Request</label>
          </div>
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
