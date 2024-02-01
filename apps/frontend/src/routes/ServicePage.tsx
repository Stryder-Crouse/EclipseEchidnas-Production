/** importations **/
import React, { ChangeEvent, useEffect, useState } from "react";
import "../components/servicePage.css";
import RequestButtons from "../components/RequestButtons";

//import {HTMLInputElement} from "happy-dom";

export default function ServicePage() {
  const [medRequestLocale, setMedRequestLocale] = useState("");
  const [medRequestDoses, setMedRequestDose] = useState("");
  const [medRequestType, setMedRequestType] = useState("");

  useEffect(() => {
    //set background to first floor on component load
    document.body.style.backgroundImage =
      "url(/src/components/backgroundHospitalImage.jpg)";
  }, []);

  async function submit() {
    if (
      medRequestLocale !== "" &&
      medRequestType !== "" &&
      medRequestDoses !== ""
    ) {
      console.log("k");
    }
  }

  function handleMedRequestLocaleInput(e: ChangeEvent<HTMLInputElement>) {
    setMedRequestLocale(e.target.value);
  }

  function handleMedRequestDoseInput(e: ChangeEvent<HTMLInputElement>) {
    setMedRequestDose(e.target.value);
  }

  function handleMedRequestTypeInput(e: ChangeEvent<HTMLInputElement>) {
    setMedRequestType(e.target.value);
  }

  return (
    <div className={"servicePage"}>
      <div className={"grid"}>
        <div className={"title"}>
          <h1>Service Request</h1>
        </div>
        <div className={"servDropdown"}>
          <select name={"services"} id={"service"}>
            <option>Select Request...</option>
            <option>Medicine Request</option>
          </select>

          {/*<input*/}
          {/*  type={"radio"}*/}
          {/*  id={"medRequest"}*/}
          {/*  name={"request"}*/}
          {/*  value={"Medicine Request"}*/}
          {/*/>*/}
        </div>
        <div className={"locale"}>
          <input
            type={"text"}
            id={"medRequestLocale"}
            name={"medRequestLocale"}
            placeholder={"Location"}
            value={medRequestLocale}
            onChange={handleMedRequestLocaleInput}
          />
        </div>
        <div className={"medName"}>
          <input
            type={"text"}
            id={"medRequestType"}
            name={"medRequestType"}
            placeholder={"Medicine Name"}
            value={medRequestType}
            onChange={handleMedRequestTypeInput}
          />
        </div>
        <div className={"medDoses"}>
          <input
            type={"text"}
            id={"medRequestDose"}
            name={"medRequestDoseage"}
            placeholder={"Medicine Doseage"}
            value={medRequestDoses}
            onChange={handleMedRequestDoseInput}
          />
        </div>
        <div className={"submitButton"}>
          <RequestButtons submit={submit} />
        </div>
      </div>
    </div>
  );
}
