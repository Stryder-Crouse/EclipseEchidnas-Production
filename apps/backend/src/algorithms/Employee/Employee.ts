
/** Type to store employees*/
export type Employee = {
    accessToken: string;
    userName: string;
    firstName: string;
    lastName: string;
    designation: Roles;
    isAdmin: boolean;
};

/** Enum to hold the possible roles staff members can have */
export enum Roles {
    nurse = "Nurse",
    doctor = "Doctor",
    admin = "Administrator",
    janitor = "Janitor",
    flowerDeliverer = "Flower Deliverer",
    religiousPersonnel = "Religious Personnel",
    None="None"
    //nurse_and_flower_deliverer = "nurse and flower deliverer"
}
