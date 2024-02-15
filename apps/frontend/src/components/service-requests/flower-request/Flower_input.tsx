import React, {useState, useEffect,  ChangeEvent} from 'react';
import axios from "axios";
import {FlowReq, ReqTypes, ServiceRequest} from "../../../../../backend/src/algorithms/Requests/Request.ts";
import RequestButtons from "../../buttons/RequestButtons.tsx";
import {CreateDropdown} from "../../CreateDropdown.tsx";
import {NodeDataBase} from "../../../../../backend/src/DataBaseClasses/NodeDataBase.ts";
import status from "../../../../../backend/src/algorithms/Requests/Status.ts";
import SimpleTextInput from "../../inputComponents/SimpleTextInput.tsx";


let longNames:string[] = [];

export default function Flower_input() {
    const [sender,setSender] = useState("");
    const [priority,setPriority] = useState("low");
    //const [location,setLocation] = useState("");
    const [flowerType,setFlowerType] = useState("");
    const [flowerQuantity,setFlowerQuantity] = useState("");
    const [flowerRecipient,setFlowerRecipient] = useState("");
    const [extraInfo,setExtraInfo] = useState("");
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
                status: status.Unassigned,
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
            setMessage('');
            setExtraInfo('');
        }
        // Optionally, you can reset the form fields after submission

        function handlePriority(e: ChangeEvent<HTMLSelectElement>) {
            setPriority(e.target.value);
        }




    return(
        <div className={"mt-3 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl p-1 align-self-center"}>
            <form className="p-2">
                <div className="App">
                    <h1 className={"grid mb-3 justify-center font-bold text-xl"}>Flower Request </h1>

                    <SimpleTextInput id={"senderName"} labelContent={"Name"} inputStorage={sender}
                                     setInputStorage={setSender}
                                     inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                     divCSS={"grid justify-center items-center my-1.5"} labelCSS={"label"}
                                     placeHolderText={""}>
                    </SimpleTextInput>


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

                    </div>

                    <SimpleTextInput id={"flowertype"} labelContent={"Flower Name"} inputStorage={flowerType}
                                     setInputStorage={setFlowerType}
                                     inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                     divCSS={"grid justify-center items-center my-1.5"} labelCSS={"label"}
                                     placeHolderText={""}>
                    </SimpleTextInput>

                    <SimpleTextInput id={"flowerquantity"} labelContent={"Flower Quantity"} inputStorage={flowerQuantity}
                                     setInputStorage={setFlowerQuantity}
                                     inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                     divCSS={"grid justify-center items-center my-1.5"} labelCSS={"label"}
                                     placeHolderText={""}>
                    </SimpleTextInput>

                    <SimpleTextInput id={"flowerrecipient"} labelContent={"Flower Recipient"} inputStorage={flowerRecipient}
                                     setInputStorage={setFlowerRecipient}
                                     inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                     divCSS={"grid justify-center items-center my-1.5"} labelCSS={"label"}
                                     placeHolderText={""}>
                    </SimpleTextInput>


                    <SimpleTextInput id={"additionalNotes"} labelContent={"Message"} inputStorage={message}
                                     setInputStorage={setMessage}
                                     inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                     divCSS={"grid justify-center items-center my-1.5"} labelCSS={"label"}
                                     placeHolderText={""}>
                    </SimpleTextInput>


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



