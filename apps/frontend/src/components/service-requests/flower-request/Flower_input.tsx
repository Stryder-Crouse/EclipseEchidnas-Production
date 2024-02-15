import React, {useState, useEffect,  ChangeEvent} from 'react';
import '../../../css/route-css/Flower_input.css';
import axios from "axios";
import {FlowReq, ReqTypes, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import RequestButtons from "../../buttons/RequestButtons.tsx";
import {CreateDropdown} from "../../CreateDropdown.tsx";
import {NodeDataBase} from "../../../../../backend/src/DataBaseClasses/NodeDataBase.ts";


let longNames:string[] = [];

export default function Flower_input() {
    const [sender,setSender] = useState("");
    const [priority,setPriority] = useState("low");
    //const [location,setLocation] = useState("");
    const [flowerType,setFlowerType] = useState("");
    const [flowerQuantity,setFlowerQuantity] = useState("");
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

                const locationLongName:string[] = [];
                setLocations(result);
                result.forEach((node)=>{ locationLongName.push(node.longName);});
                longNames=locationLongName;

            });

    },[]);
        async function submitForm() {
            // console.log("\n\n\n\n\n\n\nGOT HERE\n\n\n\n\n\n\n\n");
            const serviceRequest: ServiceRequest = {
                reqType: ReqTypes.flowReq,
                reqLocationID: locations[selected].nodeID,
                extraInfo: extraInfo,
                status: status,
                assignedUName: "",
                reqPriority: priority,
                reqID: -1,
            };

            if(Number.isNaN(parseInt(flowerQuantity))){
                console.log("amount is not a number");
                return;
            }

            const flowerRequest: FlowReq = {
                flowType: flowerType,
                quantity: parseInt(flowerQuantity),
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
            setFlowerQuantity('');
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
                setFlowerQuantity(e.target.value);
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
                    <h1 className={"grid mb-3 justify-center font-bold text-xl"}>Flower Request </h1>
                    <div className={"grid justify-center items-center my-1.5"}>
                        <label className="label" form={"senderName"}>Name </label>
                        <input
                            id={"senderName"}
                            value={sender}
                            type={"text"}
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            onChange={handleSender}
                        />
                    </div>

                    <div className="grid justify-center items-center my-1.5">
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

                    <div className="grid justify-center items-center my-1.5">

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

                    <div className="grid justify-center items-center my-1.5">
                        <label className="label" id={"flowertype"}>Flower Name </label>
                        <input
                            id={"flowertype"}
                            value={flowerType}
                            type={"text"}
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            onChange={handleFlowerType}
                        />
                    </div>

                    <div className="grid justify-center items-center my-1.5">
                        <label className="label" form={"flowerquantity"}>Flower Quantity </label>
                        <input
                            id={"flowerquantity"}
                            value={flowerQuantity}
                            type={"text"}
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            onChange={handleFlowerQuantity}
                        />
                    </div>
                    <div className="grid justify-center items-center my-1.5">
                        <label className="label" form={"flowerrecipient"}>Flower Recipient </label>
                        <input
                            id={"flowerrecipient"}
                            value={flowerRecipient}
                            type={"text"}
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            onChange={handleFlowerRecipient}
                        />
                    </div>

                    <div className="grid justify-center items-center my-1.5">
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

                    <div className="grid justify-center items-center my-1.5">
                        <label className="label" form={"additionalNotes"}> Message </label>
                        <input
                            id={"additionalNotes"}
                            value={message}
                            type={"text"}
                            className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                            onChange={handleMessage}

                        />
                    </div>
                    <div className={"grid justify-center items-center "}>
                        <RequestButtons submit={submitForm}/>
                        <p className={"flex justify-center items-center -mt-5"}>Created By: Shiivek and Syzmon</p>
                    </div>
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



