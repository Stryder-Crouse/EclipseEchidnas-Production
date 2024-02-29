import MapSearchBar from "./MapSearchBar.tsx";
import {FloorToIndex, Node, NULLNODE} from "common/src/algorithms/Graph/Node.ts";
import React, {Dispatch, SetStateAction} from "react";
import RefreshSelectionIcon from "../images/MapFunctions/rotate-ccw.png";

export interface levelStates{
    setSelectedFloorIndex: Dispatch<SetStateAction<FloorToIndex>>;
    selectedFloorIndex:number
    startNode:Node;
    setStartNode: Dispatch<SetStateAction<Node>>;
    endNode:Node;
    setEndNode: Dispatch<SetStateAction<Node>>;
    locations:Node[];
    setPathFindingType:Dispatch<SetStateAction<string>>;
    textDirections:string[][]
}


export default function TopMapButtons({setSelectedFloorIndex:setFloor,
                                          startNode:startNode,
                                          setStartNode:setStartNode,
                                      endNode:endNode,
                                          setEndNode:setEndNode,
                                          locations:locations,
                                          setPathFindingType:setPathFindingType,
                                          textDirections,selectedFloorIndex
                                      }:levelStates) {




    return (
        <div className="z-10 h-10 flex mt-5 justify-content-center">
            <div className={"flex flex-col ml-2"}>
                <MapSearchBar
                    endNode={endNode}
                    locations={locations}
                    setEndNode={setEndNode}
                    setStartNode={setStartNode}
                    startNode={startNode}
                    setPathFindingType={setPathFindingType}
                    setSelectedFloorIndex={setFloor}
                    textDirections={textDirections}/>

            </div>

            <button className={`bg-ivoryWhite ml-3 flex self-end rounded-full p-2 w-10 drop-shadow-lg`}
                title={"Refresh Selected Locations"}
                    onClick={() => {
                        setStartNode(NULLNODE);

                        setEndNode(NULLNODE);
                        //close the drop down
                        const openLocationInput = document.getElementById("locationDropdown");
                        if (openLocationInput != null) {
                            openLocationInput.style.display = "none";
                        }
                    }}
            >

                <img src={RefreshSelectionIcon} alt={"Refresh Selection"}/>
            </button>

            <button
                className={`transition-all ${
                    selectedFloorIndex === FloorToIndex.LowerLevel2 ? "bg-navy" : "hover:bg-navy"
                } w-32 text-white p-3 ml-7 bg-navStart rounded-full h-min font-semibold drop-shadow-lg`}
                onClick={() => {
                    setFloor(FloorToIndex.LowerLevel2);

                }}
            >
                Lower Level 2
            </button>

            <button
                className={`transition-all ${
                    selectedFloorIndex === FloorToIndex.LowerLevel1 ? "bg-navy" : "hover:bg-navy"
                } w-32 text-white p-3 ml-7 bg-navStart rounded-full h-min font-semibold drop-shadow-lg`}
                onClick={() => {
                    setFloor(FloorToIndex.LowerLevel1);

                }}
            >
                Lower Level 1
            </button>

            <button
                className={`transition-all ${
                    selectedFloorIndex === FloorToIndex.Level1 ? "bg-navy" : "hover:bg-navy"
                } w-32 text-white p-3 ml-7 bg-navStart rounded-full h-min font-semibold drop-shadow-lg`}
                onClick={() => {
                    setFloor(FloorToIndex.Level1);

                }}
            >
                Level 1
            </button>

            <button
                className={`transition-all ${
                    selectedFloorIndex === FloorToIndex.Level2 ? "bg-navy" : "hover:bg-navy"
                } w-32 text-white p-3 ml-7 bg-navStart rounded-full h-min font-semibold drop-shadow-lg`}
                onClick={() => {
                    setFloor(FloorToIndex.Level2);

                }}
            >
                Level 2
            </button>

            <button
                className={`transition-all ${
                    selectedFloorIndex === FloorToIndex.Level3 ? "bg-navy" : "hover:bg-navy"
                } w-32 text-white p-3 ml-7 bg-navStart rounded-full h-min font-semibold drop-shadow-lg`}
                onClick={() => {
                    setFloor(FloorToIndex.Level3);

                }}
            >
                Level 3
            </button>
        </div>
    );
}
