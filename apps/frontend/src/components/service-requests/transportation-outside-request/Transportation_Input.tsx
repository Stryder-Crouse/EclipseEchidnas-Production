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
        <body>
        <div>
            <form>
                <h1>External Patient Transportation</h1>
                <div>

                    <div>
                        <label htmlFor={"priority"}>Priority Level: </label>
                        <select
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

                    <div>
                        <input
                            type={"text"}
                            value={patientName}
                            placeholder={"Patient Name: "}
                            id={"patientName"}
                            onChange={(e) => setPatientName(e.target.value)}
                        /> <br/>
                        {//todo FNFN change patient room to be a dropdown of hospital locations
                        }
                        <input
                            type={"text"}
                            value={room}
                            placeholder={"Patient Room: "}
                            id={"room"}
                            onChange={(e) => setRoom(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                            type={"text"}
                            value={destination}
                            placeholder={"Destination: "}
                            id={"destination"}
                            onChange={(e) => setDestination(e.target.value)}
                        /> <br/>

                        <label htmlFor={"modeTransport"}>Mode of Transportation: </label>
                        <select
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

                    <input
                        type={"text"}
                        id={"additional"}
                        placeholder={"Additional Notes"}
                        value={additional}
                        onChange={(e) => setAdditional(e.target.value)}
                    /><br/> <br/>

                    <button
                        type={"button"}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
        </body>
    );


}
