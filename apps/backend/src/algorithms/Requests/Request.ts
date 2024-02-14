

/** Type to store requests*/
export type ServiceRequest = {
    reqType: string;
    reqPriority: string;
    reqLocationID: string;
    extraInfo: string;
    status: string;
    assignedUName: string;
    reqID:number;

};
/** Type to store data specific to medication requests*/
export type MedReq = {
    medType: string;
    dosage: string;
    numDoses: number;
    genReqID: number;
};

export type FlowReq = {
    flowType: string;
    quantity: number;
    sender: string;
    receiver: string;
    message: string;
    genReqID: number;
}

export type OutsideTransport = {
    patientName: string;
    destination: string;
    modeOfTransport: string;
    serviceReqID: number;
}

export type ReligRequest = {
    patientName: string;
    religion: string;
    reqDescription: string;
    genReqID: number;
};
export type sanReq = {
    type: string;
    serviceReqID: number;
};

// ---------------------------------    ENUMS    ---------------------------------


/** Enum to hold the possible request types staff members can make */
export enum ReqTypes {
    medReq = "medication" ,
    religReq = "religious",
    flowReq = "flower delivery",
    sanReq = "sanitation",
    tranReq = "transportation",
    outTransReq = "outside transportation",
    serviceRequest ="service request"
}

export enum priorities {
    any = "Any",
    low = "Low",
    medium = "Medium",
    high = "High",
    emergency = "Emergency"
}
