
/** Type to store employees*/
export type Employee = {
    userID: string;
    userName: string;
    firstName: string;
    lastName: string;
    designation: Roles;
    isAdmin: boolean;
};

/** Enum to hold the possible roles staff members can have */
export enum Roles {
    nurse = "nurse",
    doctor = "doctor",
    admin = "administrator",
    janitor = "janitor",
    flowerDeliverer = "flower deliverer",
    religiousPersonnel = "religious personnel",
    buddhistPersonnel = "Buddhist personnel",
    catholicPersonnel = "Catholic personnel",
    mormonPersonnel = "Mormon personnel",
    christianPersonnel = "Christian (non-denominational) personnel",
    protestantPersonnel = "Protestant personnel",
    hinduPersonnel = "Hindu personnel",
    muslimPersonnel = "Muslim personnel",
    jainPersonnel = "Jain personnel",
    jewishPersonnel = "Jewish personnel",
    sikhPersonnel = "Sikh personnel",
    shintoPersonnel = "Shinto personnel",
    None = "None"
    //nurse_and_flower_deliverer = "nurse and flower deliverer"
}
