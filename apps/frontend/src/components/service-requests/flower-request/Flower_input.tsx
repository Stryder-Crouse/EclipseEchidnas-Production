import React, {useState, useEffect,  ChangeEvent} from 'react';
import '../../../css/route-css/Flower_input.css';
import axios from "axios";
import {FlowReq, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import RequestButtons from "../../buttons/RequestButtons.tsx";
import {CreateDropdown} from "../../CreateDropdown.tsx";
import {NodeDataBase} from "../../../../../backend/src/DataBaseClasses/NodeDataBase.ts";


const longNames:string[] = [];

export default function Flower_input() {
    const [sender,setSender] = useState("");
    const [priority,setPriority] = useState("low");
    //const [location,setLocation] = useState("");
    const [flowerType,setFlowerType] = useState("");
    const [flowerQuantity,setFlowerQuantity] = useState(1);
    const [flowerRecipient,setFlowerRecipient] = useState("");
    const [extraInfo,setExtraInfo] = useState("");
    const [status,setStatus] = useState("unassigned");
    const [message,setMessage] = useState("");

    const [resetDropdown, setResetDropdown] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [locations, setLocations] = useState<NodeDataBase[]>([]);


    useEffect(()=>{
        getLocations().then(
            (result)=>{
                setLocations(result);
                result.forEach((node)=>{ longNames.push(node.longName);});

            });

    },[]);
        async function submitForm() {
            // console.log("\n\n\n\n\n\n\nGOT HERE\n\n\n\n\n\n\n\n");
            const serviceRequest: ServiceRequest = {
                reqType: "flower delivery",
                reqLocationID: locations[selected].nodeID,
                extraInfo: extraInfo,
                status: status,
                assignedUName: "",
                reqPriority: priority,
                reqID: -1,
            };

            const flowerRequest: FlowReq = {
                flowType: flowerType,
                quantity: flowerQuantity,
                sender: sender,
                receiver: flowerRecipient,
                message: message,
                genReqID: -1,
            };

            const sendInfo = [serviceRequest,flowerRequest];

            try{
                await axios.post(
                    "/api/serviceRequests/flowReq",
                    sendInfo,
                    {
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                    },
                );
            } catch(error){
                throw new Error("Error with sending flower request");
            }


            clear();


        }

        function clear() {
            setSender('');
            setPriority('');
            setFlowerType('');
            setFlowerQuantity(1);
            setFlowerRecipient('');
            setResetDropdown(true);
            setStatus('');
            setMessage('');
            setExtraInfo('');
        }
        // Optionally, you can reset the form fields after submission
        function handleSender(e: ChangeEvent<HTMLInputElement>) {
            setSender(e.target.value);
        }

        function handlePriority(e: ChangeEvent<HTMLSelectElement>) {
            setPriority(e.target.value);
        }

        // function handleLocation(e: ChangeEvent<HTMLInputElement>) {
        //     setLocation(e.target.value);
        // }

        function handleFlowerType(e: ChangeEvent<HTMLInputElement>) {
            setFlowerType(e.target.value);
        }

        function handleFlowerQuantity(e: ChangeEvent<HTMLInputElement>) {
            setFlowerQuantity(e.target.valueAsNumber);
        }
        function handleFlowerRecipient(e: ChangeEvent<HTMLInputElement>) {
            setFlowerRecipient(e.target.value);
        }

        function handleStatus(e: ChangeEvent<HTMLSelectElement>) {
            setStatus(e.target.value);
        }

        function handleMessage(e: ChangeEvent<HTMLInputElement>) {
            setMessage(e.target.value);
        }


    return(
        <div className={"mt-3 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl p-1 align-self-center"}>
            <form className="p-2">
                <div className="App">
                    <h1 className={"flex mb-3 justify-center font-bold text-xl"}>Flower Request </h1>
                    <div className={"flex justify-center items-center my-1.5"}>
                        <label className="label" form={"senderName"}>Name </label>
                        <input
                            id={"senderName"}
                            value={sender}
                            type={"text"}
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            onChange={handleSender}
                        />
                    </div>

                    <div className="flex justify-center items-center my-1.5">
                        <label id="priorityType">Priority </label>
                        <select
                            id={"priorityType"}
                            name={"priorityType"}
                            value={priority}
                            onChange={handlePriority}
                            className={"p-1 w-60 bg-white text-black rounded-2xl border border-black drop-shadow cursor-pointer"}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>

                    <div className="flex justify-center items-center my-1.5">

                        <label className="label">Location </label>
                        <CreateDropdown dropBtnName={"Locations"} dropdownID={"Location"} isSearchable={true}
                                        populationArr={longNames} resetDropdown={resetDropdown}
                                        setSelected={setSelected}
                                        inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                                        selectCSS={""}
                                        resetOnSelect={false} setResetDropdown={setResetDropdown}/>

                        {/*<input*/}
                        {/*    value={location}*/}
                        {/*    type={"text"}*/}
                        {/*    className={"border-2 p-2 border-black rounded-2xl grow"}*/}
                        {/*    onChange={handleLocation}*/}
                        {/*/>*/}
                    </div>

                    <div className="flex justify-center items-center my-1.5">
                        <label className="label" id={"flowertype"}>Flower Name </label>
                        <input
                            id={"flowertype"}
                            value={flowerType}
                            type={"text"}
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            onChange={handleFlowerType}
                        />
                    </div>

                    <div className="flex justify-center items-center my-1.5">
                        <label className="label" form={"flowerquantity"}>Flower Quantity </label>
                        <input
                            id={"flowerquantity"}
                            value={flowerQuantity}
                            type={"text"}
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            onChange={handleFlowerQuantity}
                        />
                    </div>
                    <div className="flex justify-center items-center my-1.5">
                        <label className="label" form={"flowerrecipient"}>Flower Recipient </label>
                        <input
                            id={"flowerrecipient"}
                            value={flowerRecipient}
                            type={"text"}
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            onChange={handleFlowerRecipient}
                        />
                    </div>

                    <div className="flex justify-center items-center my-1.5">
                        <label className="label" form={"statusTime"}>Status </label>
                        <select
                            id={"statusTime"}
                            value={status}
                            className={"p-1 w-60 bg-white text-black rounded-2xl border border-black drop-shadow cursor-pointer"}
                            onChange={handleStatus}
                        >
                            <option value="unassigned">Unassigned</option>
                            <option value="assigned">Assigned</option>
                            <option value="inprogress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex justify-center items-center my-1.5">
                        <label className="label" form={"additionalNotes"}> Message </label>
                        <input
                            id={"additionalNotes"}
                            value={message}
                            type={"text"}
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            onChange={handleMessage}

                        />
                    </div>

                    <RequestButtons submit={submitForm}/>
                </div>
            </form>
        </div>

    );


}
async function getLocations() {
    //load edges and node from database
    const nodesDB = await axios.get<NodeDataBase[]>("/api/load-nodes");
    return nodesDB.data;
}



