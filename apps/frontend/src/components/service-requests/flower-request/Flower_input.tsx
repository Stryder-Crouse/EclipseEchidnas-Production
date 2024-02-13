import React, {useState, ChangeEvent} from 'react';
import '../../../css/route-css/Flower_input.css';
import axios from "axios";
import {flowerRequest}  from "../../../../../backend/src/algorithms/Requests/Request.ts";
import RequestButtons from "../../buttons/RequestButtons.tsx";

export default function Flower_input() {
    const [sender,setSender] = useState("");
    const [priority,setPriority] = useState("low");
    const [location,setLocation] = useState("");
    const [flowerType,setFlowerType] = useState("");
    const [flowerQuantity,setFlowerQuantity] = useState("");
    const [flowerRecipient,setFlowerRecipient] = useState("");
    const [status,setStatus] = useState("unassigned");
    const [Message,setMessage] = useState("");



        async function submitForm() {


            try {
                //Make a Service Request Data Type and then a Med Request Data Type
                // this is bc Front End will beconfused if we pass it a bunch of data so use data structures
                //Make a Med Req after the service req (Med req needs service req's id, so med req cannot be made before)
                const newFlowerRequest:flowerRequest = {
                    name: sender,
                    priority: priority,
                    location: location,
                    flowerName: flowerType,
                    flowerQuantity: flowerQuantity,
                    flowerRecipient: flowerRecipient,
                    status:status,
                    Message:Message,
                };

                clear();

                //Post Med Req to DB (pass in objects of MedReq and ServiceRequest as an array)
                await axios.post("/api/serviceRequests",
                    [newFlowerRequest], {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });


            } catch {
                console.error("Error with trying to save Service Req in ServiceRequestPage.tsx");
            }


        }

        function clear() {
            setSender('');
            setPriority('');
            setLocation('');
            setFlowerType('');
            setFlowerQuantity('');
            setFlowerRecipient('');
            setStatus('');
            setMessage('');
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

        function handleFloyerType(e: ChangeEvent<HTMLInputElement>) {
            setFlowerType(e.target.value);
        }

        function handleFlowerQuantity(e: ChangeEvent<HTMLInputElement>) {
            setFlowerQuantity(e.target.value);
        }
        function handleFlowerRecepientr(e: ChangeEvent<HTMLInputElement>) {
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
                            onChange={handleFloyerType}
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
                            onChange={handleFlowerRecepientr}
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
                            value={Message}
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




