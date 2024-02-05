import {Employee} from "./Employee.ts";
import {Node} from "../Graph/Node.ts";

/** Type to store requests*/
export type ServiceRequest = {
  reqID: number;
  reqType: ReqTypes;
//  reqLocationID: string; //should be a fk to a node
  reqLocation: Node;
  //reqLocationID is reqLocation.id
  extraInfo: string;
  assigned: Employee;
  //assigneeUName is assigned.userName
  status: string;
};

/** Type to store data specific to medication requests*/
export type MedReq = {
  medReqID: number;
  medType: string;
  //reqLocationID: string;
  dosage: string;
  numDoses: number;
  genReq: ServiceRequest;
  //genReqID is genReq.reqID
};

/** Enum to hold the possible request types staff members can make */
export enum ReqTypes {
  medReq = "medication" /*,
  sanReq = "sanitation",
  floReq = "flower delivery", ... etc.*/,
}
