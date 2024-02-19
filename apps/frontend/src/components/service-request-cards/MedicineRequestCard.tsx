import React, { useEffect, useState } from "react";
import RequestButtons from "../buttons/RequestButtons.tsx";
import axios from "axios";
import { MedReq, ReqTypes, ServiceRequest } from "../../../../backend/src/algorithms/Requests/Request.ts";
import SimpleTextInput from "../inputComponents/SimpleTextInput.tsx";
import { CreateDropdown } from "../CreateDropdown.tsx";
import { NodeDataBase } from "../../../../backend/src/DataBaseClasses/NodeDataBase.ts";
import "../service-request-cards/popupDiv.css";
import MedicineImage from "../../images/Service Request/medicine.png";

let longNames: string[] = [];

function MedicineRequestCard() {
    const [medRequestDoses, setMedRequestDose] = useState("");
    const [medRequestType, setMedRequestType] = useState("");
    const [medRequestDosage, setMedRequestDosage] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    async function submit() {
        try {
            const servReq: ServiceRequest = {
                reqType: ReqTypes.medReq,
                reqLocationID: locations[selected].nodeID,
                extraInfo: "",
                assignedUName: "No one",
                status: "Unassigned",
                reqID: -1,
                reqPriority: "Low"
            };

            const medReqData: MedReq = {
                dosage: medRequestDosage,
                medType: medRequestType,
                numDoses: parseInt(medRequestDoses),
                genReqID: -1,
            };

            clear();

            await axios.post("/api/serviceRequests/medReq", [servReq, medReqData], {
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
        setResetDropdown(true);
        setMedRequestType("");
        setMedRequestDose("");
    }

    const [resetDropdown, setResetDropdown] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [locations, setLocations] = useState<NodeDataBase[]>([]);

    useEffect(() => {
        getLocations().then((result) => {
            const locationLongName: string[] = [];
            setLocations(result);
            result.forEach((node) => {
                locationLongName.push(node.longName);
            });
            longNames = locationLongName;
        });
    }, []);

    function openMedicineForm() {
        setIsPopupOpen(true);
    }

    function closeMedicineForm(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
        event.preventDefault();
        setIsPopupOpen(false);
    }


    return (
        <div className={"flex mr-12"}>
            <div
                onClick={openMedicineForm}
                className="text-black bg-ivoryWhite w-56 h-72 text-center drop-shadow-xl hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all hover:border-t-teal border-t-8"
                id={"medicineForm"}
            >
                <img src={MedicineImage} alt={"medicineImage"} className="scale-90" />
                <h1 className="font-semibold mt-2">MEDICINE</h1>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50" onClick={closeMedicineForm}></div>
            )}

            <div className={`popupForm ${isPopupOpen ? "block" : "hidden"}`} id={"medicinePopupForm"}>

                <div
                    className={"min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl p-4 align-self-center "}>
                    <form className={"p-1"}>
                        <h1 className={"flex mb-3 justify-center font-bold text-xl"}>Medicine Request</h1>

                        <div className="grid justify-center items-center my-1.5">
                            <label className="label">Location </label>
                            <CreateDropdown
                                dropBtnName={"Locations"}
                                dropdownID={"LocationMed"}
                                isSearchable={true}
                                populationArr={longNames}
                                resetDropdown={resetDropdown}
                                setSelected={setSelected}
                                inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                                selectCSS={""}
                                resetOnSelect={false}
                                setResetDropdown={setResetDropdown}
                            />

                            <SimpleTextInput
                                id={"medRequestType"}
                                labelContent={"Medicine Type"}
                                inputStorage={medRequestType}
                                setInputStorage={setMedRequestType}
                                inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                divCSS={"grid justify-center items-center my-1.5"}
                                labelCSS={""}
                                placeHolderText={""}
                            >
                            </SimpleTextInput>

                            <SimpleTextInput
                                id={"medRequestDose"}
                                labelContent={"Medicine Dose"}
                                inputStorage={medRequestDoses}
                                setInputStorage={setMedRequestDose}
                                inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                divCSS={"grid justify-center items-center my-1.5"}
                                labelCSS={""}
                                placeHolderText={""}
                            >
                            </SimpleTextInput>

                            <SimpleTextInput
                                id={"medRequestDosage"}
                                labelContent={"Amount"}
                                inputStorage={medRequestDosage}
                                setInputStorage={setMedRequestDosage}
                                inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                divCSS={"grid justify-center items-center my-1.5 mb-5"}
                                labelCSS={""}
                                placeHolderText={""}
                            >
                            </SimpleTextInput>

                            <RequestButtons submit={submit}/>
                        </div>

                        <div className={"grid justify-center items-center m-auto my-1.5 mb-5"}>
                            <button
                                onClick={(event) => closeMedicineForm(event)}
                                className={
                                    "bg-tableText p-1 rounded-xl w-24 font-bold cursor-pointer flex justify-center m-auto mb-2"
                                }
                            >
                                Close
                            </button>
                            <p className={"grid justify-center m-auto "}>Created By: Alex and Antonio</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MedicineRequestCard;

async function getLocations() {
    const nodesDB = await axios.get<NodeDataBase[]>("/api/load-nodes");
    return nodesDB.data;
}
