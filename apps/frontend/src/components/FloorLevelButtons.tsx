import {FloorToIndex} from "../../../backend/src/algorithms/Graph/Node.ts";
import {Dispatch, SetStateAction} from "react";

export interface levelStates{
    setSelectedFloorIndex: Dispatch<SetStateAction<FloorToIndex>>;
}

export default function FloorLevelButtons({setSelectedFloorIndex:setFloor}:levelStates) {

   return(
       <div className={"grid left-5 bottom-5 ml-5"}>
           <button onClick={() => {
               setFloor(FloorToIndex.LowerLevel2);
           }} className={"bg-ivoryWhite p-2 rounded-t-md w-10 font-bold"}>  LL2</button>

           <button onClick={() => {
               setFloor(FloorToIndex.LowerLevel1);
           }} className={"bg-ivoryWhite p-2 w-10 font-bold"}>LL1</button>

           <button onClick={() => {
               setFloor(FloorToIndex.Level1);
           }} className={"bg-ivoryWhite p-2 w-10 font-bold"}>L1</button>

           <button onClick={() => {
               setFloor(FloorToIndex.Level2);
           }} className={"bg-ivoryWhite p-2 w-10 font-bold"}>L2</button>

           <button onClick={() => {
               setFloor(FloorToIndex.Level3);
           }} className={"bg-ivoryWhite p-2 drop-shadow-lg rounded-b-md w-10 font-bold"}>L3</button>

       </div>
   );
}
