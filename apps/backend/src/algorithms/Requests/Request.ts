

/** Type to store requests*/
export type ServiceRequest = {
    reqType: string;
//  reqLocationID: string; //should be a fk to a node
    reqLocationID: string;
    //reqLocationID is reqLocation.id
    extraInfo: string;
    //assigneeUName is assigned.userName
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
