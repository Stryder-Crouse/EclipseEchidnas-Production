import MapSearchBar from "./MapSearchBar.tsx";
import {FloorToIndex, Node} from "../../../backend/src/algorithms/Graph/Node.ts";
import {Dispatch, SetStateAction, useState} from "react";
import {CreateDropdown} from "./CreateDropdown.tsx";


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


export default function TopMapButtons({setSelectedFloorIndex:setFloor,
                                          startNode:startNode,
                                          setStartNode:setStartNode,
                                      endNode:endNode,
                                          setEndNode:setEndNode,
                                          locations:locations,
                                        setPathFindingType:setPathFindingType,
                                          textDirections
                                      }:levelStates) {

    const [selectedAlgoIndex, setSelectedAlgoIndex] =useState(-1);


    const [resetDropdown, setResetDropdown] = useState(false);


    if(selectedAlgoIndex!=-1){
        setPathFindingType(searchOptions[selectedAlgoIndex]);
        setSelectedAlgoIndex(-1);
    }

    return (
        <div className="z-10 max-h-10 flex mt-5 justify-content-center">
            <div className={"flex flex-col"}>
                <MapSearchBar endNode={endNode} locations={locations} setEndNode={setEndNode}
                              setStartNode={setStartNode}
                              startNode={startNode}/>
                <div className={"ml-5 mt-1"}>
                    <CreateDropdown
                        dropBtnName={"Search Type"} dropdownID={"Search Type"} populationArr={searchOptions}
                        isSearchable={false}
                        resetOnSelect={false} resetDropdown={resetDropdown}
                        setResetDropdown={setResetDropdown} setSelected={setSelectedAlgoIndex}
                        inputCSS={""}
                        selectCSS={"transition-all hover:bg-navy w-32 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"}></CreateDropdown>
                </div>
                <div className={"border-gray-500 border-2 w-60 h-60 ml-5 mt-1 bg-white rounded-3xl p-2 "}>
                    {
                        textDirections.map((direction)=>{
                            return <div className={"w-[90%] rounded-3xl pl-2 pr-2 pt-1 pb-1 bg-gray-200 m-2"}>{direction}</div>;
                        })
                    }
                </div>
            </div>

            <button
                className="transition-all  hover:bg-navy w-32 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"
                onClick={() => {
                    setFloor(FloorToIndex.LowerLevel2);
                }}
            >
                Lower Level 2
            </button>

            <button
                className=" transition-all hover:bg-navy w-32 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"
                onClick={() => {
                    setFloor(FloorToIndex.LowerLevel1);
                }}
            >
                Lower Level 1
            </button>

            <button
                className="transition-all  hover:bg-navy w-32 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"
                onClick={() => {
                    setFloor(FloorToIndex.Level1);
                }}
            >
                Level 1
            </button>

            <button
                className="transition-all hover:bg-navy  w-32 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"
                onClick={() => {
                    setFloor(FloorToIndex.Level2);
                }}
            >
                Level 2
            </button>

            <button
                className="transition-all hover:bg-navy w-32 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"
                onClick={() => {
                    setFloor(FloorToIndex.Level3);
                }}
            >
                Level 3
            </button>
        </div>
    );
}
