import MapSearchBar from "./MapSearchBar.tsx";
import {FloorToIndex} from "../../../backend/src/algorithms/Graph/Node.ts";
import {Dispatch, SetStateAction} from "react";


export interface levelStates{
    setSelectedFloorIndex: Dispatch<SetStateAction<FloorToIndex>>;
}

export default function TopMapButtons({setSelectedFloorIndex:setFloor }:levelStates) {
    return (
        <div className="z-10 max-h-10 flex mt-5 justify-content-center">
            <MapSearchBar/>

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
