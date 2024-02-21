import {CreateDropdown} from "./CreateDropdown.tsx";
import {FloorToIndex, Node, NULLNODE} from "../../../backend/src/algorithms/Graph/Node.ts";
import {Dispatch, SetStateAction, useState} from "react";



export interface levelStates{
    setSelectedFloorIndex: Dispatch<SetStateAction<FloorToIndex>>;
    startNode:Node;
    setStartNode: Dispatch<SetStateAction<Node>>;
    endNode:Node;
    setEndNode: Dispatch<SetStateAction<Node>>;
    locations:Node[];
    setPathFindingType:Dispatch<SetStateAction<string>>;
    textDirections:string[]
}

const searchOptions:string[] = ["A*","BFS","DFS"];

export default function MapSearchBar({startNode:startNode,
                                         setStartNode:setStartNode,
                                         endNode:endNode,
                                         setEndNode:setEndNode,
                                         locations:locations,
                                         setPathFindingType:setPathFindingType,
                                         textDirections
                                     }:levelStates) {


    const [resetDropdown, setResetDropdown] = useState(false);
    const [selected, setSelected] = useState(-1);

    const [selectedText, setSelectedText] = useState("Start Location");

    //create an array of longNames to pass to CreateDropDown
    const longNames:string[] = locations.map((node)=>{return node.longName; });

    let selectedNode=NULLNODE;
        //todo change later
        //find the node by the long name
        if (selected != -1) {
            selectedNode = locations.at(selected)!;
            setSelected(-1);
        };

    if(selectedNode != NULLNODE){
        onLocationSelect(selectedNode,startNode,endNode,setStartNode,
            setEndNode,setSelectedText);
    }

    function openLocations() {
        const openLocationInput = document.getElementById("locationDropdown");
        if (openLocationInput != null) {
            openLocationInput.style.display = "block";
        }
    }

    function closeLocations() {
        const closeLocationInput = document.getElementById("locationDropdown");
        if (closeLocationInput != null) {
            closeLocationInput.style.display = "none";
        }
    }

    const [selectedAlgoIndex, setSelectedAlgoIndex] =useState(-1);





    if(selectedAlgoIndex!=-1){
        setPathFindingType(searchOptions[selectedAlgoIndex]);
        setSelectedAlgoIndex(-1);
    }

    return (
        <div className="ml-5 relative flex flex-col">
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Go to Location"*/}
            {/*    className="w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg"*/}
            {/*/>*/}
            <div onClick={openLocations}>
                <CreateDropdown dropBtnName={selectedText} dropdownID={"Location"} isSearchable={true}
                                populationArr={longNames} resetDropdown={resetDropdown}
                                setSelected={setSelected}
                                inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                                selectCSS={""}
                                resetOnSelect={true} setResetDropdown={setResetDropdown}>
                </CreateDropdown>
            </div>


            <div className={"hidden"} id={"locationDropdown"}>
                <div className={"w-60 p-2 rounded-3xl border-gray-500 border-2 pr-10 drop-shadow-lg mt-1 bg-white"}>
                    <b>Start: </b>{startNode.longName}
                </div>
                <div className={"w-60 p-2 rounded-3xl border-gray-500 border-2 pr-10 drop-shadow-lg mt-1 bg-white"}>
                    <b>End: </b>{endNode.longName}
                </div>

                <div className={"ml-5 mt-1"}>
                    <CreateDropdown
                        dropBtnName={selectedText}
                        dropdownID={"Location"}
                        isSearchable={true}
                        populationArr={longNames}
                        resetDropdown={resetDropdown}
                        setSelected={setSelected}
                        inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                        selectCSS={""}
                        resetOnSelect={true}
                        setResetDropdown={setResetDropdown}
                    />

                </div>
                <div className="flex flex-col border-gray-500 border-2 w-60 h-48 ml-5 mt-1 bg-white rounded-3xl p-2">
                    <div className="overflow-y-scroll overflow-x-hidden">
                        {textDirections.map((direction, index) => (
                            <div key={index} className="flex w-full rounded-3xl pl-2 pr-2 pt-1 pb-1 bg-gray-200 m-2">
                                {direction}
                            </div>
                        ))}
                    </div>
                </div>

                <button onClick={closeLocations}>Close</button>
            </div>


            {/*populate div for locations*/}
        </div>
    );


}

function onLocationSelect(node: Node, startNode: Node, endNode: Node, setStartNode: Dispatch<SetStateAction<Node>>
    , setEndNode: Dispatch<SetStateAction<Node>>, setSelectedText: Dispatch<SetStateAction<string>>
) {

    console.log("select");
    console.log(node);

    if (startNode == NULLNODE && endNode == NULLNODE) {
        setStartNode(node);
        setSelectedText("End Location");
    } else if (endNode == NULLNODE) {
        setEndNode(node);
        setSelectedText("Start Location");
    } else {
        setStartNode(node);
        setEndNode(NULLNODE);
        setSelectedText("End Location");
    }
}


