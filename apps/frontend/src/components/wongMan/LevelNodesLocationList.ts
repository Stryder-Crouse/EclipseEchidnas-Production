import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";
import {WongLevel} from "./WongLevel.ts";

export const lowerLevel1EdibleCoordinates: Array<Coordinate> = [
    {x: 100, y: 100},
    {x: 200, y: 200},
    {x: 300, y: 300},
    {x: 400, y: 400},
    {x: 500, y: 500},
    {x: 600, y: 400},
    {x: 700, y: 300},
    {x: 800, y: 200}
];

export const Level1: WongLevel = {
    edibleLocations: lowerLevel1EdibleCoordinates,
    startLocation: {
        x: 280,
        y: 244
    },
    graceOffset: {
        x: 560,
        y: 174
    },
    wongAnger: 0,
    level: 1,
    width: 2560,
    height: 1279
};
