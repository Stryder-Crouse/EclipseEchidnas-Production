import { ServiceRequest } from "../Requests/Request.ts";

/** Type to store employees*/
export type Employee = {
    userName: string,
    firstName: string,
    lastName: string,
    designation: string,
    isAdmin: boolean

    assignedTasks: Array<ServiceRequest>;
};

/** Enum to hold the possible roles staff members can have */
export enum Roles {
    nurse = "nurse",
    janitor = "janitor",
    flower_deliverer = "flower deliverer",
    religious_personnel = "religious personnel"
    //nurse_and_flower_deliverer = "nurse and flower deliverer"
}