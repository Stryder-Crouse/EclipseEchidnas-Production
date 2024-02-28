import {FloorToIndex} from "common/src/algorithms/Graph/Node.ts";
import {Dispatch, SetStateAction} from "react";

export function setViewBoxForLevel(selectedFloorIndex:number, setViewbox: Dispatch<SetStateAction<{ x: number, y: number, width: number, height: number }>>){
    switch (selectedFloorIndex) {
        case FloorToIndex.LowerLevel2:
            setViewbox({x:730, y:518,width:2719,height:2392});
            break;
        case FloorToIndex.LowerLevel1:
            setViewbox({x:704, y:348,width:2236,height:1967});
            break;
        case FloorToIndex.Ground:
            setViewbox({x:579, y:412,width:3161,height:2780});
            break;
        case FloorToIndex.Level1:
            setViewbox({x:579, y:412,width:3161,height:2780});
            break;
        case FloorToIndex.Level2:
            setViewbox({x:613, y:219,width:3129,height:2753});
            break;
        case FloorToIndex.Level3:
            setViewbox({x:474, y:493,width:2946,height:2591});
            break;
        default:
            setViewbox({x:474, y:493,width:2946,height:2591});
            break;
    }
}
