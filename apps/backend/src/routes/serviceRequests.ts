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
} from "../algorithms/Requests/Request.ts";
import Status from "../algorithms/Requests/Status.ts";
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
        res.send(await PrismaClient.serviceRequest.findMany()); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you all of the requests\n");
        //send status unless 6 times bug occurs
        res.sendStatus(200);
    } catch (err) {
        console.error("\nUnable to send requests\n");
        res.sendStatus(400); // Send error
    }
});

//return the general service requests filtered by status, priority, employee, location, and/or type
router.get("/serviceReq/filter", async function (req: Request, res: Response) {
    try {
        //req should be something like {params: {status: "Unassigned", priority:"Low", employee:"all", location:"all", type:"all"}}
        const statusFilter: Status = req.query.status as Status;
        const priorityFilter: Priorities = req.query.priority as Priorities;
        const emplFilter: string = req.query.employee as string;
        const locFilter: string = req.query.location as string;
        const typeFilter: string = req.query.type as string;

        console.log("statusfilter: \n" + statusFilter);
        console.log("priorityFilter: \n" + priorityFilter);
        console.log("emplFilter: \n" + emplFilter);
        console.log("locFilter: \n" + locFilter);
        console.log("typeFilter: \n" + typeFilter);

        //make a local type that potentially has one field for each filter
        type WhereCondition = {
            status?: string;
            reqPriority?: string;
            assignedUName?: string;
            recLocationID?: string;
            type?: string;
        };

        //make an instance of the type with no fields for now. This ensures that if no filter
        //  is applied to the service request, all the service requests will be sent
        const whereCondition :WhereCondition = {};

        //if there is a status filter, add it to the whereCondition
        if (statusFilter != null && statusFilter != Status.Any) {
            whereCondition.status = statusFilter;
        }
        //if there is a priority filter, add it to the whereCondition
        if(priorityFilter != null && priorityFilter != Priorities.any){
            whereCondition.reqPriority = priorityFilter;
        }
        //if there is an employee filter, add it to the whereCondition
        if(emplFilter != null && emplFilter != "" && emplFilter.toLowerCase() != "any"){
            whereCondition.assignedUName = emplFilter;
        }
        //if there is a location filter, add it to the whereCondition
        if(locFilter != null && locFilter != "" && locFilter.toLowerCase() != "any"){
            whereCondition.recLocationID = locFilter;
        }
        //if there is a type filter, add it to the whereCondition
        if(typeFilter != null && typeFilter != "" && typeFilter.toLowerCase() != "any"){
            whereCondition.type = typeFilter;
        }

        //send the request to the user with the specified conditions
        res.send(await PrismaClient.serviceRequest.findMany({
            where: whereCondition,
            orderBy: {
                reqID: "desc"
            }
        }));

        console.log("Res: " + res); //debugging info

        console.info("\nSuccessfully filtered requests\n"); //debugging info
        //send status unless 6 times bug occurs
        res.sendStatus(200);
    } catch {
        console.error("\nUnable to filter requests.\n");
        res.sendStatus(400); // Send error
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
            res.sendStatus(400); // Send error
        }


        //checks to make sure employee exists in database
        const newAssignedEmployee = await PrismaClient.employee.findUnique({
            where: {userName: newAssignedUser},
        });
        if (!newAssignedEmployee) {
            console.error(`Employee with username ${newAssignedUser} not found`);
            res.sendStatus(400); // Send error
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
        console.error("Unable to change assigned user");
        res.sendStatus(400); // Send error
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
            res.sendStatus(400); // Send error
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
    } catch(error){
        console.error("Unable to change service request state");
        res.sendStatus(400); // Send error
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
            res.sendStatus(400); // Send error
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

    } catch {
        console.error("Database issue with changing the Priority");
        res.sendStatus(400);
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
    } catch {
        console.log("Error removing request");
        res.sendStatus(400);
    }
});


// ---------------------------------    Med Request DB Interaction    ---------------------------------

//posts one new medicine request from the user to the database
//the new medReq and the new serviceRequest both get their own auto-generated ID
router.post("/medReq", async function (req: Request, res: Response) {
    //console.log(req.body);
    //console.log("Med Req Above");
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
                            userID:"0",
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
                medStrength: sentData[1].medStrength,
                medName: sentData[1].medName,
                quantity: sentData[1].quantity,
                genReqID: service.reqID,
                patientName: sentData[1].patientName,
                patientDOB: sentData[1].patientDOB,
                patientMedRecNum: sentData[1].patientMedRecordNum,
                medForm: sentData[1].medForm,
                medSig: sentData[1].medSig,
            }
        });
        console.info("Successfully saved Med Req"); // Log that it was successful
        //sendback the id of the request
        //console.info("HHH " +record.genReqID);
        res.send(200);
    } catch (error) {
        // Log any failures
        console.error(`Unable to save Med Req\n`);
        res.sendStatus(400); // Send error
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


            res.send([medReqs, serviceReqs]); //end res.send (this is what will be sent to the client)
            console.info("\nSuccessfully gave you all of the medical requests\n");
        } catch (err) {
            console.error("\nUnable to send requests\n");
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


            res.send([medReqs, serviceReqs]); //end res.send (this is what will be sent to the client)
            console.info("\nSuccessfully gave you all of the medical requests\n");
        } catch (err) {
            console.error("\nUnable to send requests\n");
        }
    }


});

router.get("/medReq/filter", async function (req: Request, res: Response) {
    try {
        const statusFilter: Status = req.query.status as Status;
        const priorityFilter: Priorities = req.query.priority as Priorities;
        const emplFilter: string = req.query.employee as string;
        const locFilter: string = req.query.location as string;

        console.log("statusfilter: \n" + statusFilter);
        console.log("priorityFilter: \n" + priorityFilter);
        console.log("emplFilter: \n" + emplFilter);
        console.log("locFilter: \n" + locFilter);

        //make a local type that potentially has one field for each filter
        type WhereCondition = {
            status?: string;
            reqPriority?: string;
            assignedUName?: string;
            reqLocationID?: string;
            reqType: string;
        };

        //make an instance of the type with one field that filters by religious requests
        // and no other fields. This ensures that if no filter is applied to the service request,
        // all the service requests will be sent
        const whereCondition :WhereCondition = {
            reqType: "medication"
        };


        //if there is a status filter, add it to the whereCondition
        if (statusFilter != null && statusFilter != Status.Any) {
            whereCondition.status = statusFilter;
        }
        //if there is a priority filter, add it to the whereCondition
        if(priorityFilter != null && priorityFilter == Priorities.any){
            whereCondition.reqPriority = priorityFilter;
        }
        //if there is an employee filter, add it to the whereCondition
        if(emplFilter != null && emplFilter != "" && emplFilter.toLowerCase() != "any"){
            whereCondition.assignedUName = emplFilter;
        }
        //if there is a location filter, add it to the whereCondition
        if(locFilter != null && locFilter != "" && locFilter.toLowerCase() != "any"){
            whereCondition.reqLocationID = locFilter;
        }

        //send the request to the user with the specified conditions
        res.send(await PrismaClient.serviceRequest.findMany({
            where: whereCondition,
            orderBy: {
                reqID: "desc"
            }
        }));

        console.log("Res: " + res); //debugging info

        console.info("\nSuccessfully filtered requests\n"); //debugging info
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
                            userID:"0",
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
    } catch {
        console.error("Outside Transportation Request Failed");
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
            res.send([transportReq, serviceReqs]);
            //send status unless 6 times bug occurs
            res.sendStatus(200);
            console.info("\nSuccessfully gave you all of the Outside Transportation Requests\n");
        } catch (err) {
            console.error("\nUnable to send Requests\n");
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
            res.send([transportReq, serviceReqs]);
            res.send([transportReq,serviceReqs]);
            //send status unless 6 times bug occurs
            res.sendStatus(200);
            console.info("\nSuccessfully gave you all of the Outside Transportation Requests\n");
        } catch (err) {
            console.error("\nUnable to send Requests\n");
        }

    }


});

router.get("/outsideTransport/filter", async function (req: Request, res: Response) {
    try {
        const statusFilter: Status = req.query.status as Status;
        const priorityFilter: Priorities = req.query.priority as Priorities;
        const emplFilter: string = req.query.employee as string;
        const locFilter: string = req.query.location as string;

        console.log("statusfilter: \n" + statusFilter);
        console.log("priorityFilter: \n" + priorityFilter);
        console.log("emplFilter: \n" + emplFilter);
        console.log("locFilter: \n" + locFilter);

        //make a local type that potentially has one field for each filter
        type WhereCondition = {
            status?: string;
            reqPriority?: string;
            assignedUName?: string;
            reqLocationID?: string;
            reqType: string;
        };

        //make an instance of the type with one field that filters by religious requests
        // and no other fields. This ensures that if no filter is applied to the service request,
        // all the service requests will be sent
        const whereCondition :WhereCondition = {
            reqType: "transportation"
        };


        //if there is a status filter, add it to the whereCondition
        if (statusFilter != null && statusFilter != Status.Any) {
            whereCondition.status = statusFilter;
        }
        //if there is a priority filter, add it to the whereCondition
        if(priorityFilter != null && priorityFilter == Priorities.any){
            whereCondition.reqPriority = priorityFilter;
        }
        //if there is an employee filter, add it to the whereCondition
        if(emplFilter != null && emplFilter != "" && emplFilter.toLowerCase() != "any"){
            whereCondition.assignedUName = emplFilter;
        }
        //if there is a location filter, add it to the whereCondition
        if(locFilter != null && locFilter != "" && locFilter.toLowerCase() != "any"){
            whereCondition.reqLocationID = locFilter;
        }

        //send the request to the user with the specified conditions
        res.send(await PrismaClient.serviceRequest.findMany({
            where: whereCondition,
            orderBy: {
                reqID: "desc"
            }
        }));

        console.log("Res: " + res); //debugging info

        console.info("\nSuccessfully filtered requests\n"); //debugging info
        //send status unless 6 times bug occurs
        res.sendStatus(200);

    } catch (err) {
        console.error("\nUnable to send requests\n");
        res.sendStatus(400); // Send error
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
    } catch {
        console.error("Sanitation Request Failed");
        res.sendStatus(400);
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
            res.send([sanReq,serviceReqs]);
            //send status unless 6 times bug occurs
            res.sendStatus(200);
            console.info("\nSuccessfully gave you all of the Sanitation Requests\n");
        } catch (err) {
            console.error("\nUnable to send Requests\n");
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
            res.send([sanReq,serviceReqs]);
            //send status unless 6 times bug occurs
            res.sendStatus(200);
            console.info("\nSuccessfully gave you all of the Sanitation Requests\n");
        } catch (err) {
            console.error("\nUnable to send Requests\n");
        }
    }
});

router.get("/sanReq/filter", async function (req: Request, res: Response) {
    try {
        const statusFilter: Status = req.query.status as Status;
        const priorityFilter: Priorities = req.query.priority as Priorities;
        const emplFilter: string = req.query.employee as string;
        const locFilter: string = req.query.location as string;

        console.log("statusfilter: \n" + statusFilter);
        console.log("priorityFilter: \n" + priorityFilter);
        console.log("emplFilter: \n" + emplFilter);
        console.log("locFilter: \n" + locFilter);

        //make a local type that potentially has one field for each filter
        type WhereCondition = {
            status?: string;
            reqPriority?: string;
            assignedUName?: string;
            reqLocationID?: string;
            reqType: string;
        };

        //make an instance of the type with one field that filters by religious requests
        // and no other fields. This ensures that if no filter is applied to the service request,
        // all the service requests will be sent
        const whereCondition :WhereCondition = {
            reqType: "sanitation"
        };


        //if there is a status filter, add it to the whereCondition
        if (statusFilter != null && statusFilter != Status.Any) {
            whereCondition.status = statusFilter;
        }
        //if there is a priority filter, add it to the whereCondition
        if(priorityFilter != null && priorityFilter == Priorities.any){
            whereCondition.reqPriority = priorityFilter;
        }
        //if there is an employee filter, add it to the whereCondition
        if(emplFilter != null && emplFilter != "" && emplFilter.toLowerCase() != "any"){
            whereCondition.assignedUName = emplFilter;
        }
        //if there is a location filter, add it to the whereCondition
        if(locFilter != null && locFilter != "" && locFilter.toLowerCase() != "any"){
            whereCondition.reqLocationID = locFilter;
        }

        //send the request to the user with the specified conditions
        res.send(await PrismaClient.serviceRequest.findMany({
            where: whereCondition,
            orderBy: {
                reqID: "desc"
            }
        }));

        console.log("Res: " + res); //debugging info

        console.info("\nSuccessfully filtered requests\n"); //debugging info
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
                            userID:"0",
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
        res.send(200);
    } catch (error) {
        // Log any failures
        console.error(`Unable to save Flow Req`);
        res.sendStatus(400); // Send error
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
            res.send([flowReqs, serviceReqs]); //end res.send (this is what will be sent to the client)
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
            res.send([flowReqs, serviceReqs]); //end res.send (this is what will be sent to the client)
            console.info("\nSuccessfully gave you all of the flower requests\n");
        }
    } catch (err) {
        console.error("\nUnable to send requests\n");
    }
});

router.get("/flowReq/filter", async function (req: Request, res: Response) {
    try {
        const statusFilter: Status = req.query.status as Status;
        const priorityFilter: Priorities = req.query.priority as Priorities;
        const emplFilter: string = req.query.employee as string;
        const locFilter: string = req.query.location as string;

        console.log("statusfilter: \n" + statusFilter);
        console.log("priorityFilter: \n" + priorityFilter);
        console.log("emplFilter: \n" + emplFilter);
        console.log("locFilter: \n" + locFilter);

        //make a local type that potentially has one field for each filter
        type WhereCondition = {
            status?: string;
            reqPriority?: string;
            assignedUName?: string;
            reqLocationID?: string;
            reqType: string;
        };

        //make an instance of the type with one field that filters by religious requests
        // and no other fields. This ensures that if no filter is applied to the service request,
        // all the service requests will be sent
        const whereCondition :WhereCondition = {
            reqType: "flower delivery"
        };


        //if there is a status filter, add it to the whereCondition
        if (statusFilter != null && statusFilter != Status.Any) {
            whereCondition.status = statusFilter;
        }
        //if there is a priority filter, add it to the whereCondition
        if(priorityFilter != null && priorityFilter == Priorities.any){
            whereCondition.reqPriority = priorityFilter;
        }
        //if there is an employee filter, add it to the whereCondition
        if(emplFilter != null && emplFilter != "" && emplFilter.toLowerCase() != "any"){
            whereCondition.assignedUName = emplFilter;
        }
        //if there is a location filter, add it to the whereCondition
        if(locFilter != null && locFilter != "" && locFilter.toLowerCase() != "any"){
            whereCondition.reqLocationID = locFilter;
        }

        //send the request to the user with the specified conditions
        res.send(await PrismaClient.serviceRequest.findMany({
            where: whereCondition,
            orderBy: {
                reqID: "desc"
            }
        }));

        console.log("Res: " + res); //debugging info

        console.info("\nSuccessfully filtered requests\n"); //debugging info
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
                            userID:"0",
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
        console.error("Unable to save the Religious Request");
        res.sendStatus(400);
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
            res.send([religReq, serviceReqs]);
            console.info("\nSuccessfully gave you all of the Religious Requests\n");
            //send status unless 6 times bug occurs
            res.sendStatus(200);
        } catch (err) {
            console.error("\nUnable to send Requests\n");
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
            res.send([religReq, serviceReqs]);
            console.info("\nSuccessfully gave you all of the Religious Requests\n");
            //send status unless 6 times bug occurs
            res.sendStatus(200);
        } catch (err) {
            console.error("\nUnable to send Requests\n");
        }
    }


});
router.get("/religiousRequest/filter", async function (req: Request, res: Response) {
    try {
        const statusFilter: Status = req.query.status as Status;
        const priorityFilter: Priorities = req.query.priority as Priorities;
        const emplFilter: string = req.query.employee as string;
        const locFilter: string = req.query.location as string;

        console.log("statusfilter: \n" + statusFilter);
        console.log("priorityFilter: \n" + priorityFilter);
        console.log("emplFilter: \n" + emplFilter);
        console.log("locFilter: \n" + locFilter);

        //make a local type that potentially has one field for each filter
        type WhereCondition = {
            status?: string;
            reqPriority?: string;
            assignedUName?: string;
            reqLocationID?: string;
            reqType: string;
        };

        //make an instance of the type with one field that filters by religious requests
        // and no other fields. This ensures that if no filter is applied to the service request,
        // all the service requests will be sent
        const whereCondition :WhereCondition = {
            reqType: "religious"
        };


        //if there is a status filter, add it to the whereCondition
        if (statusFilter != null && statusFilter != Status.Any) {
            whereCondition.status = statusFilter;
        }
        //if there is a priority filter, add it to the whereCondition
        if(priorityFilter != null && priorityFilter == Priorities.any){
            whereCondition.reqPriority = priorityFilter;
        }
        //if there is an employee filter, add it to the whereCondition
        if(emplFilter != null && emplFilter != "" && emplFilter.toLowerCase() != "any"){
            whereCondition.assignedUName = emplFilter;
        }
        //if there is a location filter, add it to the whereCondition
        if(locFilter != null && locFilter != "" && locFilter.toLowerCase() != "any"){
            whereCondition.reqLocationID = locFilter;
        }

        //send the request to the user with the specified conditions
        res.send(await PrismaClient.serviceRequest.findMany({
            where: whereCondition,
            orderBy: {
                reqID: "desc"
            }
        }));

        console.log("Res: " + res); //debugging info

        console.info("\nSuccessfully filtered requests\n"); //debugging info
        //send status unless 6 times bug occurs
        res.sendStatus(200);

    } catch (err) {
        console.error("\nUnable to send requests\n");
        res.sendStatus(400); // Send error
    }
});

export default router;
