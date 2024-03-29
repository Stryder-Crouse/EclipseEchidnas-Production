import React, {useEffect} from "react";
import {useState} from "react";
import {
    OutsideTransport,
    ReqTypes,
    ServiceRequest
} from "common/src/algorithms/Requests/Request.ts";
import axios from "axios";
import RequestButtons from "../../buttons/RequestButtons.tsx";
import SimpleTextInput from "../../inputComponents/SimpleTextInput.tsx";
import {NodeDataBase} from "common/src/algorithms/DataBaseClasses/NodeDataBase.ts";
import {CreateDropdown} from "../../CreateDropdown.tsx";
import {closeTransportCard} from "../../service-request-cards/TransportationRequestCard.tsx";
//import LocationsDropDown from "../../navigation-bar/LocationsDropDown.tsx";
import RequestSubmitToast from "../../toasts/RequestSubmitToast.tsx";
import {Priority} from "../priorityAndStatusEnums.tsx";

let longNames: string[] = [];

export default function Transportation_Input({
                                                 setIsPopupOpen
                                             }: closeTransportCard) {


    enum ModeTransport {
        Ambulance = "Ambulance",
        Helicopter = "Helicopter",
        Boat = "Boat",
        Superhero = "Superhero"
    }

    const priorityLevels = [Priority.low, "Medium", Priority.high, Priority.emergency];
    const [resetDropdownUrg, setResetDropdownUrg] = useState(false);
    const [urgencyDDIndx, setUrgencyDDIndx] = useState(-1);

    const modeTrans = [ModeTransport.Ambulance, ModeTransport.Helicopter, ModeTransport.Boat, ModeTransport.Superhero];
    const [resetDropdownTrans, setResetDropdownTrans] = useState(false);
    const [transportIndex, setTransportIndex] = useState(-1);

    const [patientName, setPatientName] = useState('');


    const [destination, setDestination] = useState('');
    const [additional, setAdditional] = useState('');

    const [resetDropdown, setResetDropdown] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [locations, setLocations] = useState<NodeDataBase[]>([]);

    let interID = setInterval(fadeEffect, 100);
    clearInterval(interID);

    useEffect(() => {
        getLocations().then(
            (result) => {

                const locationLongName: string[] = [];
                setLocations(result);
                result.forEach((node) => {
                    locationLongName.push(node.longName);
                });
                longNames = locationLongName;

            });

    }, []);


    async function submit() {


        try {
            //Make a Service Request Data Type and then a Med Request Data Type
            // this is bc Front End will beconfused if we pass it a bunch of data so use data structures
            const servReq: ServiceRequest = {
                reqType: ReqTypes.tranReq,           //Set req type to med req automatically bc we only make med reqs
                reqLocationID: locations[selected].nodeID,    //Need to know location of where the service request needs to be
                extraInfo: additional,                      //no extra info is asked for a med req so just ignore (empty string)
                assignedUName: "No one",            //upon creation, no employee is assigned
                status: "Unassigned",             //upon creation, nobody is assigned, so set status to unassigned
                reqID: -1,
                reqPriority: priorityLevels[urgencyDDIndx],
                time: null
            };

            const transportData: OutsideTransport = {
                patientName: patientName,
                destination: destination,
                modeOfTransport: modeTrans[transportIndex],
                serviceReqID: -1,
            };
            clear();

            await axios.post("/api/serviceRequests/outsideTransport",
                [servReq, transportData], {
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
        const tag: HTMLElement = document.getElementById("transport-popup") as HTMLElement;
        tag.style.opacity = "1";
        interID = setInterval(fadeEffect, 100);
    }

    function fadeEffect() {
        const target = document.getElementById("transport-popup") as HTMLElement;
        let opacity = target.style.opacity;
        if (Number(opacity) >= 0.97) {
            opacity = (Number(opacity) - 0.001).toString();
            target.style.opacity = opacity;
        } else if (Number(opacity) > 0) {
            opacity = (Number(opacity) - 0.1).toString();
            target.style.opacity = opacity;
        }

        if (Number(opacity) < 0) {
            clearInterval(interID);
        }
    }

    function clear() {
        setResetDropdownUrg(true);
        setPatientName("");
        setResetDropdown(true);
        setDestination("");
        setResetDropdownTrans(true);
        setAdditional("");
    }

    function closeTransportForm(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
        event.preventDefault();
        setIsPopupOpen(false);
    }

    return (

        <div
            className={"mt-3 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl p-1 align-self-center "}>

            <form className={"p-2"}>
                <h1 className={"flex mb-3 justify-center font-bold text-xl"}>External Patient
                    Transportation</h1> {/* Div Title */}

                <div className={"flex"}>
                    <div className={"flex flex-col mr-6"}>
                        {/*patient name*/}
                        <SimpleTextInput id={"patientName"} labelContent={"Patient Name "} inputStorage={patientName}
                                         setInputStorage={setPatientName}
                                         inputCSS={"p-2 w-60 bg-white text-black rounded-full border-2 border-gray-500 drop-shadow cursor-pointer"}
                                         divCSS={"grid justify-center items-center my-1.5"} labelCSS={"mb-1"}
                                         placeHolderText={"e.g. Jane Smith"}>
                        </SimpleTextInput>

                        {/*room number*/}
                        <div className="grid justify-center items-center my-1.5">

                            <label className="label">Location </label>
                            <CreateDropdown runOnChange={() => {
                                return -1;
                            }}
                                            dropBtnName={"Locations"} dropdownID={"LocationTran"} isSearchable={true}
                                            populationArr={longNames} resetDropdown={resetDropdown}
                                            setSelected={setSelected}
                                            inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                                            selectCSS={""}
                                            resetOnSelect={false} setResetDropdown={setResetDropdown}/>

                        </div>

                        {/*destination*/}
                        <SimpleTextInput id={"destination"} labelContent={"Destination "} inputStorage={destination}
                                         setInputStorage={setDestination}
                                         inputCSS={"p-2 w-60 bg-white text-black rounded-full border-2 border-gray-500 drop-shadow cursor-pointer"}
                                         divCSS={"grid justify-center items-center my-1.5"} labelCSS={"mb-1"}
                                         placeHolderText={"e.g. Mercy-Grey Hospital"}>
                        </SimpleTextInput>
                    </div>
                    <div className={"flex flex-col"}>
                        <div className={"grid justify-center items-center my-1.5"}> {/* Priority Dropdown */}
                            {/*<label
                            className={"mr-1"}
                            htmlFor={"priority"}
                        >Priority Level: </label>*/}
                            <label className="label">Priority </label>
                            <CreateDropdown dropBtnName={"Priority "} dropdownID={"UrgencyID"} isSearchable={false}
                                            populationArr={priorityLevels}
                                            setSelected={setUrgencyDDIndx}
                                            resetDropdown={resetDropdownUrg}
                                            resetOnSelect={false}
                                            runOnChange={() => {
                                                return -1;
                                            }}
                                            inputCSS={"n/a"} selectCSS={"dropdown"}
                                            setResetDropdown={setResetDropdownUrg}/>
                        </div>

                        <div
                            className={"grid justify-center items-center my-1.5 mb-2"}>{/* Mode of Transportation Input */}

                            <label className="label">Mode of Transportation </label>
                            <CreateDropdown dropBtnName={"Mode of Transportation "} dropdownID={"transport"}
                                            isSearchable={false}
                                            populationArr={modeTrans}
                                            setSelected={setTransportIndex}
                                            resetDropdown={resetDropdownTrans}
                                            resetOnSelect={false}
                                            runOnChange={() => {
                                                return -1;
                                            }}
                                            inputCSS={"n/a"} selectCSS={"dropdown"}
                                            setResetDropdown={setResetDropdownTrans}/>

                        </div>

                        <div
                            className={"grid justify-center items-center my-1.5 mb-2"}> {/* Additional notes textbox */}
                            <label className="label">Extra Notes </label>
                            <textarea
                                className={"p-2 w-60 bg-white text-black rounded-full border-2 border-gray-500 drop-shadow cursor-pointer overflow-y-hidden h-11"}
                                id={"additional"}
                                placeholder={"Extra Notes"}
                                value={additional}
                                onChange={(e) => setAdditional(e.target.value)}

                            />
                        </div>
                    </div>
                </div>

                <RequestButtons submit={submit}/>


            </form>
            <div className={"grid justify-center items-center m-auto my-1.5 mb-5"}>
                <button onClick={(event) => closeTransportForm(event)} className={
                    "bg-tableText p-1 rounded-xl w-24 font-bold cursor-pointer flex justify-center m-auto mb-2 mt-5"}>
                    Close
                </button>

                <p className={"flex justify-center items-center mt-5"}>Created By: Michael and Ryan</p>
            </div>
            <div id={"transport-popup"} className={"text-center flex justify-center m-auto opacity-0 "}>
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
