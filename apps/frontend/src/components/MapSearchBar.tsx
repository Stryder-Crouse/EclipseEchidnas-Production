import {CreateDropdown} from "./CreateDropdown.tsx";
import {FloorToIndex, Node, NULLNODE} from "../../../../packages/common/src/algorithms/Graph/Node.ts";
import {Dispatch, SetStateAction, useState} from "react";
import {TextDirectionsDropDown} from "./map/TextDirectionsDropDown.tsx";



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
                                inputCSS={"w-60 p-2 border-gray-500 text-black rounded-full border-2 pr-10 drop-shadow-lg "}
                                selectCSS={""}
                                resetOnSelect={true} setResetDropdown={setResetDropdown}>
                </CreateDropdown>
            </div>


            <div className={"hidden"} id={"locationDropdown"}>
                <div
                    className={"w-60 p-2 rounded-3xl border-gray-500 border-2 pr-10 drop-shadow-lg mt-1 bg-white overflow-hidden"}
                    style={{
                        width: "15rem", // Initial width set to match the same width as all other divs
                        maxHeight: "50px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        transition: "max-height 0.5s, width 0.5s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.maxHeight = "none";
                        e.currentTarget.style.width = "15rem";  // Set the width to initial value
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.maxHeight = "50px";
                        e.currentTarget.style.width = "15rem";  // Set the initial width here
                    }}
                    title={startNode.longName}
                >

                    <b>Start: </b>{startNode.longName}
                </div>


                <div
                    className={"w-60 p-2 rounded-3xl border-gray-500 border-2 pr-10 drop-shadow-lg mt-1 bg-white overflow-hidden"}
                    style={{
                        maxHeight: "50px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        transition: "max-height 0.5s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.maxHeight = "none";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.maxHeight = "50px";
                    }}
                    title={endNode.longName}
                >
                    <b>End: </b>{endNode.longName}
                </div>


                <div className={" mt-1"}>
                    <CreateDropdown
                        dropBtnName={"Search Type"} dropdownID={"Search Type"} populationArr={searchOptions}
                        isSearchable={false}
                        resetOnSelect={false} resetDropdown={resetDropdown}
                        setResetDropdown={setResetDropdown} setSelected={setSelectedAlgoIndex}
                        inputCSS={"text-gray focus:outline-none p-2"}
                        selectCSS={"transition-all hover:bg-navy w-32 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"}></CreateDropdown>
                </div>


               <TextDirectionsDropDown closeLocations={closeLocations} textDirections={textDirections}></TextDirectionsDropDown>


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


