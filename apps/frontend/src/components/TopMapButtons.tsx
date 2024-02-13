import MapSearchBar from "./MapSearchBar.tsx";
import {FloorToIndex, Node} from "../../../backend/src/algorithms/Graph/Node.ts";
import {Dispatch, SetStateAction} from "react";


export interface levelStates{
    setSelectedFloorIndex: Dispatch<SetStateAction<FloorToIndex>>;
    startNode:Node;
    setStartNode: Dispatch<SetStateAction<Node>>;
    endNode:Node;
    setEndNode: Dispatch<SetStateAction<Node>>;
    locations:Node[];
}

export default function TopMapButtons({setSelectedFloorIndex:setFloor,
                                          startNode:startNode,
                                          setStartNode:setStartNode,
                                      endNode:endNode,
                                          setEndNode:setEndNode,
                                          locations:locations
                                      }:levelStates) {
    return (
        <div className="z-10 max-h-10 flex mt-5 justify-content-center">
            <MapSearchBar endNode={endNode} locations={locations} setEndNode={setEndNode}
                          setStartNode={setStartNode}
                          startNode={startNode}/>

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
