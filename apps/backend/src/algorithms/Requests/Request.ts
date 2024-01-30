import { Node } from "../Graph/Node.ts";

export type Request = {
  id: number;
  reqType: string;
  reqLocation: Node;
  extraInfo: string;

  medReq: MedReq;
};

export type MedReq = {
  medReqID: number;
  medType: string;
  dosage: string;
  numDosages: number;
  request: Request;
};
