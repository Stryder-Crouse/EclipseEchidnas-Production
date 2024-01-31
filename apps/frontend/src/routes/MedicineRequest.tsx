/** importations **/
import React, { ChangeEvent, useState } from "react";
import "../css/medicineRequest.css";
import AdminPageNavBar from "../components/AdminPageNavBar.tsx";
import RequestButtons from "../components/RequestButtons.tsx";
import ExitButton from "../components/ExitButton.tsx";
// import GuestButton from "../components/GuestButton.tsx";

export default function MedicineRequest() {
  const [medRequestLocale, setMedRequestLocale] = useState("");
  const [medRequestDoses, setMedRequestDose] = useState("");
  const [medRequestType, setMedRequestType] = useState("");

  /*    useEffect(() => {
          //set background to first floor on component load
          document.body.style.backgroundImage =
              "url(/src/components/backgroundHospitalImage.jpg)";
      }, []);*/

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

  function handleMedRequestTypeInput(e: ChangeEvent<HTMLInputElement>) {
    setMedRequestType(e.target.value);
  }

  function sayHi() {
    console.log("hi");
  }

  return (
      <div>
          <AdminPageNavBar />

    <div className={"servicePage grid"}>
      <form>
        <input
          type={"radio"}
          id={"medRequest"}
          name={"request"}
          value={"Medicine Request"}
        />
        <label form={"medRequest"}>Medicine Request</label>
        <br />
        <input
          type={"text"}
          id={"medRequestLocal"}
          name={"medRequestLocal"}
          placeholder={"Location"}
          value={medRequestLocale}
          onChange={handleMedRequestLocaleInput}
        />
        <br />
        <input
          type={"text"}
          id={"medRequestType"}
          name={"medRequestType"}
          placeholder={"Medicine Type"}
          value={medRequestType}
          onChange={handleMedRequestTypeInput}
        />
        <br />
        <input
          type={"text"}
          id={"medRequestDose"}
          name={"medRequestDoseage"}
          placeholder={"Medicine Doseage"}
          value={medRequestDoses}
          onChange={handleMedRequestDoseInput}
        />
        <br />
        <RequestButtons submit={submit} />
        <button onClick={sayHi}>test</button>
          {/*// this should technically take you to list of service request*/}
      </form>
      <ExitButton />
    </div>
      </div>
  );
}
