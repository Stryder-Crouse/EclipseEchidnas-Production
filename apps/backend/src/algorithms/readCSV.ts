import {Buildings, Node, NodeType, stringToBuilding, stringToNodeType,} from "./Graph/Node.ts";
import {Edge} from "./Graph/Edge.ts";
import {Coordinate} from "./Graph/Coordinate.ts";
import {Employee, stringToRoles} from "./Employee/Employee.ts";

/** default value for a nodes fields if any values are not found*/
const ERROR_STRING: string = "NO VALUE";
const LINE_SEP: string = "\r\n";
const CSV_SEP: string = ",";
const EMPLOYEE_FIELD_LEN: number = 6;

/**
 *
 * Creates a list of UNLINKED nodes based on the string of CSV content passed
 *
 *
 * @param fileContent - the contents of a csv file as a string.
 *
 *
 * @returns a list of UNLINKED nodes based on the contents of fileContent, or [] if fileContent is invalid
 *
 */
export function readNodeCSV(fileContent: string): Array<Node> {
    const nodes: Array<Node> = [];
    const allNodesString = fileContent;
    if (fileContent == null) {
        console.log("no file content found for readNodeCSV. Terminating.");
        return [];
    }

    //split fileContent into lines
    const linesNodes = allNodesString.split(LINE_SEP);

    //for each line
    linesNodes.forEach(function (line) {
        //split line by commas
        const nodeValues: string[] = line.split(CSV_SEP);

        //make sure all fields are there and do a non-comprehensive check to see if the entry is valid
        //?? replaces the thing before it with the thing after if the thing before is null
        if (nodeValues.length == 8 && !isNaN(parseInt(nodeValues.at(1) ?? ""))) {
            //create coordinate obj for new node
            const nodeCoordinate: Coordinate = {
                x: parseInt(nodeValues.at(1) ?? "", 10),
                y: parseInt(nodeValues.at(2) ?? "", 10),
            };
            //create new node
            const newNode: Node = {
                id: nodeValues.at(0) ?? ERROR_STRING,
                coordinate: nodeCoordinate,
                floor: nodeValues.at(3) ?? ERROR_STRING,
                building: stringToBuilding(nodeValues.at(4) ?? Buildings.UNDEFINED),
                nodeType: stringToNodeType(nodeValues.at(5) ?? NodeType.UNDEFINED),
                longName: nodeValues.at(6) ?? ERROR_STRING,
                shortName: nodeValues.at(7) ?? ERROR_STRING,
                edges: [],
                heuristic: -1,
            };
            //add node to node list
            nodes.push(newNode);
        }
    });

    return nodes;
}

/**
 *
 * Creates a list of UNLINKED edges based on the string of CSV content passed
 *
 * @param fileContent - the contents of a csv file as a string.

 *
 * @returns list of UNLINKED edges based on the string of CSV content passed
 *
 *
 */
export function readEdgeCSV(fileContent: string): Array<Edge> {
    const edges: Array<Edge> = [];
    const allEdgesString = fileContent;
    if (fileContent == null) {
        console.log(" no file content found for readEdgeCSV. Terminating.");
        return [];
    }

    //split fileContent into lines
    const linesEdges = allEdgesString.split(LINE_SEP);

    //for each line
    linesEdges.forEach(function (line) {
        //split line by commas
        const edgeValues: string[] = line.split(CSV_SEP);

        // make sure all fields are there and do a non-comprehensive check to see if the entry is valid
        //?? replaces the thing before it with the thing after if the thing before is null
        if (edgeValues.length == 3 && edgeValues[0] != "edgeID") {
            //make con complete node to add to edge

            const emptyCoordinate: Coordinate = {
                x: 1.23456789,
                y: -1.23456789,
            };

            const start: Node = {
                id: edgeValues[1],
                coordinate: emptyCoordinate,
                floor: "",
                building: Buildings.UNDEFINED,
                nodeType: NodeType.UNDEFINED,
                longName: "",
                shortName: "",
                edges: [],
                heuristic: -1,
            };

            const end: Node = {
                id: edgeValues[2],
                coordinate: emptyCoordinate,
                floor: "",
                building: Buildings.UNDEFINED,
                nodeType: NodeType.UNDEFINED,
                longName: "",
                shortName: "",
                edges: [],
                heuristic: -1,
            };


            //check that edge id is in format startedge_endEdge if not make it that way
            //this is needed as the OG data is corrupted
            if (edgeValues.at(0) != edgeValues.at(1) + "_" + edgeValues.at(2)) {
                edgeValues[0] = edgeValues.at(1) + "_" + edgeValues.at(2);
            }

            //create new edge
            const newEdge: Edge = {
                id: edgeValues.at(0) ?? ERROR_STRING,
                startNode: start,
                endNode: end,
                weight: -1
            };
            //add new edge to list
            edges.push(newEdge);
        }
    });

    return edges;
}

/**
 * The button's gone!
 * @param rawEmployeeString the thing
 * @return my button
 */
export function readEmployeeCSV(rawEmployeeString: string | null): Array<Employee> {
    /* allocate some space */
    const employees: Array<Employee> = new Array<Employee>();

    /* dupe some things */
    if (rawEmployeeString == null) {
        console.log("readEmployeeCSV: rawEmployeeString was null");
        return employees;
    }

    /* split the employee duped by line into a new array of strings */
    const employeeStrings: Array<string> = rawEmployeeString.split(LINE_SEP);

    /* for each employee line */
    for (const employeeLine of employeeStrings) {
        /* split the line by commas */
        const employeeDataByLine: Array<string> = employeeLine.split(CSV_SEP);

        /* if the data is valid */
        if (employeeDataByLine.length == EMPLOYEE_FIELD_LEN &&
            typeof(employeeDataByLine[EMPLOYEE_FIELD_LEN - 1]) == "boolean") {

            /* make the new Employee */
            const newEmployee: Employee = {
                userID : employeeDataByLine[0],
                userName : employeeDataByLine[1],
                firstName : employeeDataByLine[2],
                lastName : employeeDataByLine[3],
                designation :  stringToRoles(employeeDataByLine[4]),
                isAdmin : JSON.parse(employeeDataByLine[5]) // haters mad
            };

            /* ADD THEM YOU */
            employees.push(newEmployee);
        }
    }

    /* finally after 40 minutes */
    return employees;
}
