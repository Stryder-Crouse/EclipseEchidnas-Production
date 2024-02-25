import express, {Request, Response, Router} from "express";
//import { MedReq, Request } from "../algorithms/node.ts";
import PrismaClient from "../bin/database-connection.ts";
import {
    FlowReq,
    MedReq,
    OutsideTransport,
    Priorities,
    ReligRequest,
    ReqTypes,
    sanReq,
    ServiceRequest
} from "common/src/algorithms/Requests/Request.ts";
import Status from "../../../../packages/common/src/algorithms/Requests/Status.ts";
//import {Employee} from "../algorithms/Employee/Employee.ts";
// import {MedReq} from "../algorithms/Requests/Request.ts"; //may also be wrong

//import path from "path";
//import fs from "fs";

const router: Router = express.Router();

// ---------------------------------    General Service Request DB Interaction    ---------------------------------

// return all the general service requests in the database
router.get("/serviceReq", async function (req: Request, res: Response) {

    try {
        //try to send all the nodes to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.status(200).send(await PrismaClient.serviceRequest.findMany()); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you all of the requests\n");
        //send status unless 6 times bug occurs
    } catch (err) {
        console.error("\nUnable to send requests\n" + err);
        res.sendStatus(500); // Send error
    }
});

// return all the stats of types, priority, status of service requests in the database
router.get("/serviceReq/statistics", async function (req: Request, res: Response) {
    try {
        const statistics = await PrismaClient.serviceRequest.findMany();
        const result = {
            total: 0,
            medReq: 0,
            religReq: 0,
            flowReq: 0,
            sanReq: 0,
            tranReq: 0,
            lowPrio: 0,
            medPrio: 0,
            highPrio: 0,
            emergPrio: 0,
            unassigned: 0,
            assigned: 0,
            inProgress: 0,
            completed: 0
        };

        for (const entry of statistics) {
            result.total++;
            if (entry.reqType == "medication") result.medReq++;
            if (entry.reqType == "religious") result.religReq++;
            if (entry.reqType == "flower delivery") result.flowReq++;
            if (entry.reqType == "sanitation") result.sanReq++;
            if (entry.reqType == "transportation") result.tranReq++;
            if (entry.reqPriority == "Low") result.lowPrio++;
            if (entry.reqPriority == "Medium") result.medPrio++;
            if (entry.reqPriority == "High") result.highPrio++;
            if (entry.reqPriority == "Emergency") result.emergPrio++;
            if (entry.status == "Unassigned") result.unassigned++;
            if (entry.status == "Assigned") result.assigned++;
            if (entry.status == "In Progress") result.inProgress++;
            if (entry.status == "Completed") result.completed++;
        }

        res.send(result);
        console.info("\nSuccessfully gave you all of the statistics\n");
        //send status unless 6 times bug occurs
        res.sendStatus(200);
    } catch (err) {
        console.error("\nUnable to send requests\n");
        res.sendStatus(400); // Send error
    }
});

router.get("/serviceReq/filter", async function (req: Request, res: Response) {
    try {
        let statusFilter: string = req.query.status as string;
        let priorityFilter: string = req.query.priority as string;
        let emplFilter: string = req.query.employee as string;
        let locFilter: string = req.query.location as string;

        if(statusFilter==Status.Any){
            statusFilter="%";
        }

        if(priorityFilter==Priorities.any){
            priorityFilter="%";
        }
        if(emplFilter=="Any"){
            emplFilter="%";
        }

        if(locFilter=="Any"){
            locFilter="%";
        }

        const sreviceRequest = await PrismaClient.serviceRequest.findMany({
            orderBy:{
                reqID: "desc"
            },
            where: {
                AND:[
                    {
                        status:{
                            contains:statusFilter
                        }
                    },
                    {
                        reqPriority:{
                            contains:priorityFilter
                        }
                    },
                    {
                        assignedUName:{
                            contains:emplFilter
                        }
                    },
                    {
                        reqLocationID:{
                            contains:locFilter
                        }
                    }
                ]
            }
        });


        //send the request to the user with the specified conditions
        res.status(200).send(sreviceRequest);

        console.log("Res: " + res); //debugging info

        console.info("\nSuccessfully filtered requests\n"); //debugging info
        //send status unless 6 times bug occurs

    } catch (err) {
        console.error("\nUnable to send requests\n" + err);
        res.sendStatus(500); // Send error
    }
});

// ---------------------------------    Changing Service Req Fields    ---------------------------------


//Changing the assigned user given a service request id and the new assigned user
//also makes updates the service request to make it assigned or unassigned
router.post("/changeUser", async function (req: Request, res: Response) {
    try {
        const {reqID, newAssignedUser, status} = req.body;

        //checks to make sure that service request exists in database
        const serviceRequest = await PrismaClient.serviceRequest.findUnique({
            where: {reqID: reqID},
        });
        if (!serviceRequest) {
            console.error(`Service Request with ID ${reqID} not found`);
            res.sendStatus(500); // Send error
        }


        //checks to make sure employee exists in database
        const newAssignedEmployee = await PrismaClient.employee.findUnique({
            where: {userName: newAssignedUser},
        });
        if (!newAssignedEmployee) {
            console.error(`Employee with username ${newAssignedUser} not found`);
            res.sendStatus(500); // Send error
        }

        await PrismaClient.serviceRequest.update({
            where: {reqID: reqID},
            data: {
                assignedUName: newAssignedUser,
                status: status
            }
        });

        console.info("Successfully changed assigned user");
        //send status unless 6 times bug occurs
        res.sendStatus(200);
    } catch (error) {
        console.error("Unable to change assigned user" + error);
        res.sendStatus(500); // Send error
    }
});

//Changing the state of the service request given its id and the new state
router.post("/changeState", async function (req: Request, res: Response) {
    try {
        const {reqID, newState} = req.body;

        console.log("PPP " + reqID + "  " + newState);

        //checks to make sure that service request exists in database
        const serviceRequest = await PrismaClient.serviceRequest.findUnique({
            where: {reqID: reqID},
        });
        if (!serviceRequest) {
            console.error(`Service Request with ID ${reqID} not found`);
            res.sendStatus(500); // Send error
        }

        await PrismaClient.serviceRequest.update({
            where: {reqID: reqID},
            data: {
                status: newState,
            }
        });
        console.info("Successfully changed service request state");
        //send status unless 6 times bug occurs
        res.sendStatus(200);
    } catch (error) {
        console.error("Unable to change service request state" + error);
        res.sendStatus(500); // Send error
    }
});

router.post("/changePriority", async function (req: Request, res: Response) {
    try {
        //let the router know that the data that is incoming will be organized like this
        const {reqID, newPriority} = req.body;

        //make sure the entry is in the DB
        const servReq = await PrismaClient.serviceRequest.findUnique({
            where: {reqID: reqID},
        });

        //if there is no entry in the DB matching that service request id, then let the person know that there is an error
        if (!servReq) {
            console.error(`Service Request with ID ${reqID} not found`);
            res.sendStatus(500); // Send error
        }


        //Since th entry is in the DB, then update it
        await PrismaClient.serviceRequest.update({
            where: {reqID: reqID},
            data: {
                reqPriority: newPriority,
            }
        });

        console.log("changed prioity");
        //send status unless 6 times bug occurs
        res.sendStatus(200);

    } catch (err) {
        console.error("\nUnable to send requests\n");
        res.sendStatus(400); // Send error
    }
});

// return all the stats of types, priority, status of transport requests in the database
router.get("/outsideTransport/statistics", async function (req: Request, res: Response) {
    try {
        const statistics = await PrismaClient.serviceRequest.findMany({
            where: {
                reqType: "transportation"
            }
        });
        const result = {
            total: 0,
            lowPrio: 0,
            medPrio: 0,
            highPrio: 0,
            emergPrio: 0,
            unassigned: 0,
            assigned: 0,
            inProgress: 0,
            completed: 0
        };

        for (const entry of statistics) {
            result.total++;
            if (entry.reqPriority == "Low") result.lowPrio++;
            if (entry.reqPriority == "Medium") result.medPrio++;
            if (entry.reqPriority == "High") result.highPrio++;
            if (entry.reqPriority == "Emergency") result.emergPrio++;
            if (entry.status == "Unassigned") result.unassigned++;
            if (entry.status == "Assigned") result.assigned++;
            if (entry.status == "In Progress") result.inProgress++;
            if (entry.status == "Completed") result.completed++;
        }

        res.send(result);
        console.info("\nSuccessfully gave you all of the statistics\n");
        //send status unless 6 times bug occurs
        res.sendStatus(200);
    } catch (err) {
        console.error("Database issue with changing the Priority: " + err);
        res.sendStatus(500);
    }
});

router.post("/removeRequest", async function (req: Request, res: Response) {
    try {
        const data: ServiceRequest = req.body;
        await PrismaClient.serviceRequest.delete({
            where: {
                reqID: data.reqID
            }
        });
        console.log("Successfully Destroyed Request");
        res.sendStatus(200);
    } catch (err) {
        console.log("Error removing request" + err);
        res.sendStatus(500);
    }
});


// ---------------------------------    Med Request DB Interaction    ---------------------------------

//posts one new medicine request from the user to the database
//the new medReq and the new serviceRequest both get their own auto-generated ID
router.post("/medReq", async function (req: Request, res: Response) {
    console.log(req.body);
    console.log("Successfully entered medReq post, service req and med req above");
    const sentData: [ServiceRequest, MedReq] = req.body;
    console.info(sentData);

    //sets every part of node to whatever was entered while running (not during compile - point of promise/await)
    try {
        const date = new Date();
        //create a service request in the database
        const service = await PrismaClient.serviceRequest.create({
            //data passed into post is array of 2 data types
            // first data type is a service request, so all the data we want to create a service req in the table
            // will be stored in the first spot of array (passed as a json through prisma client)
            data: {
                //ID is auto created
                reqType: sentData[0].reqType,
                reqPriority: sentData[0].reqPriority,
                //connect the Node field using the node id as a foreign key
                reqLocation: {
                    connect: {
                        nodeID: sentData[0].reqLocationID
                    }
                },
                extraInfo: sentData[0].extraInfo,
                status: sentData[0].status,
                //connect the Employee field using the username as a foreign key
                //assigned is the relation, so itt does not actually exist as data (data that
                // will exist and connect is data you specify below)
                assigned: {
                    connectOrCreate: {
                        //connectOrCreate makes you specify what data you will create with and also what you
                        // want to connect to (needs to know both potential outcomes)
                        create: {
                            userID: "0",
                            userName: "No one",
                            firstName: "N/A",
                            lastName: "N/A",
                            designation: "N/A",
                            isAdmin: true,
                        },
                        //second part of create or connect (the what-we-connect-to part)
                        where: {
                            userName: "No one"
                        }
                    }
                },
                time: date
            },
        });
        console.info("Successfully saved Req"); // Log that it was successful

        //create a Med Req (use data from the second element since we always put med req data type in second)
        await PrismaClient.medReq.create({
            data: {
                //ID is auto created
                patientName: sentData[1].patientName,
                patientDOB: sentData[1].patientDOB,
                patientMedRecNum: sentData[1].patientMedRecordNum,
                medStrength: sentData[1].medStrength,
                medName: sentData[1].medName,
                medForm: sentData[1].medForm,
                medSig: sentData[1].medSig,
                quantity: sentData[1].quantity,
                genReqID: service.reqID
            }
        });
        console.info("Successfully saved Med Req"); // Log that it was successful
        //sendback the id of the request
        //console.info("HHH " +record.genReqID);
        res.status(200).send("lol forgot to put something here");
    } catch (error) {
        // Log any failures
        console.error("Unable to save Med Req" + error);
        res.sendStatus(500); // Send error
    }
});

//posts multiple medication requests to the database
// each request gets its own auto-generated ID
//router.post("/post-all", async function (req: Request, res: Response) {});

//gets all medicine requests from the database in the form of request objects
router.get("/medReq", async function (req: Request, res: Response) {
    const statusFilter: Status = req.query.status as Status;
    console.log("pog");
    console.log(statusFilter);
    if (statusFilter == Status.Any) {
        try {
            //try to send all the nodes to the client

            const medReqs = await PrismaClient.medReq.findMany({
                orderBy: {
                    genReqID: "asc", //order by service request id so the two arrays are parallel
                }
            });

            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    reqType: "medication"
                }
            });


            res.status(200).send([medReqs, serviceReqs]); //end res.send (this is what will be sent to the client)
            console.info("\nSuccessfully gave you all of the medical requests\n");
        } catch (err) {
            console.error("\nUnable to send requests\n" + err);
            res.sendStatus(500);
        }

    } else {
        try {
            //try to send all the nodes to the client

            const medReqs = await PrismaClient.medReq.findMany({
                orderBy: {
                    genReqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    genReq: {
                        status: statusFilter
                    }

                }
            });

            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    reqType: "medication",
                    status: statusFilter
                }
            });


            res.status(200).send([medReqs, serviceReqs]); //end res.send (this is what will be sent to the client)
            console.info("\nSuccessfully gave you all of the medical requests\n");
        } catch (err) {
            console.error("\nUnable to send requests\n" + err);
            res.sendStatus(500);
        }
    }


});


router.get("/medReq/filter", async function (req: Request, res: Response) {
    try {
        let statusFilter: string = req.query.status as string;
        let priorityFilter: string = req.query.priority as string;
        let emplFilter: string = req.query.employee as string;
        let locFilter: string = req.query.location as string;

        console.log("raw");
        console.log("statusfilter: \n" + statusFilter);
        console.log("priorityFilter: \n" + priorityFilter);
        console.log("emplFilter: \n" + emplFilter);
        console.log("locFilter: \n" + locFilter);

        if(statusFilter==Status.Any){
            statusFilter="%";
        }

        if(priorityFilter==Priorities.any){
            priorityFilter="%";
        }
        if(emplFilter=="Any"){
            emplFilter="%";
        }

        if(locFilter=="Any"){
            locFilter="%";
        }


        const sreviceRequest = await PrismaClient.serviceRequest.findMany({
            orderBy:{
                reqID: "desc"
            },
            where: {
                AND:[
                    {
                        status:{
                            contains:statusFilter
                        }
                    },
                    {
                        reqPriority:{
                            contains:priorityFilter
                        }
                    },
                    {
                        assignedUName:{
                            contains:emplFilter
                        }
                    },
                    {
                        reqLocationID:{
                            contains:locFilter
                        }
                    },
                    {
                        reqType:"medication"
                    }
                ]
            }
        });

        const medReq = await PrismaClient.medReq.findMany(
            {
                orderBy:{
                    genReqID: "desc"
                },
                where: {
                    genReq:{
                        AND:[
                            {
                                status:{
                                    contains:statusFilter
                                }
                            },
                            {
                                reqPriority:{
                                    contains:priorityFilter
                                }
                            },
                            {
                                assignedUName:{
                                    contains:emplFilter
                                }
                            },
                            {
                                reqLocationID:{
                                    contains:locFilter
                                }
                            },
                            {
                                reqType:"medication"
                            }
                        ]
                    }
                }
            }
        );

        //send the request to the user with the specified conditions
        res.status(200).send([medReq,sreviceRequest]);

        console.log("Res: " + res); //debugging info

        console.info("\nSuccessfully filtered requests\n"); //debugging info
        //send status unless 6 times bug occurs

    } catch (err) {
        console.error("\nUnable to send requests\n" + err);
        res.sendStatus(500); // Send error
    }
});

// return all the stats of types, priority, status of med requests in the database
router.get("/medReq/statistics", async function (req: Request, res: Response) {
    try {
        const statistics = await PrismaClient.serviceRequest.findMany({
            where: {
                reqType: "medication"
            }
        });
        const result = {
            total: 0,
            lowPrio: 0,
            medPrio: 0,
            highPrio: 0,
            emergPrio: 0,
            unassigned: 0,
            assigned: 0,
            inProgress: 0,
            completed: 0
        };

        for (const entry of statistics) {
            result.total++;
            if (entry.reqPriority == "Low") result.lowPrio++;
            if (entry.reqPriority == "Medium") result.medPrio++;
            if (entry.reqPriority == "High") result.highPrio++;
            if (entry.reqPriority == "Emergency") result.emergPrio++;
            if (entry.status == "Unassigned") result.unassigned++;
            if (entry.status == "Assigned") result.assigned++;
            if (entry.status == "In Progress") result.inProgress++;
            if (entry.status == "Completed") result.completed++;
        }

        res.send(result);
        console.info("\nSuccessfully gave you all of the statistics\n");
        //send status unless 6 times bug occurs
        res.sendStatus(200);
    } catch (err) {
        console.error("\nUnable to send requests\n");
        res.sendStatus(400); // Send error
    }
});


// ---------------------------------    Outside Transport DB Interaction    ---------------------------------

router.post("/outsideTransport", async function (req: Request, res: Response) {
    const sentData: [ServiceRequest, OutsideTransport] = req.body;
    console.log(sentData);
    try {
        //you need a service request to make an outside transportation request, so let the router know that you are receiving both
        console.log("sds");
        console.log(sentData[0]);
        const date = new Date();
        const servReq = await PrismaClient.serviceRequest.create({
            data: {
                reqType: sentData[0].reqType,
                reqPriority: sentData[0].reqPriority,
                reqLocation: {
                    connect: {
                        nodeID: sentData[0].reqLocationID
                    }
                },
                extraInfo: sentData[0].extraInfo,
                status: sentData[0].status,
                //connect the Employee field using the username as a foreign key
                //assigned is the relation, so itt does not actually exist as data (data that
                // will exist and connect is data you specify below)
                assigned: {
                    connectOrCreate: {
                        //connectOrCreate makes you specify what data you will create with and also what you
                        // want to connect to (needs to know both potential outcomes)
                        create: {
                            userID: "0",
                            userName: "No one",
                            firstName: "N/A",
                            lastName: "N/A",
                            designation: "N/A",
                            isAdmin: true,
                        },
                        //second part of create or connect (the what-we-connect-to part)
                        where: {
                            userName: "No one"
                        }
                    }
                },
                time: date
            }
        });
        console.log("Successfully saved Service Requirement");

        await PrismaClient.outsideTransport.create({
            data: {
                patientName: sentData[1].patientName,
                destination: sentData[1].destination,
                modeOfTransport: sentData[1].modeOfTransport,
                serviceReqID: servReq.reqID
            }
        });
        console.log("Successfully saved the Outside Transportation Request");
        res.sendStatus(200);
    } catch (error) {
        console.error("Outside Transportation Request Failed " + error);
        res.sendStatus(400);
    }
});

router.get("/outsideTransport", async function (req: Request, res: Response) {
    const statusFilter: Status = req.query.status as Status;

    if (statusFilter == Status.Any) {

        try {

            const transportReq = await PrismaClient.outsideTransport.findMany({
                orderBy: {
                    serviceReqID: "asc", //order by service request id so the two arrays are parallel
                }

            });

            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    reqType: "transportation"
                }
            });

            //we display info from both the service req and the outside transportation req, so we send the person both DB objects
            res.status(200).send([transportReq, serviceReqs]);
            //send status unless 6 times bug occurs
            console.info("\nSuccessfully gave you all of the Outside Transportation Requests\n");
        } catch (err) {
            console.error("\nUnable to send Requests\n" + err);
            res.sendStatus(500);
        }

    } else {
        try {

            const transportReq = await PrismaClient.outsideTransport.findMany({
                orderBy: {
                    serviceReqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    serviceReq: {
                        status: statusFilter
                    }

                }
            });

            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    reqType: "transportation",
                    status: statusFilter
                }
            });

            //we display info from both the service req and the outside transportation req, so we send the person both DB objects
            //send status unless 6 times bug occurs
            res.status(200).send([transportReq, serviceReqs]);

            console.info("\nSuccessfully gave you all of the Outside Transportation Requests\n");
        } catch (err) {
            res.sendStatus(500);
            console.error("\nUnable to send Requests\n" + err);
        }

    }


});

router.get("/outsideTransport/filter", async function (req: Request, res: Response) {
    try {
        let statusFilter: string = req.query.status as string;
        let priorityFilter: string = req.query.priority as string;
        let emplFilter: string = req.query.employee as string;
        let locFilter: string = req.query.location as string;


        if(statusFilter==Status.Any){
            statusFilter="%";
        }

        if(priorityFilter==Priorities.any){
            priorityFilter="%";
        }
        if(emplFilter=="Any"){
            emplFilter="%";
        }

        if(locFilter=="Any"){
            locFilter="%";
        }


        const sreviceRequest = await PrismaClient.serviceRequest.findMany({
            orderBy:{
                reqID: "desc"
            },
            where: {
                AND:[
                    {
                        status:{
                            contains:statusFilter
                        }
                    },
                    {
                        reqPriority:{
                            contains:priorityFilter
                        }
                    },
                    {
                        assignedUName:{
                            contains:emplFilter
                        }
                    },
                    {
                        reqLocationID:{
                            contains:locFilter
                        }
                    },
                    {
                        reqType:"transportation"
                    }
                ]
            }
        });

        const transportReq = await PrismaClient.outsideTransport.findMany(
            {
                orderBy:{
                    serviceReqID: "desc"
                },
                where: {
                    serviceReq:{
                        AND:[
                            {
                                status:{
                                    contains:statusFilter
                                }
                            },
                            {
                                reqPriority:{
                                    contains:priorityFilter
                                }
                            },
                            {
                                assignedUName:{
                                    contains:emplFilter
                                }
                            },
                            {
                                reqLocationID:{
                                    contains:locFilter
                                }
                            },
                            {
                                reqType:"transportation"
                            }
                        ]
                    }
                }
            }
        );

        //send the request to the user with the specified conditions
        res.status(200).send([transportReq,sreviceRequest]);

        console.log("Res: " + res); //debugging info

        console.info("\nSuccessfully filtered requests\n"); //debugging info
        //send status unless 6 times bug occurs

    } catch (err) {
        console.error("\nUnable to send requests\n" + err);
        res.sendStatus(500); // Send error
    }
});


// ---------------------------------    Sanitation DB Interaction    ---------------------------------

router.post("/sanReq", async function (req: Request, res: Response) {
    try {
        //you need a service request to make an Sanitation transportation request, so let the router know that you are receiving both
        const sentData: [ServiceRequest, sanReq] = req.body;
        const date = new Date();
        const serviceReq = await PrismaClient.serviceRequest.create({
            data: {
                reqType: sentData[0].reqType,
                reqPriority: sentData[0].reqPriority,
                reqLocation: {
                    connect: {
                        nodeID: sentData[0].reqLocationID
                    }
                },
                extraInfo: sentData[0].extraInfo,
                status: sentData[0].status,
                //connect the Employee field using the username as a foreign key
                //assigned is the relation, so itt does not actually exist as data (data that
                // will exist and connect is data you specify below)
                assigned: {
                    connectOrCreate: {
                        //connectOrCreate makes you specify what data you will create with and also what you
                        // want to connect to (needs to know both potential outcomes)
                        create: {
                            userID: "0",
                            userName: "No one",
                            firstName: "N/A",
                            lastName: "N/A",
                            designation: "N/A",
                            isAdmin: true,
                        },
                        //second part of create or connect (the what-we-connect-to part)
                        where: {
                            userName: "No one"
                        }
                    }
                },
                time: date
            }
        });
        console.log("Successfully saved Service Requirement");

        await PrismaClient.sanReq.create({
            data: {
                serviceReqID: serviceReq.reqID,
                type: sentData[1].type
            }
        });
        console.log("Successfully saved the Sanitation Request");
        res.sendStatus(200);
    } catch (err) {
        console.error("Sanitation Request Failed " + err);
        res.sendStatus(500);
    }
});

router.get("/sanReq", async function (req: Request, res: Response) {

    const statusFilter: Status = req.query.status as Status;

    if (statusFilter == Status.Any) {
        try {

            const sanReq = await PrismaClient.sanReq.findMany({
                orderBy: {
                    serviceReqID: "asc", //order by service request id so the two arrays are parallel
                }
            });

            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    reqType: "sanitation"
                }
            });

            //we display info from both the service req and the sanitation req, so we send the person both DB objects
            //send status unless 6 times bug occurs
            res.status(200).send([sanReq, serviceReqs]);
            console.info("\nSuccessfully gave you all of the Sanitation Requests\n");
        } catch (err) {
            res.sendStatus(500);
            console.error("\nUnable to send Requests\n" + err);
        }
    } else {
        try {

            const sanReq = await PrismaClient.sanReq.findMany({
                orderBy: {
                    serviceReqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    serviceReq: {
                        status: statusFilter
                    }

                }
            });

            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    reqType: "sanitation",
                    status: statusFilter
                }
            });

            //we display info from both the service req and the sanitation req, so we send the person both DB objects
            //send status unless 6 times bug occurs
            res.status(200).send([sanReq, serviceReqs]);
            console.info("\nSuccessfully gave you all of the Sanitation Requests\n");
        } catch (err) {
            console.error("\nUnable to send Requests\n" + err);
            res.sendStatus(500);
        }
    }
});

router.get("/sanReq/filter", async function (req: Request, res: Response) {
    try {
        let statusFilter: string = req.query.status as string;
        let priorityFilter: string = req.query.priority as string;
        let emplFilter: string = req.query.employee as string;
        let locFilter: string = req.query.location as string;

        // console.log("raw");
        // console.log("statusfilter: \n" + statusFilter);
        // console.log("priorityFilter: \n" + priorityFilter);
        // console.log("emplFilter: \n" + emplFilter);
        // console.log("locFilter: \n" + locFilter);


            if(statusFilter==Status.Any){
                statusFilter="%";
            }

            if(priorityFilter==Priorities.any){
                priorityFilter="%";
            }
        if(emplFilter=="Any"){
            emplFilter="%";
        }

        if(locFilter=="Any"){
            locFilter="%";
        }




        // console.log("statusfilter: \n" + statusFilter);
        // console.log("priorityFilter: \n" + priorityFilter);
        // console.log("emplFilter: \n" + emplFilter);
        // console.log("locFilter: \n" + locFilter);





        const sreviceRequest = await PrismaClient.serviceRequest.findMany({
                orderBy:{
                    reqID: "desc"
                },
                where: {
                    AND:[
                        {
                            status:{
                                contains:statusFilter
                            }
                        },
                        {
                            reqPriority:{
                                contains:priorityFilter
                            }
                        },
                        {
                            assignedUName:{
                                contains:emplFilter
                            }
                        },
                        {
                            reqLocationID:{
                                contains:locFilter
                            }
                        },
                        {
                            reqType:"sanitation"
                        }
                    ]
                }
            });

            const sanRequest = await PrismaClient.sanReq.findMany(
                {
                    orderBy:{
                        serviceReqID: "desc"
                    },
                    where: {
                        serviceReq:{
                            AND:[
                                {
                                    status:{
                                        contains:statusFilter
                                    }
                                },
                                {
                                    reqPriority:{
                                        contains:priorityFilter
                                    }
                                },
                                {
                                    assignedUName:{
                                        contains:emplFilter
                                    }
                                },
                                {
                                    reqLocationID:{
                                        contains:locFilter
                                    }
                                },
                                {
                                    reqType:"sanitation"
                                }
                            ]
                    }
                    }
                }
            );


            // console.log("hi");
            // console.log(sanRequest);
            // console.log(sreviceRequest);

        //send the request to the user with the specified conditions
        res.status(200).send([sanRequest,sreviceRequest]);

        console.log("Res: " + res); //debugging info

        console.info("\nSuccessfully filtered requests\n"); //debugging info
        //send status unless 6 times bug occurs

    } catch (err) {
        console.error("\nUnable to send requests\n" + err);
        res.sendStatus(500); // Send error
    }
});

// return all the stats of types, priority, status of sanitation requests in the database
router.get("/sanReq/statistics", async function (req: Request, res: Response) {
    try {
        const statistics = await PrismaClient.serviceRequest.findMany({
            where: {
                reqType: "sanitation"
            }
        });
        const result = {
            total: 0,
            lowPrio: 0,
            medPrio: 0,
            highPrio: 0,
            emergPrio: 0,
            unassigned: 0,
            assigned: 0,
            inProgress: 0,
            completed: 0
        };

        for (const entry of statistics) {
            result.total++;
            if (entry.reqPriority == "Low") result.lowPrio++;
            if (entry.reqPriority == "Medium") result.medPrio++;
            if (entry.reqPriority == "High") result.highPrio++;
            if (entry.reqPriority == "Emergency") result.emergPrio++;
            if (entry.status == "Unassigned") result.unassigned++;
            if (entry.status == "Assigned") result.assigned++;
            if (entry.status == "In Progress") result.inProgress++;
            if (entry.status == "Completed") result.completed++;
        }

        res.send(result);
        console.info("\nSuccessfully gave you all of the statistics\n");
        //send status unless 6 times bug occurs
        res.sendStatus(200);
    } catch (err) {
        console.error("\nUnable to send requests\n");
        res.sendStatus(400); // Send error
    }
});


// ---------------------------------    Flower Request DB Interaction    ---------------------------------

router.post("/flowReq", async function (req: Request, res: Response) {
    //console.log(req.body);
    //console.log("Flow Req Above");
    const flowData: [ServiceRequest, FlowReq] = req.body;
    console.info("Flower Data");
    console.info(flowData);

    //sets every part of node to whatever was entered while running (not during compile - point of promise/await)
    try {
        const date = new Date();
        //create a service request in the database
        const service = await PrismaClient.serviceRequest.create({
            //data passed into post is array of 2 data types
            // first data type is a service request, so all the data we want to create a service req in the table
            // will be stored in the first spot of array (passed as a json through prisma client)
            data: {
                //ID is auto created
                reqType: flowData[0].reqType,
                reqPriority: flowData[0].reqPriority,
                //connect the Node field using the node id as a foreign key
                reqLocation: {
                    connect: {
                        nodeID: flowData[0].reqLocationID
                    }
                },
                extraInfo: flowData[0].extraInfo,
                status: flowData[0].status,
                //connect the Employee field using the username as a foreign key
                //assigned is the relation, so itt does not actually exist as data (data that
                // will exist and connect is data you specify below)
                assigned: {
                    connectOrCreate: {
                        //connectOrCreate makes you specify what data you will create with and also what you
                        // want to connect to (needs to know both potential outcomes)
                        create: {
                            userID: "0",
                            userName: "No one",
                            firstName: "N/A",
                            lastName: "N/A",
                            designation: "N/A",
                            isAdmin: true,
                        },
                        //second part of create or connect (the what-we-connect-to part)
                        where: {
                            userName: "No one"
                        }
                    }
                },
                time: date
            },
        });
        console.log("Successfully saved Req"); // Log that it was successful

        //create a Flow Req (use data from the second element since we always put flow req data type in second)
        await PrismaClient.flowReq.create({
            data: {
                flowType: flowData[1].flowType,
                quantity: flowData[1].quantity,
                sender: flowData[1].sender,
                receiver: flowData[1].receiver,
                message: flowData[1].message,
                genReqID: service.reqID,
            }
        });
        console.info("Successfully saved Flow Req"); // Log that it was successful
        //sendback the id of the request
        //console.info("HHH " +record.genReqID);
        res.sendStatus(200);
    } catch (err) {
        // Log any failures
        console.error("Unable to save Flow Req " + err);
        res.sendStatus(500); // Send error
    }
});
router.get("/flowReq", async function (req: Request, res: Response) {
    try {
        //
        const filterStatus: Status = req.query.status as Status;
        console.log("filter flow req");
        console.log(filterStatus);

        if (filterStatus == "Any") {
            //try to send all the nodes to the client
            const flowReqs = await PrismaClient.flowReq.findMany({
                orderBy: {
                    genReqID: "asc", //order by service request id so the two arrays are parallel
                },
            });
            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    reqType: ReqTypes.flowReq,
                }
            });
            res.status(200).send([flowReqs, serviceReqs]); //end res.send (this is what will be sent to the client)
            console.info("\nSuccessfully gave you all of the flower requests\n");
        } else {
            //try to send all the nodes to the client
            const flowReqs = await PrismaClient.flowReq.findMany({
                orderBy: {
                    genReqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    genReq: {
                        status: filterStatus,
                    }
                }
            });
            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    reqType: ReqTypes.flowReq,
                    status: filterStatus,
                }
            });
            res.status(200).send([flowReqs, serviceReqs]); //end res.send (this is what will be sent to the client)
            console.info("\nSuccessfully gave you all of the flower requests\n");
        }
    } catch (err) {
        res.sendStatus(500);
        console.error("\nUnable to send requests\n" + err);
    }
});


router.get("/flowReq/filter", async function (req: Request, res: Response) {
    try {
        let statusFilter: string = req.query.status as string;
        let priorityFilter: string = req.query.priority as string;
        let emplFilter: string = req.query.employee as string;
        let locFilter: string = req.query.location as string;

        console.log("raw");
        console.log("statusfilter: \n" + statusFilter);
        console.log("priorityFilter: \n" + priorityFilter);
        console.log("emplFilter: \n" + emplFilter);
        console.log("locFilter: \n" + locFilter);

        if(statusFilter==Status.Any){
            statusFilter="%";
        }

        if(priorityFilter==Priorities.any){
            priorityFilter="%";
        }
        if(emplFilter=="Any"){
            emplFilter="%";
        }

        if(locFilter=="Any"){
            locFilter="%";
        }


        const sreviceRequest = await PrismaClient.serviceRequest.findMany({
            orderBy:{
                reqID: "desc"
            },
            where: {
                AND:[
                    {
                        status:{
                            contains:statusFilter
                        }
                    },
                    {
                        reqPriority:{
                            contains:priorityFilter
                        }
                    },
                    {
                        assignedUName:{
                            contains:emplFilter
                        }
                    },
                    {
                        reqLocationID:{
                            contains:locFilter
                        }
                    },
                    {
                        reqType:"flower delivery"
                    }
                ]
            }
        });

        const flowReq = await PrismaClient.flowReq.findMany(
            {
                orderBy:{
                    genReqID: "desc"
                },
                where: {
                    genReq:{
                        AND:[
                            {
                                status:{
                                    contains:statusFilter
                                }
                            },
                            {
                                reqPriority:{
                                    contains:priorityFilter
                                }
                            },
                            {
                                assignedUName:{
                                    contains:emplFilter
                                }
                            },
                            {
                                reqLocationID:{
                                    contains:locFilter
                                }
                            },
                            {
                                reqType:"flower delivery"
                            }
                        ]
                    }
                }
            }
        );

        //send the request to the user with the specified conditions
        res.status(200).send([flowReq,sreviceRequest]);

        console.log("Res: " + res); //debugging info

        console.info("\nSuccessfully filtered requests\n"); //debugging info
        //send status unless 6 times bug occurs

    } catch (err) {
        console.error("\nUnable to send requests\n" + err);
        res.sendStatus(500); // Send error
    }
});

// return all the stats of types, priority, status of flower requests in the database
router.get("/flowReq/statistics", async function (req: Request, res: Response) {
    try {
        const statistics = await PrismaClient.serviceRequest.findMany({
            where: {
                reqType: "flower delivery"
            }
        });
        const result = {
            total: 0,
            lowPrio: 0,
            medPrio: 0,
            highPrio: 0,
            emergPrio: 0,
            unassigned: 0,
            assigned: 0,
            inProgress: 0,
            completed: 0
        };

        for (const entry of statistics) {
            result.total++;
            if (entry.reqPriority == "Low") result.lowPrio++;
            if (entry.reqPriority == "Medium") result.medPrio++;
            if (entry.reqPriority == "High") result.highPrio++;
            if (entry.reqPriority == "Emergency") result.emergPrio++;
            if (entry.status == "Unassigned") result.unassigned++;
            if (entry.status == "Assigned") result.assigned++;
            if (entry.status == "In Progress") result.inProgress++;
            if (entry.status == "Completed") result.completed++;
        }

        res.send(result);
        console.info("\nSuccessfully gave you all of the statistics\n");
        //send status unless 6 times bug occurs
        res.sendStatus(200);
    } catch (err) {
        console.error("\nUnable to send requests\n");
        res.sendStatus(400); // Send error
    }
});


// ---------------------------------    Relig Req DB Interaction    ---------------------------------
router.post('/religiousRequest', async function (req: Request, res: Response) {
    try {
        const date = new Date();
        const sentData: [ServiceRequest, ReligRequest] = req.body;
        const servReq = await PrismaClient.serviceRequest.create({
            data: {
                reqType: sentData[0].reqType,
                reqPriority: sentData[0].reqPriority,
                reqLocation: {
                    connect: {
                        nodeID: sentData[0].reqLocationID
                    }
                },
                extraInfo: sentData[0].extraInfo,
                status: sentData[0].status,
                //connect the Employee field using the username as a foreign key
                //assigned is the relation, so itt does not actually exist as data (data that
                // will exist and connect is data you specify below)
                assigned: {
                    connectOrCreate: {
                        //connectOrCreate makes you specify what data you will create with and also what you
                        // want to connect to (needs to know both potential outcomes)
                        create: {
                            userID: "0",
                            userName: "No one",
                            firstName: "N/A",
                            lastName: "N/A",
                            designation: "N/A",
                            isAdmin: true,
                        },
                        //second part of create or connect (the what-we-connect-to part)
                        where: {
                            userName: "No one"
                        }
                    }
                },
                time: date
            }
        });
        console.log("Successfully saved Service Requirement");

        await PrismaClient.religiousReq.create({
            data: {
                patientName: sentData[1].patientName,
                religion: sentData[1].religion,
                reqDescription: sentData[1].reqDescription,
                genReqID: servReq.reqID
            }
        });

        console.log("Successfully saved the Religious Request");
        res.sendStatus(200);
    } catch (err) {
        console.error("Unable to save the Religious Request" + err);
        res.sendStatus(500);
    }
});
router.get("/religiousRequest", async function (req: Request, res: Response) {

    const statusFilter: Status = req.query.status as Status;

    if (statusFilter == Status.Any) {
        try {

            const religReq = await PrismaClient.religiousReq.findMany({
                orderBy: {
                    genReqID: "asc", //order by service request id so the two arrays are parallel
                }
            });

            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    reqType: "religious"
                }
            });

            //we display info from both the service req and the outside transportation req, so we send the person both DB objects
            res.status(200).send([religReq, serviceReqs]);
            console.info("\nSuccessfully gave you all of the Religious Requests\n");
            //send status unless 6 times bug occurs
        } catch (err) {
            res.sendStatus(500);
            console.error("\nUnable to send Requests\n" + err);
        }
    } else {
        try {

            const religReq = await PrismaClient.religiousReq.findMany({
                orderBy: {
                    genReqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    genReq: {
                        status: statusFilter
                    }

                }
            });

            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    reqType: "religious",
                    status: statusFilter
                }
            });

            //we display info from both the service req and the outside transportation req, so we send the person both DB objects
            res.status(200).send([religReq, serviceReqs]);
            console.info("\nSuccessfully gave you all of the Religious Requests\n");
            //send status unless 6 times bug occurs
        } catch (err) {
            console.error("\nUnable to send Requests\n" + err);
            res.sendStatus(500);
        }
    }


});


router.get("/religiousRequest/filter", async function (req: Request, res: Response) {
    try {
        let statusFilter: string = req.query.status as string;
        let priorityFilter: string = req.query.priority as string;
        let emplFilter: string = req.query.employee as string;
        let locFilter: string = req.query.location as string;

        console.log("raw");
        console.log("statusfilter: \n" + statusFilter);
        console.log("priorityFilter: \n" + priorityFilter);
        console.log("emplFilter: \n" + emplFilter);
        console.log("locFilter: \n" + locFilter);

        if(statusFilter==Status.Any){
            statusFilter="%";
        }

        if(priorityFilter==Priorities.any){
            priorityFilter="%";
        }
        if(emplFilter=="Any"){
            emplFilter="%";
        }

        if(locFilter=="Any"){
            locFilter="%";
        }


        const sreviceRequest = await PrismaClient.serviceRequest.findMany({
            orderBy:{
                reqID: "desc"
            },
            where: {
                AND:[
                    {
                        status:{
                            contains:statusFilter
                        }
                    },
                    {
                        reqPriority:{
                            contains:priorityFilter
                        }
                    },
                    {
                        assignedUName:{
                            contains:emplFilter
                        }
                    },
                    {
                        reqLocationID:{
                            contains:locFilter
                        }
                    },
                    {
                        reqType:"religious"
                    }
                ]
            }
        });

        const relReq = await PrismaClient.religiousReq.findMany(
            {
                orderBy:{
                    genReqID: "desc"
                },
                where: {
                    genReq:{
                        AND:[
                            {
                                status:{
                                    contains:statusFilter
                                }
                            },
                            {
                                reqPriority:{
                                    contains:priorityFilter
                                }
                            },
                            {
                                assignedUName:{
                                    contains:emplFilter
                                }
                            },
                            {
                                reqLocationID:{
                                    contains:locFilter
                                }
                            },
                            {
                                reqType:"religious"
                            }
                        ]
                    }
                }
            }
        );

        //send the request to the user with the specified conditions
        res.status(200).send([relReq,sreviceRequest]);

        console.log("Res: " + res); //debugging info

        console.info("\nSuccessfully filtered requests\n"); //debugging info
        //send status unless 6 times bug occurs

    } catch (err) {
        console.error("\nUnable to send requests\n" + err);
        res.sendStatus(500); // Send error
    }
});

// return all the stats of types, priority, status of religious requests in the database
router.get("/religiousRequest/statistics", async function (req: Request, res: Response) {
    try {
        const statistics = await PrismaClient.serviceRequest.findMany({
            where: {
                reqType: "religious"
            }
        });
        const result = {
            total: 0,
            lowPrio: 0,
            medPrio: 0,
            highPrio: 0,
            emergPrio: 0,
            unassigned: 0,
            assigned: 0,
            inProgress: 0,
            completed: 0
        };

        for (const entry of statistics) {
            console.log(entry.reqPriority);
            result.total++;
            if (entry.reqPriority == "Low") result.lowPrio++;
            if (entry.reqPriority == "Medium") result.medPrio++;
            if (entry.reqPriority == "High") result.highPrio++;
            if (entry.reqPriority == "Emergency") result.emergPrio++;
            if (entry.status == "Unassigned") result.unassigned++;
            if (entry.status == "Assigned") result.assigned++;
            if (entry.status == "In Progress") result.inProgress++;
            if (entry.status == "Completed") result.completed++;
        }
        console.log('rel stats');
        console.log(result);
        res.status(200).send(result);
        console.info("\nSuccessfully gave you all of the statistics\n");
    } catch (err) {
        console.error("\nUnable to send requests\n" + err);
        res.sendStatus(500); // Send error
    }
});

export default router;
