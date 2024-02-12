import React, {ChangeEvent, useState} from "react";


export default function Sanitation_input() {
    const [sanitationLocation, setsanitationLocation] = useState("");
    const [priority,setPriority] = useState("");
    const [type,setType] = useState("");
    const [extraInfo,setExtraInfo] = useState("");

    const priorityChange = (e:ChangeEvent<HTMLSelectElement>) => {
        setPriority(e.target.value);
    };
    return (

        <>
            <div
                className={"justify-items-center text-2xl border-2 border-gray-400 rounded-2xl p-10 flex flex-col gap-5 rounded-2"}>
                <p><b>Sanitation Requests</b></p>
                <div className="form-group">
                    <label className="label">What Happened: </label>
                    <input
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                        }}
                        type={"text"}
                        className={"border-2 p-2 border-black rounded-2xl grow"}
                    />
                </div>
                <div className="form-group">
                    <label className="label">Location: </label>
                    <input
                        value={sanitationLocation}
                        onChange={(e) => {
                            setsanitationLocation(e.target.value);
                        }}
                        type={"text"}
                        className={"border-2 p-2 border-black rounded-2xl grow"}
                    />
                </div>
                <div className="form-group">
                    <label className="label">Priority </label>
                    <select
                        id={"priorityType"}
                        name={"priorityType"}
                        value={priority}
                        onChange={priorityChange}
                        className={"px-10 gap-5 py-3 flex flex-col rounded-2 border-white"}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="label">Extra Info: </label>
                    <input
                        value={extraInfo}
                        onChange={(e) => {
                            setExtraInfo(e.target.value);
                        }}
                        type={"text"}
                        className={"border-2 p-10 border-black rounded-2xl grow"}
                    />
                </div>
            </div>
        </>
    );


}
