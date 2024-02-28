import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";

/**
 * Struct to hold the data for each level
 */
export type WongLevel = {
    readonly edibleLocations: Array<Coordinate>;
    readonly startLocation: Coordinate;
    /* The offset from where Stryder took the screenshot */
    readonly graceOffset: Coordinate; // She disagrees
    readonly level: number;
    readonly wongAnger: number;
    readonly width: number;
    readonly height: number;
}
