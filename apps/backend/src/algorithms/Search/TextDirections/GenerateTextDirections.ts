import {Node, NodeType} from "../../Graph/Node.ts";
import {Coordinate, euclideanDistance} from "../../Graph/Coordinate.ts";
import {Graph} from "../../Graph/Graph.ts";

/* thresholds of turning */
const BEAR_THRESHOLD: number = 22.5;
const TURN_THRESHOLD: number = 70;

/* self explanatory */
export enum Directions {
    FORWARD = "Go straight",
    LEFT = "Turn left",
    RIGHT = "Turn right",
    BEAR_LEFT = "Bear left",
    BEAR_RIGHT = "Bear right",
    TAKE_ELEV = "Take elevator",
    TAKE_STAI = "Take stairs"
}

/**
 * Generate a set of text directions for a given path of Nodes.
 * @param path the path of nodes
 */
export function generateTextDirections(path: Array<Node> | null, graph:Graph): Array<string> | null {
    /* Cool */
    const directions: Array<string> = new Array<string>();
    directions.push("Starting at "+path![0].longName);

    /* typescript in the hood be like 😂 */
    if (path == null) {
        return null;
    }

    //remove extra tranistions (hence elevator and stair nodes do not chain)
    path = removeExtraTranisions(path);


    /* iterate through the path, skipping first and last */
    for (let i: number = 1; i < path.length - 1; i++) {
        /* find the angle at this node */
        const turnAngle = findDeviation(path[i - 1], path[i], path[i + 1]);


        //if current node is an elvelator
        if(path[i].nodeType==NodeType.ELEV ){

            //if we use it
            if(path[i+1].floor!=path[i].floor){
                directions.push(Directions.TAKE_ELEV+ " to floor " +path[i+1].floor);
            }
            continue;
        }

        if(path[i].nodeType==NodeType.STAI ){
            if(path[i+1].floor!=path[i].floor) {
                directions.push(Directions.TAKE_STAI+ " to floor " +path[i+1].floor);
            }
            continue;
        }

        /* straight case, no turn */
        if (turnAngle < BEAR_THRESHOLD) {
            /* don't populate multiple straights*/
            if (directions[directions.length - 1] != Directions.FORWARD || directions.length == 0) {
                directions.push(Directions.FORWARD);
            }
        }

        /* bearing case */
        else if (turnAngle < TURN_THRESHOLD) {

            const closestPointName = graph.closestNonHallToNode(path[i],200).longName;

            /* gaslighting */
            const go: Directions = determineTurn(path[i - 1], path[i], path[i + 1]);



            switch (go) {
                case Directions.LEFT: {
                    directions.push(Directions.BEAR_LEFT +" near "+closestPointName);
                    break;
                }
                case Directions.RIGHT: {
                    directions.push(Directions.BEAR_RIGHT+" near "+closestPointName);
                    break;
                }
                default: {
                    directions.push("honest mistake in bearing");
                    break;
                }
            }
        }

        /* turning */
        else {
            directions.push(
                determineTurn(path[i - 1], path[i], path[i + 1])
                +" near "
                +graph.closestNonHallToNode(path[i],200).longName
            );
        }
    }


    directions.push("You have arrived");

    /* HAHAHAHAH LMAOOOOO */
    return directions;
}

/**
 * Find the angle of the turn that has occurred between the three nodes.
 * @param previous the prev node (the start of the current vector)
 * @param current the current node (the middle)
 * @param next the next node (the end of the next vector)
 * @return the angle deviation at the current node in degrees
 */
export function findDeviation(previous: Node, current: Node, next: Node) {
    /* find the two vectors described by these points */
    const currentVector: Coordinate = {
        x: current.coordinate.x - previous.coordinate.x,
        y: current.coordinate.y - previous.coordinate.y
    };

    const nextVector: Coordinate = {
        x: next.coordinate.x - current.coordinate.x,
        y: next.coordinate.y - current.coordinate.y
    };

    /* find their dot product */
    const dotProduct: number = currentVector.x * nextVector.x + currentVector.y * nextVector.y;
    const currentMagnitude: number = euclideanDistance(current.coordinate, previous.coordinate);
    const nextMagnitude: number = euclideanDistance(next.coordinate, current.coordinate);

    /* find the angle with magic */
    const cosineOfAngle: number = dotProduct / (currentMagnitude * nextMagnitude);

    /* return the angle in degrees */
    return Math.acos(cosineOfAngle) * 180 / Math.PI;
}

/**
 * Determine if we're going left or right based on Stryder's awesome math.
 * @param previous the previous node
 * @param current the current node
 * @param next take a wild guess
 * @return a "Directions" describing the direction
 */
function determineTurn(previous: Node, current: Node, next: Node): Directions {

    //effectily what this function does is check if current node is to the left or right
    //of the vector line from prev to next
    //this is done by calulating the z value of the cross product of the two vectors
    //if its
    // negative then the point is to the left
    // postive then the point is to the right
    // 0 then strait line


    const prevToNextVector: Coordinate = {
        x: next.coordinate.x - previous.coordinate.x,
        y: next.coordinate.y - previous.coordinate.y
    };

    const currentVector: Coordinate = {
        x: current.coordinate.x - previous.coordinate.x,
        y: current.coordinate.y - previous.coordinate.y
    };

    const zValue = (prevToNextVector.x * currentVector.y) - (prevToNextVector.y * currentVector.x);

    if(zValue>0){
        //then point is on the right so its a left turn from current to get to next
        return Directions.LEFT;
    }
    else if (zValue<0){
        //then point is on the left so its a right turn from current to get to next
        return Directions.RIGHT;
    }
    else{
        return Directions.FORWARD;
    }


}

//used for text directions
export function removeExtraTranisions(rawPath: Array<Node>) {
    /* find the subset of edges from that path on this floor */
    const newPath: Array<Node> = [];

    /* for every node in the path */
    for (let i = 0; i < rawPath.length; i++) {
        /* store this node and the next node */
        const start = rawPath.at(i)!;

        //break if last node
        if(i==rawPath.length-1){
            newPath.push(start);
            break;
        }

        const end = rawPath.at(i + 1)!;

        /* if both nodes are on the same floor */
        if (start.floor==end.floor) {
            //push start
            newPath.push(start);
        }

        /* else start is on this floor, but end is on a different floor */
        else {


            /* iterate forward through the path */
            let currentEndNode = end;


            while (i < rawPath.length - 2) {
                currentEndNode = rawPath.at(i + 1)!;
                const nextEndNode = rawPath.at(i + 2)!;


                //stoped tranisioning though floors
                if(currentEndNode.floor == nextEndNode.floor){
                    break;
                }


                i++;
            }

            /* push new end */
            newPath.push(start);
            newPath.push(currentEndNode);
            //increment one more time to skip the current end node on next loop
            i++;
        }


    }


    return newPath;
}


// export function generateTextDirections(path: Array<Node> | null): Array<string> | null {
//     /* Cool */
//     const directions: Array<string> = new Array<string>();
//     directions.push("Starting at "+path![0].longName);
//
//     /* typescript in the hood be like 😂 */
//     if (path == null) {
//         return null;
//     }
//
//     /* iterate through the path, skipping first and last */
//     for (let i: number = 1; i < path.length - 1; i++) {
//         /* find the angle at this node */
//         const turnAngle = findDeviation(path[i - 1], path[i], path[i + 1]);
//
//
//         if(path[i].nodeType==NodeType.ELEV){
//             directions.push(Directions.TAKE_ELEV);
//             continue;
//         }
//
//         if(path[i].nodeType==NodeType.STAI){
//             directions.push(Directions.TAKE_STAI);
//             continue;
//         }
//
//         /* straight case, no turn */
//         if (turnAngle < BEAR_THRESHOLD) {
//             /* don't populate multiple straights*/
//             if (directions[directions.length - 1] != Directions.FORWARD || directions.length == 0) {
//                 directions.push(Directions.FORWARD);
//             }
//         }
//
//         /* bearing case */
//         else if (turnAngle < TURN_THRESHOLD) {
//             /* gaslighting */
//             const go: Directions = determineTurn(path[i - 1], path[i], path[i + 1]);
//             switch (go) {
//                 case Directions.LEFT: {
//                     directions.push(Directions.BEAR_LEFT);
//                     break;
//                 }
//                 case Directions.RIGHT: {
//                     directions.push(Directions.BEAR_RIGHT);
//                     break;
//                 }
//                 default: {
//                     directions.push("honest mistake in bearing");
//                     break;
//                 }
//             }
//         }
//
//         /* turning */
//         else {
//             directions.push(determineTurn(path[i - 1], path[i], path[i + 1]));
//         }
//     }
//
//
//     directions.push("You have arrived");
//
//     /* HAHAHAHAH LMAOOOOO */
//     return directions;
// }
//
// /**
//  * Find the angle of the turn that has occurred between the three nodes.
//  * @param previous the prev node (the start of the current vector)
//  * @param current the current node (the middle)
//  * @param next the next node (the end of the next vector)
//  * @return the angle deviation at the current node in degrees
//  */
// export function findDeviation(previous: Node, current: Node, next: Node) {
//     /* find the two vectors described by these points */
//     const currentVector: Coordinate = {
//         x: current.coordinate.x - previous.coordinate.x,
//         y: current.coordinate.y - previous.coordinate.y
//     };
//
//     const nextVector: Coordinate = {
//         x: next.coordinate.x - current.coordinate.x,
//         y: next.coordinate.y - current.coordinate.y
//     };
//
//     /* find their dot product */
//     const dotProduct: number = currentVector.x * nextVector.x + currentVector.y * nextVector.y;
//     const currentMagnitude: number = euclideanDistance(current.coordinate, previous.coordinate);
//     const nextMagnitude: number = euclideanDistance(next.coordinate, current.coordinate);
//
//     /* find the angle with magic */
//     const cosineOfAngle: number = dotProduct / (currentMagnitude * nextMagnitude);
//
//     /* return the angle in degrees */
//     return Math.acos(cosineOfAngle) * 180 / Math.PI;
// }
//
// /**
//  * Determine if we're going left or right based on Stryder's awesome math.
//  * @param previous the previous node
//  * @param current the current node
//  * @param next take a wild guess
//  * @return a "Directions" describing the direction
//  */
// function determineTurn(previous: Node, current: Node, next: Node): Directions {
//     /* calculate displacement from previous to current */
//     const xDisplacement: number = current.coordinate.x - previous.coordinate.x;
//     const yDisplacement: number = current.coordinate.y - previous.coordinate.y;
//
//     /* check if we've mainly moved horizontally */
//     if (Math.abs(xDisplacement) > Math.abs(yDisplacement)) {
//         return leftOrRight(xDisplacement, current.coordinate.y, next.coordinate.y);
//     }
//
//     /* else, vertically */
//     else if (Math.abs(yDisplacement) > Math.abs(xDisplacement)) {
//         return leftOrRight(yDisplacement, current.coordinate.x, next.coordinate.x);
//     }
//
//     /* bad ending; they're equal */
//     else {
//         /* calculate displacement from previous to next */
//         const xAdvanceDisplacement: number = next.coordinate.x - previous.coordinate.x;
//         const yAdvanceDisplacement: number = next.coordinate.y - previous.coordinate.y;
//
//         /* horizontally */
//         if (Math.abs(xAdvanceDisplacement) > Math.abs(yAdvanceDisplacement)) {
//             return leftOrRight(xDisplacement, current.coordinate.y, next.coordinate.y);
//         }
//
//         /* else, vertically */
//         else if (Math.abs(yAdvanceDisplacement) > Math.abs(xAdvanceDisplacement)) {
//             return leftOrRight(yDisplacement, current.coordinate.x, next.coordinate.x);
//         }
//     }
//
//     /* yike */
//     console.error("going forward on a turn!!!!!");
//     return Directions.FORWARD;
// }
//
// /**
//  * It's a helper function.
//  * @param displacement real?
//  * @param current he're were
//  * @param next to go
//  * @return left or right
//  */
// function leftOrRight(displacement: number, current: number, next: number): Directions {
//     if (displacement > 0) {
//         if (current < next) {
//             return Directions.RIGHT;
//         } else {
//             return Directions.LEFT;
//         }
//     } else {
//         if (current > next) {
//             return Directions.RIGHT;
//         } else {
//             return Directions.LEFT;
//         }
//     }
// }
