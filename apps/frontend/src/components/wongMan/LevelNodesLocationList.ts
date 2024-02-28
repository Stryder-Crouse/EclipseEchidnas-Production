import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";
import {WongLevel} from "./WongLevel.ts";
import LowerLevel2Game from "../../images/WongMan/Maps/LowerLevel2Wongman.png";
import LowerLevel1Game from "../../images/WongMan/Maps/LowerLevel1Wongman.png";
import GroundGame from "../../images/WongMan/Maps/GroundFloorWongman.png";
import Level1Game from "../../images/WongMan/Maps/Level1Wongman.png";
import Level2Game from "../../images/WongMan/Maps/Level2Wongman.png";
import Level3Game from "../../images/WongMan/Maps/Level3Wongman.png";
export const level0AddtionalEdibleCoordinates: Array<Coordinate> = [

];

//ll2
export const Level0: WongLevel = {
    edibleLocations: [],
    startLocation: {
        x: 280,
        y: 244
    },
    wongStartLocation:{
        x: -2000,
        y: 244
    },
    offset: {
        x: 281,
        y: 537
    },
    wongAnger: 5,
    wongRightSpeed: 0,
    level: 0,
    imageSRC:LowerLevel2Game,
    firstGeneration:false,
    width: 4687,
    height: 2637
};

export const level1AddtionalEdibleCoordinates: Array<Coordinate> = [

];

//ll1
export const Level1: WongLevel = {
    edibleLocations: [],
    startLocation: {
        x: 280,
        y: 244
    },
    wongStartLocation:{
        x: -500,
        y: 244
    },
    offset: {
        // x: 771,
        // y: 25
        x: 771,
        y: 25
    },
    wongAnger: 2,
    wongRightSpeed: 1,
    level: 1,
    firstGeneration:false,
    imageSRC:LowerLevel1Game,
    width: 4174,
    height: 2348
};

export const level2AddtionalEdibleCoordinates: Array<Coordinate> = [
    {x: 2000, y: 2000}
];

//g
export const Level2: WongLevel = {
    edibleLocations: [],
    startLocation: {
        x: 280,
        y: 244
    },
    wongStartLocation:{
        x: -500,
        y: 244
    },
    offset: {
        x: 650,
        y: 486
    },
    wongAnger: 3,
    wongRightSpeed: 1.5,
    level: 2,
    firstGeneration:false,
    imageSRC:GroundGame,
    width: 4282,
    height: 2408
};

export const level3AddtionalEdibleCoordinates: Array<Coordinate> = [

];

//l1
export const Level3: WongLevel = {
    edibleLocations: [],
    startLocation: {
        x: 280,
        y: 244
    },
    wongStartLocation:{
        x: -500,
        y: 244
    },
    offset: {
        x: 41,
        y: 429
    },
    wongAnger: 4,
    wongRightSpeed: 1.3,
    level: 3,
    firstGeneration:false,
    imageSRC:Level1Game,
    width: 4900,
    height: 2756
};

export const level4AddtionalEdibleCoordinates: Array<Coordinate> = [

];

//l2
export const Level4: WongLevel = {
    edibleLocations: [],
    startLocation: {
        x: 280,
        y: 244
    },
    wongStartLocation:{
        x: -500,
        y: 244
    },
    offset: {
        x: 38,
        y: 285
    },
    wongAnger: 5,
    wongRightSpeed: 1.6,
    level: 4,
    imageSRC:Level2Game,
    width: 4965,
    firstGeneration:false,
    height: 2792
};

export const level5AddtionalEdibleCoordinates: Array<Coordinate> = [

];

//l3
export const Level5: WongLevel = {
    edibleLocations: [],
    startLocation: {
        x: 280,
        y: 244
    },
    wongStartLocation:{
        x: -500,
        y: 244
    },
    wongRightSpeed: 3,
    offset: {
        x: 41,
        y: 346
    },
    wongAnger: 5,
    level: 5,
    imageSRC:Level3Game,
    width: 4909,
    height: 2761,
    firstGeneration:false,
};
