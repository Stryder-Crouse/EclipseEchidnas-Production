

/** Type to store requests*/
export type ServiceRequest = {
    reqType: string;
    reqPriority: string;
    reqLocationID: string;
    extraInfo: string;
    status: string;
    assignedUName: string;
    time: Date | null;
    reqID:number;

};
/** Type to store data specific to medication requests*/
export type MedReq = {
    medName: string;
    medStrength: string;
    quantity: number;
    medForm: string;
    medSig: string;
    patientName: string;
    patientDOB: Date;
    patientMedRecNum: number;
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
    medReq = "Medication" ,
    religReq = "Religious",
    flowReq = "Flower Request ",
    sanReq = "Sanitation",
    tranReq = "Transportation",
    //outTransReq = "outside transportation",
    serviceRequest ="Service Request"
}
export enum emptypes {
    medReq = "medication" ,
    religReq = "religious",
    flowReq = "Flower Request ",
    sanReq = "sanitation",
    tranReq = "transportation",
    //outTransReq = "outside transportation",
    serviceRequest ="service request"
}

export enum Priorities {
    any = "Any",
    low = "Low",
    medium = "Medium",
    high = "High",
    emergency = "Emergency"
}
