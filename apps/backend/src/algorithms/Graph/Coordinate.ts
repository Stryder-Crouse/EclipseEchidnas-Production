/** TS struct to hold a 2D Cartesian Coordinate */
export type Coordinate = {
    x: number;
    y: number;
};

/**
 * @param point1 - first point (coordinate obj) to find the distance between
 * @param point2 - second point to find the distance between
 *
 * @returns the euclidean Distance between the two points passed
 *
 */
export function euclideanDistance(point1: Coordinate, point2: Coordinate) {
    const xDistance = point2.x - point1.x;
    const yDistance = point2.y - point1.y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}
