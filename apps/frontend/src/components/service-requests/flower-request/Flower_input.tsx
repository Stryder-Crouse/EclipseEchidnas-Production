import React, {useState, ChangeEvent} from 'react';
import '../../../css/route-css/Flower_input.css';
import axios from "axios";
import {FlowReq, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import RequestButtons from "../../buttons/RequestButtons.tsx";

export default function Flower_input() {
    const [sender,setSender] = useState("");
    const [priority,setPriority] = useState("low");
    const [location,setLocation] = useState("");
    const [flowerType,setFlowerType] = useState("");
    const [flowerQuantity,setFlowerQuantity] = useState(1);
    const [flowerRecipient,setFlowerRecipient] = useState("");
    const [extraInfo,setExtraInfo] = useState("");
    const [status,setStatus] = useState("unassigned");
    const [message,setMessage] = useState("");



        async function submitForm() {
            const serviceRequest: ServiceRequest = {
                reqType: "flower delivery",
                reqLocationID: location,
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

            const sendInfo = {serviceRequest,flowerRequest};

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
            setLocation('');
            setFlowerType('');
            setFlowerQuantity(1);
            setFlowerRecipient('');
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

        function handleLocation(e: ChangeEvent<HTMLInputElement>) {
            setLocation(e.target.value);
        }

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
        <div>
            <>
                <div className="App">
                    <h1>Flower Request </h1>
                    <div className={"form-group"}>
                        <label className="label">Name </label>
                        <input
                            value={sender}
                            type={"text"}
                            className={"border-2 p-2 border-black rounded-2xl grow"}
                            onChange={handleSender}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Priority </label>
                        <select
                            id={"priorityType"}
                            name={"priorityType"}
                            value={priority}
                            onChange={handlePriority}
                            className={"px-10 gap-5 py-5 flex flex-col rounded-2 border-white"}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">Location </label>
                        <input
                            value={location}
                            type={"text"}
                            className={"border-2 p-2 border-black rounded-2xl grow"}
                            onChange={handleLocation}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Flower Name </label>
                        <input
                            value={flowerType}
                            type={"text"}
                            className={"border-2 p-2 border-black rounded-2xl grow"}
                            onChange={handleFlowerType}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Flower Quantity </label>
                        <input
                            value={flowerQuantity}
                            type={"text"}
                            className={"border-2 p-2 border-black rounded-2xl grow"}
                            onChange={handleFlowerQuantity}
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Flower Recipient </label>
                        <input
                            value={flowerRecipient}
                            type={"text"}
                            className={"border-2 p-2 border-black rounded-2xl grow"}
                            onChange={handleFlowerRecipient}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Status </label>
                        <select
                            value={status}
                            className={"px-10 gap-5 py-5 flex flex-col rounded-2 border-white"}
                            onChange={handleStatus}
                        >
                            <option value="unassigned">Unassigned</option>
                            <option value="assigned">Assigned</option>
                            <option value="inprogress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label"> Message </label>
                        <input
                            value={message}
                            type={"text"}
                            className={"border-2 p-2 border-black rounded-2xl grow"}
                            onChange={handleMessage}

                        />
                    </div>

                    <RequestButtons submit={submitForm}/>
                </div>
            </>
        </div>

    );


}




