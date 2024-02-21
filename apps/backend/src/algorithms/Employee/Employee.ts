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

/**
 * enum emaciation
 * @param roleString do it'
 * @return an enum member
 */
export function stringToRoles(roleString: string): Roles {
    switch (roleString) {
        case "nurse": {
            return Roles.nurse;
        }
        case "doctor": {
            return Roles.doctor;
        }
        case "administrator": {
            return Roles.admin;
        }
        case "janitor": {
            return Roles.janitor;
        }
        case "flower deliverer": {
            return Roles.flowerDeliverer;
        }
        case "religious personnel": {
            return Roles.religiousPersonnel;
        }
        case "Buddhist personnel": {
            return Roles.buddhistPersonnel;
        }
        case "Catholic personnel": {
            return Roles.catholicPersonnel;
        }
        case "Mormon personnel": {
            return Roles.mormonPersonnel;
        }
        case "Christian (non-denominational) personnel": {
            return Roles.christianPersonnel;
        }
        case "Protestant personnel": {
            return Roles.protestantPersonnel;
        }
        case "Hindu personnel": {
            return Roles.hinduPersonnel;
        }
        case "Muslim personnel": {
            return Roles.muslimPersonnel;
        }
        case "Jain personnel": {
            return Roles.jainPersonnel;
        }
        case "Jewish personnel": {
            return Roles.jewishPersonnel;
        }
        case "Sikh personnel": {
            return Roles.sikhPersonnel;
        }
        case "Shinto personnel": {
            return Roles.shintoPersonnel;
        }
        case "None": {
            return Roles.None;
        }
        default: {
            return Roles.None;
        }
    }
}
