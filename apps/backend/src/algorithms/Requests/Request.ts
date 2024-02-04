// /** Type to store requests*/
// export type ServiceRequest = {
//   reqID: number;
//   reqType: ReqTypes;
//   reqLocationID: string;
//   extraInfo: string;
//
// };

/** Type to store data specific to medication requests*/
export type MedReq = {
  medReqID: number;
  medType: string;
  dosage: string;
  numDosages: number;
  reqLocationID: string;
  //requestID: number;
};

/** Enum to hold the possible request types staff members can make */
export enum ReqTypes {
  medReq = "medication" /*,
    sanReq = "sanitation",
    floReq = "flower delivery", ... etc.*/,
}
