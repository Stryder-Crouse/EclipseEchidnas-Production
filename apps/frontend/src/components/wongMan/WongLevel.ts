import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";
import {Edible} from "./Edible.ts";

/**
 * Struct to hold the data for each level
 */
export type WongLevel = {
    edibles: Array<Edible>;
    readonly startLocation: Coordinate;
    readonly wongAnger: number;
}
