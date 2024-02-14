import React from "react";
import {useState} from "react";
import {
    OutsideTransport,
    ReqTypes,
    ServiceRequest
} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import axios from "axios";
//import LocationsDropDown from "../../navigation-bar/LocationsDropDown.tsx";


export default function Transportation_Input() {

    enum PriorityLevel {
        Unchosen = "Priority: ",
        Low = "Low",
        Medium = "Medium",
        High = "High",
        Emergency = "Emergency"
    }

    enum ModeTransport {
        Unchosen = "Mode of Transportation: ",
        Ambulance = "Ambulance",
        Helicopter = "Helicopter",
        Boat = "Boat",
        Superhero = "Superhero"
    }

    const [priority, setPriority] = useState(PriorityLevel.Unchosen);
    const [patientName, setPatientName] = useState('');
    const [room, setRoom] = useState('');
    const [destination, setDestination] = useState('');
    const [modeTransport, setModeTransport] = useState(ModeTransport.Unchosen);
    const [additional, setAdditional] = useState('');

    async function submit() {


        try {
            //Make a Service Request Data Type and then a Med Request Data Type
            // this is bc Front End will beconfused if we pass it a bunch of data so use data structures
            const servReq : ServiceRequest = {
                reqType: ReqTypes.tranReq,           //Set req type to med req automatically bc we only make med reqs
                reqLocationID: room,    //Need to know location of where the service request needs to be
                extraInfo: additional,                      //no extra info is asked for a med req so just ignore (empty string)
                assignedUName: "No one",            //upon creation, no employee is assigned
                status: "Unassigned",             //upon creation, nobody is assigned, so set status to unassigned
                reqID:-1,
                reqPriority:"Low"
            };

            const transportData: OutsideTransport = {
                patientName: patientName,
                destination: destination,
                modeOfTransport: modeTransport.valueOf(),
                serviceReqID: -1,
            };
            clear();

            await axios.post("/api/serviceRequests/outsideTransport",
                [servReq,transportData], {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });


        } catch {
            console.error("Error with trying to save Service Req in ServiceRequestPage.tsx");
        }

    }

    function clear() {
        setPriority(PriorityLevel.Unchosen);
        setPatientName("");
        setRoom("");
        setDestination("");
        setModeTransport(ModeTransport.Unchosen);
        setAdditional("");
    }

    return (

        <div className={"mt-3 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl p-1 align-self-center"}>

            <form className={"p-1"}>

                <h1 className={"flex mb-3 justify-center font-bold text-xl"}>External Patient
                    Transportation</h1> {/* Div Title */}

                <div className={""}>

                    <div className={"flex justify-center items-center my-1.5"}> {/* Priority Dropdown */}
                        {/*<label
                            className={"mr-1"}
                            htmlFor={"priority"}
                        >Priority Level: </label>*/}
                        <select
                            className={"p-1 w-60 bg-white text-black rounded-2xl border border-black drop-shadow cursor-pointer"}
                            value={priority}
                            id={"priority"}
                            onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                        >
                            <option value={PriorityLevel.Unchosen}>Priority:</option>
                            <option value={PriorityLevel.Low}>Low</option>
                            <option value={PriorityLevel.Medium}>Medium</option>
                            <option value={PriorityLevel.High}>High</option>
                            <option value={PriorityLevel.Emergency}>Emergency</option>
                        </select>
                    </div>

                    <div className={"grid justify-center items-center my-1.5"}> {/* Patient Name text input */}
                        <label form={"priority"} className={"mb-1"}>Patient Name</label>
                        <input
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            type={"text"}
                            value={patientName}
                            placeholder={"Patient Name: "}
                            id={"patientName"}
                            onChange={(e) => setPatientName(e.target.value)}
                        />
                    </div>

                    <div className={"grid justify-center items-center my-1.5"}> {/* Patient Room Input */}
                        <label form={"room"} className={"mb-1"}>Room Number</label>
                        <input
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            type={"text"}
                            value={room}
                            placeholder={"Patient Room: "}
                            id={"room"}
                            onChange={(e) => setRoom(e.target.value)}
                        />
                    </div>

                    <div className={"grid justify-center items-center my-1.5 mb-2"}>{/* Destination Input */}
                        <label form={"destination"} className={"mb-1"}>Destination</label>
                        <input
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow "}
                            type={"text"}
                            value={destination}
                            placeholder={"Destination: "}
                            id={"destination"}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>

                    <div className={"grid justify-center items-center my-1.5 mb-2"}>{/* Mode of Transportation Input */}
                        {/*<label
                            htmlFor={"modeTransport"}
                        >Mode of Transportation: </label>*/}
                        <select
                            className={"p-1 w-60 bg-white text-black rounded-2xl border border-black shadow cursor-pointer"}
                            value={modeTransport}
                            id={"modeTransport"}
                            onChange={(e) => setModeTransport(e.target.value as ModeTransport)}
                        >
                            <option value={ModeTransport.Unchosen}>Mode of Transportation:</option>
                            <option value={ModeTransport.Ambulance}>Ambulance</option>
                            <option value={ModeTransport.Helicopter}>Helicopter</option>
                            <option value={ModeTransport.Boat}>Boat</option>
                            <option value={ModeTransport.Superhero}>Superhero</option>
                        </select>
                    </div>

                    <div className={"grid justify-center items-center my-1.5 mb-2"}> {/* Additional notes textbox */}
                        <textarea
                            className={"p-1 min-h-full h-20 w-60 bg-white text-black rounded-xl border border-black drop-shadow align-text-top"}
                            id={"additional"}
                            placeholder={"Additional Notes:"}
                            value={additional}
                            onChange={(e) => setAdditional(e.target.value)}
                        />
                    </div>

                    <div className={"flex justify-center items-center my-1.5"}>
                        <button
                            className={"p-1 w-24 bg-navStart text-ivoryWhite rounded-xl border border-black drop-shadow font-bold"}
                            type={"button"}
                            onClick={submit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );


}
