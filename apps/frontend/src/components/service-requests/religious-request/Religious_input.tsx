import React, {useState} from "react";
import {CreateDropdown} from "../../CreateDropdown.tsx";
import RequestButtons from "../../buttons/RequestButtons.tsx";
import {Priority, Status} from "../priorityAndStatusEnums.tsx";
import {ReligRequest, ReqTypes, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import axios from "axios";

export default function Religious_input() {
    const [service, setService] = useState("");
    const [nameP, setNameP] = useState("");
    const [location, setLocation] = useState("");
    const [extraInfo, setExtraInfo] = useState("");

    const [religionDDIndx, setReligionDDIndx] = useState(-1);
    const [urgencyDDIndx, setUrgencyDDIndx] = useState(-1);

    const [resetDropdownRel, setResetDropdownRel] = useState(false);
    const [resetDropdownUrg, setResetDropdownUrg] = useState(false);

    //let locations : Node[];
    const locationNames = ["test", "option 2", "another location"];

    const religions = [
        "Buddhism",
        "Christianity (Catholicism)",
        "Christianity (Mormonism)",
        "Christianity (Non-Denominational)",
        "Christianity (Protestantism)",
        "Hinduism",
        "Islam",
        "Jainism",
        "Judaism",
        "Sikhism",
        "Shinto",
        "Other"];
    async function handleSubmit() {
        //send to backend
        const data1: ReligRequest = {
            patientName: nameP,
            religion: religions[religionDDIndx],
            reqDescription: service,
            genReqID: -1,
        };
        const data0:ServiceRequest = {
            reqType: ReqTypes.religReq,
            reqPriority: locationNames[urgencyDDIndx],
            reqLocationID: location,
            extraInfo: extraInfo,
            status: Status.unassigned,
            assignedUName: "No one", //should not matter
            reqID: -1 //should not matter
        };

        //clear fields
        setService("");
        setResetDropdownRel(true);
        setResetDropdownUrg(true);
        setNameP("");
        setLocation("");
        setExtraInfo("");

        const res = await axios.post("/api/serviceRequests/religiousRequest", [data0,data1], {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.status === 200) {
            console.log("recorded religious request");
        }
        else{
            console.log("Failed to record religious request");
        }
    }


    return (
        <div className={"servicePage grid"}>
                <table>
                    {/*th need to be in a table please change it later to a tag or b tag*/}
                    <tbody>
                    <tr>
                        <th>Religious Service Request</th>
                    </tr>
                    </tbody>
                </table>
            <form className={"relig-service-form"}>
                <label className={"formElement"}>Location of Service</label>
                <input placeholder={"Room Name & Number"}
                       type={"text"}
                       className={"text-fields formElement"}
                       id={"location"}
                       value={location}
                       onChange={(e) => setLocation(e.target.value)}
                       required>
                </input>

                <input placeholder={"Patient Name"}
                       type={"text"}
                       className={"input-fields"}
                       id={"name"}
                       value={nameP}
                       onChange={(e) => setNameP(e.target.value)}
                       required>
                </input>

                <CreateDropdown dropBtnName={"Religion"} dropdownID={"ReligionID"} isSearchable={false}
                                populationArr={religions}
                                setSelected={setReligionDDIndx}
                                resetDropdown={resetDropdownRel}
                                resetOnSelect={false}
                                inputCSS={"n/a"} selectCSS={"dropdown"}
                                setResetDropdown={setResetDropdownRel}/>

                <textarea placeholder={"Describe the religious service to be performed here."}
                          className={"input-fields" /*className may need to be different to have a larger area*/}
                          onChange={(e) => setService(e.target.value)}
                          id={"service"}
                          value={service}
                          required>
                </textarea>

                <CreateDropdown dropBtnName={"Urgency"} dropdownID={"UrgencyID"} isSearchable={false}
                                populationArr={[Priority.low,Priority.normal,Priority.high,Priority.emergency]}
                                setSelected={setUrgencyDDIndx}
                                resetDropdown={resetDropdownUrg}
                                resetOnSelect={false}
                                inputCSS={"n/a"} selectCSS={"dropdown"}
                                setResetDropdown={setResetDropdownUrg}/>

                <textarea placeholder={"Any extra notes?"}
                          className={"input-fields" /*className may need to be different to have a larger area*/}
                          onChange={(e) => setExtraInfo(e.target.value)}
                          id={"service"}
                          value={extraInfo}
                          required>
                </textarea>

                <RequestButtons submit={handleSubmit}/>
                {/*// this should technically take you to list of service request*/}
            </form>
            <div className={"flex justify-center items-center my-1.5"}>
                <p>Created By: Alana and Grace</p>
            </div>
        </div>
    );


}
