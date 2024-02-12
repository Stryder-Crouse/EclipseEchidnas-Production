import React from "react";
import {useState} from "react";


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

    //todo BNBN Implement the new version of backend integration (similar to assignment 3 but bigger and scarier

    return (
        <body className={"font-project"}>

        <div className={"min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl p-1"}>

            <form className={"p-1"}>

                <h1 className={"flex mb-3 justify-center font-bold text-xl"}>External Patient Transportation</h1>

                <div className={"px-10"}>

                    <div className={"flex justify-center items-center my-1.5"}>
                        {/*<label
                            className={"mr-1"}
                            htmlFor={"priority"}
                        >Priority Level: </label>*/}
                        <select
                            className={"p-1 w-60 bg-white text-black rounded-2xl border border-black drop-shadow"}
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

                    <div className={"flex justify-center items-center my-1.5"}>
                        <input
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            type={"text"}
                            value={patientName}
                            placeholder={"Patient Name: "}
                            id={"patientName"}
                            onChange={(e) => setPatientName(e.target.value)}
                        />
                    </div>

                    <div className={"flex justify-center items-center my-1.5"}>
                        {//todo FNFN change patient room to be a dropdown of hospital locations
                        }
                        <input
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            type={"text"}
                            value={room}
                            placeholder={"Patient Room: "}
                            id={"room"}
                            onChange={(e) => setRoom(e.target.value)}
                        />
                    </div>

                    <div className={"flex justify-center items-center my-1.5"}>
                        <input
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            type={"text"}
                            value={destination}
                            placeholder={"Destination: "}
                            id={"destination"}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>

                    <div className={"flex justify-center items-center my-1.5"}>
                        {/*<label
                            htmlFor={"modeTransport"}
                        >Mode of Transportation: </label>*/}
                        <select
                            className={"p-1 w-60 bg-white text-black rounded-2xl border border-black drop-shadow"}
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

                    <div className={"flex justify-center items-center my-1.5"}>
                        <input
                            className={"p-1 min-h-full h-20 w-60 bg-white text-black rounded-xl border border-black drop-shadow align-text-top"}
                            type={"text"}
                            id={"additional"}
                            placeholder={"Additional Notes:"}
                            value={additional}
                            onChange={(e) => setAdditional(e.target.value)}
                        />
                    </div>

                    <div className={"flex justify-center items-center my-1.5"}>
                        <button
                            className={"p-1 bg-navStart text-ivoryWhite rounded-xl border border-black drop-shadow font-bold"}
                            type={"button"}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
        </body>
    );


}
