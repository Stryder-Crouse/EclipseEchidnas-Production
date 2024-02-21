import {CreateDropdown} from "./CreateDropdown.tsx";
import { Node, NULLNODE} from "../../../backend/src/algorithms/Graph/Node.ts";
import {Dispatch, SetStateAction, useState} from "react";


export interface searchStates{
    startNode:Node;
    setStartNode: Dispatch<SetStateAction<Node>>;
    endNode:Node;
    setEndNode: Dispatch<SetStateAction<Node>>;
    locations:Node[];
}

export default function MapSearchBar({startNode:startNode,setStartNode:setStartNode,
                                         endNode:endNode,setEndNode:setEndNode,
                                         locations:locations}:searchStates) {


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

    return (
        <div className="ml-5 relative flex flex-col">
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Go to Location"*/}
            {/*    className="w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg"*/}
            {/*/>*/}
            <CreateDropdown dropBtnName={selectedText} dropdownID={"Location"} isSearchable={true}
                            populationArr={longNames} resetDropdown={resetDropdown}
                             setSelected={setSelected}
                            runOnChange={()=>{return -1;}}
                            inputCSS={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg "}
                            selectCSS={""}
             resetOnSelect={true} setResetDropdown={setResetDropdown}>
            </CreateDropdown>
            <div className={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg mt-1 bg-white"}>
                <b>Start: </b>{startNode.longName}
            </div>
            <div className={"w-60 p-2 rounded-full border-gray-500 border-2 pr-10 drop-shadow-lg mt-1 bg-white"}>
                <b>End: </b>{endNode.longName}
            </div>

            {/*populate div for locations*/}
        </div>
    );


}

function onLocationSelect(node: Node, startNode: Node, endNode: Node, setStartNode: Dispatch<SetStateAction<Node>>
    , setEndNode: Dispatch<SetStateAction<Node>>,setSelectedText:Dispatch<SetStateAction<string>>
                          ){

    console.log("select");
    console.log(node);

    if(startNode == NULLNODE && endNode == NULLNODE){
        setStartNode(node);
        setSelectedText("End Location");
    }
    else if (endNode == NULLNODE){
        setEndNode(node);
        setSelectedText("Start Location");
    }
    else{
        setStartNode(node);
        setEndNode(NULLNODE);
        setSelectedText("End Location");
    }
}


