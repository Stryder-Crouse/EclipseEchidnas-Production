import React, {ChangeEvent, useState} from "react";


export default function Sanitation_input() {
    const [sanitationLocation, setsanitationLocation] = useState("");

    function sanitationLocationInput(e: ChangeEvent<HTMLInputElement>) {
        setsanitationLocation(e.target.value);
    }
    return (
        <>
            <div className={"text-field"}>
                <input
                    className={"input-fields"}
                    type={"text"}
                    id={"Sanitation Request Name"}
                    name={"Sanitation Request Name"}
                    placeholder={"Location"}
                    value={sanitationLocation}
                    onChange={sanitationLocationInput}/>
            </div>
            <select>
                <option value="Low Priority">Low Priority</option>
                <option value="Medium Priority">Medium Priority</option>
                <option value="High Priority">High Priority</option>
            </select></>
    );


}
