import { Node } from "../Graph/Node.ts";

/** Type to store requests*/
export type GenericRequest = {
  id: number;
  reqType: string;
  reqLocation: Node;
  extraInfo: string;

  medReq: MedReq;
};

/** Type to store data specific to medication requests*/
export type MedReq = {
  medReqID: number;
  medType: string;
  dosage: string;
  numDosages: number;
  request: GenericRequest;
};

/** Enum to hold the possible request types staff members can make */
export enum ReqTypes {
  medReq = "medication" /*,
    sanReq = "sanitation",
    floReq = "flower delivery", ... etc.*/,
}
