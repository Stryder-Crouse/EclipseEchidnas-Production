import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";

/**
 * Struct to hold the data for each level
 */
export type WongLevel = {
    edibleLocations: Array<Coordinate>;
    readonly startLocation: Coordinate;
    readonly wongStartLocation: Coordinate;
    /* The offset from where Stryder took the screenshot */
    readonly offset: Coordinate; // She disagrees
    readonly level: number;
    readonly wongAnger: number;
    readonly wongRightSpeed: number;

    readonly imageSRC:string;
    readonly width: number;
    readonly height: number;
     firstGeneration:boolean;
}
