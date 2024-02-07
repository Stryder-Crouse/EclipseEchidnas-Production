

/** Type to store requests*/
export type ServiceRequest = {
    reqType: ReqTypes;
    reqLocationID: string;
    extraInfo: string;
    status: string;
    assignedUName: string;
};

/** Type to store data specific to medication requests*/
export type MedReq = {
    medType: string;
    dosage: string;
    numDoses: number;
    genReqID: number;
};

/** Enum to hold the possible request types staff members can make */
export enum ReqTypes {
    medReq = "medication" /*,
  sanReq = "sanitation",
  floReq = "flower delivery", ... etc.*/,
}
