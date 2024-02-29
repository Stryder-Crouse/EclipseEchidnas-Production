import {floorToNumber, Node, NodeType} from "../../Graph/Node.ts";
import {Coordinate, euclideanDistance} from "../../Graph/Coordinate.ts";
import {Graph} from "../../Graph/Graph.ts";
/* thresholds of turning */
const BEAR_THRESHOLD: number = 22.5;
const TURN_THRESHOLD: number = 70;

/* self-explanatory */
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
 * @param graph the graph that contains the nodes
 */
export function generateTextDirections(path: Array<Node> | null, graph: Graph): string[][] | null {
    /* Cool */
    const directions: string[][] = [[],[],[],[],[],[]];

    let currentfloor= floorToNumber(path![0].floor);

    if(path![0].nodeType == NodeType.ELEV || path![0].nodeType == NodeType.STAI ){
        //AWSFIX
        if (path!.length>1&& path![1].floor != path![0].floor) {
            directions[currentfloor].push("1: Starting at " + path![0].longName +" go to floor "+ path![1].floor);
        }
        else{
            directions[currentfloor].push("1: Starting at " + path![0].longName);
        }
    }
    else{
        directions[currentfloor].push("1: Starting at " + path![0].longName);
    }


    let currentDirectionNumber = 2;

    /* typescript in the hood be like 😂 */
    if (path == null) {
        return null;
    }

    /* stryder did this to prevent stairs from chaining */
    path = removeExtraTransitions(path);



    /* iterate through the path, skipping first and last */
    for (let i: number = 1; i < path.length - 1; i++) {
        /* find the angle at this node */
        const turnAngle = findDeviation(path[i - 1], path[i], path[i + 1]);

        currentfloor = floorToNumber(path[i].floor);

        /* elevator edge case */
        if (path[i].nodeType == NodeType.ELEV) {
            /* if the elevator is used to transition, add it to the list of directions */
            if (path[i + 1].floor != path[i].floor) {

                //going up
                if(floorToNumber(path[i + 1].floor) >  floorToNumber(path[i].floor)){
                    directions[currentfloor].push(currentDirectionNumber+": 🔺"+Directions.TAKE_ELEV + " to floor " + path[i + 1].floor);
                }
                //going down
                if(floorToNumber(path[i + 1].floor) <  floorToNumber(path[i].floor)){
                    directions[currentfloor].push(currentDirectionNumber+": 🔻"+Directions.TAKE_ELEV + " to floor " + path[i + 1].floor);
                }
                currentDirectionNumber++;
            }

            continue;
        }

        /* stair edge case */
        if (path[i].nodeType == NodeType.STAI) {
            /* if the stair is used to transition, add it to the list of directions */
            if (path[i + 1].floor != path[i].floor) {
                //going up
                if (floorToNumber(path[i + 1].floor) > floorToNumber(path[i].floor)) {
                    directions[currentfloor].push(currentDirectionNumber + ": 🔺" + Directions.TAKE_STAI + " to floor " + path[i + 1].floor);
                }
                //going down
                if (floorToNumber(path[i + 1].floor) < floorToNumber(path[i].floor)) {
                    directions[currentfloor].push(currentDirectionNumber + ": 🔻" + Directions.TAKE_STAI + " to floor " + path[i + 1].floor);
                }
                currentDirectionNumber++;
            }
            continue;
        }

        /* straight case, no turn */
        if (turnAngle < BEAR_THRESHOLD) {
            /* don't populate multiple straights */
            if (directions[currentfloor][directions.length - 1] != Directions.FORWARD || directions.length == 0) {
                directions[currentfloor].push(currentDirectionNumber+": ⏫"+ Directions.FORWARD);
                currentDirectionNumber++;
            }
        }

        /* bearing case */
        else if (turnAngle < TURN_THRESHOLD) {
            /* gaslighting */
            const go: Directions = determineTurn(path[i - 1], path[i], path[i + 1]);
            const closestPointName = graph.closestNonHallToNode(path[i], 200).longName;

            /* switch the direction and change it to bearing */
            switch (go) {
                case Directions.LEFT: {
                    directions[currentfloor].push(currentDirectionNumber+": ↖️"+Directions.BEAR_LEFT + " near " + closestPointName);
                    break;
                }
                case Directions.RIGHT: {
                    directions[currentfloor].push(currentDirectionNumber+": ↗️"+Directions.BEAR_RIGHT + " near " + closestPointName);
                    break;
                }
                default: {
                    directions[currentfloor].push("honest mistake in bearing");
                    break;
                }
            }
            currentDirectionNumber++;
        }

        /* turning */
        else {
            const go: Directions = determineTurn(path[i - 1], path[i], path[i + 1]);
            const closestPointName = graph.closestNonHallToNode(path[i], 200).longName;
            switch (go) {
                case Directions.LEFT: {
                    directions[currentfloor].push(currentDirectionNumber+": ◀️"+Directions.LEFT + " near " + closestPointName);
                    break;
                }
                case Directions.RIGHT: {
                    directions[currentfloor].push(currentDirectionNumber+": ▶️"+Directions.RIGHT + " near " + closestPointName);
                    break;
                }
                default: {
                    directions[currentfloor].push(currentDirectionNumber+": honest mistake in bearing");
                    break;
                }
            }
            currentDirectionNumber++;

        }



    }

    /* HAHAHAHAH LMAOOOOO */
    directions[currentfloor].push(currentDirectionNumber+": You have arrived");
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
 * Determine if we're going left or right based on Stryder's awesome math:
 *     effectively, what this function does is check if
 *     the current node is to the left or right of the vector line from prev to next
 *     this is done by calculating the z value of the cross product of the two vectors
 *     if it's negative then the point is to the left
 *     if it's positive then the point is to the right
 *     0 then it must be collinear
 * @param previous the previous node
 * @param current the current node
 * @param next take a wild guess
 * @return a "Directions" describing the direction
 */
function determineTurn(previous: Node, current: Node, next: Node): Directions {
    /* swap the sign of y because y increases going down in CGI */
    const prevToNextVector: Coordinate = {
        x: next.coordinate.x - previous.coordinate.x,
        y: -next.coordinate.y - -previous.coordinate.y
    };

    /* generate the current vector */
    const currentVector: Coordinate = {
        x: current.coordinate.x - previous.coordinate.x,
        y: -current.coordinate.y - -previous.coordinate.y
    };

    /* find the z-value */
    const zValue = (prevToNextVector.x * currentVector.y) - (prevToNextVector.y * currentVector.x);

    /* point is on the right, so it's a right turn to reach it */
    if (zValue > 0) {
        return Directions.RIGHT;
    }

    /* then point is on the left, so it's a left turn from current to get to next */
    else if (zValue < 0) {
        return Directions.LEFT;
    }

    /* straight case */
    return Directions.FORWARD;
}

//used for text directions
export function removeExtraTransitions(rawPath: Array<Node>): Array<Node> {
    /* find the subset of edges from that path on this floor */
    const newPath: Array<Node> = [];

    /* for every node in the path */
    for (let i = 0; i < rawPath.length; i++) {
        /* store this node and the next node */
        const start = rawPath[i]!;

        //break if last node
        if (i == rawPath.length - 1) {
            newPath.push(start);
            break;
        }

        const end = rawPath[i+1]!;

        /* if both nodes are on the same floor */
        if (start.floor == end.floor) {
            //push start
            newPath.push(start);
        }

        /* else start is on this floor, but end is on a different floor */
        else {
            /* iterate forward through the path */
            let currentEndNode = end;
            while (i < rawPath.length - 2) {
                currentEndNode = rawPath[i+1]!;
                const nextEndNode = rawPath[i + 2]!;

                //stopped transitioning though floors
                if (currentEndNode.floor == nextEndNode.floor) {
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
