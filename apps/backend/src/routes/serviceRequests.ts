import express, {Router, Request, Response} from "express";
//import { MedReq, Request } from "../algorithms/node.ts";
import PrismaClient from "../bin/database-connection.ts";
import {
    FlowReq,
    MedReq,
    OutsideTransport,
    priorities,
    sanReq,
    ServiceRequest,
    ReligRequest,
    ReqTypes
} from "../algorithms/Requests/Request.ts";
import Status from "../algorithms/Requests/Status.ts";
import status from "../algorithms/Requests/Status.ts";
// import {MedReq} from "../algorithms/Requests/Request.ts"; //may also be wrong

//import path from "path";
//import fs from "fs";

const router: Router = express.Router();

// ---------------------------------    Med Request DB Interaction    ---------------------------------

//posts all medication requests in the body of the function to the database
// each request gets its own auto-generated ID
//router.post("/post-all", async function (req: Request, res: Response) {});

//posts one new medication request from the user to the database
//the new medReq and the new serviceRequest both get their own auto-generated ID
router.post("/medReq", async function (req: Request, res: Response) {
    //console.log(req.body);
    //console.log("Med Req Above");
    const sentData:[ServiceRequest,MedReq] = req.body;
    console.info(sentData);

    //sets every part of node to whatever was entered while running (not during compile - point of promise/await)
    try {

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
                    connect : {
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
                        create : {
                            userName: "No one",
                            firstName: "N/A",
                            lastName: "N/A",
                            designation: "N/A",
                            isAdmin: true,
                        },
                        //second part of create or connect (the what-we-connect-to part)
                        where : {
                            userName: "No one"
                        }
                    }
                }
            },
        });
        console.info("Successfully saved Req"); // Log that it was successful

        //create a Med Req (use data from the second element since we always put med req data type in second)
        await PrismaClient.medReq.create({
            data: {
                dosage: sentData[1].dosage,
                medType: sentData[1].medType,
                numDoses: sentData[1].numDoses,
                genReqID: service.reqID,
                }
        });
        console.info("Successfully saved Med Req"); // Log that it was successful
        //sendback the id of the request
        //console.info("HHH " +record.genReqID);
        res.send(200);
    } catch (error) {
        // Log any failures
        console.error(`Unable to save Med Req`);
        res.sendStatus(400); // Send error
    }
});

//gets all requests from the database in the form of request objects
router.get("/medReq", async function (req: Request, res: Response) {
    const statusFilter:status = req.query.status as status;
    console.log("pog");
    console.log(statusFilter);
    if(statusFilter == Status.Any){
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
                where:{
                    reqType:"medication"
                }
            });


            res.send([medReqs,serviceReqs]); //end res.send (this is what will be sent to the client)
            console.info("\nSuccessfully gave you all of the medical requests\n");
            //send status unless 6 times bug occurs
            res.sendStatus(200);
        } catch (err) {
            console.error("\nUnable to send requests\n");
        }

    }
    else {
        try {
            //try to send all the nodes to the client

            const medReqs = await PrismaClient.medReq.findMany({
                orderBy: {
                    genReqID: "asc", //order by service request id so the two arrays are parallel
                },
                where:{
                    genReq:{
                        status:statusFilter
                    }

                }
            });

            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where:{
                    reqType:"medication",
                    status:statusFilter
                }
            });


            res.send([medReqs,serviceReqs]); //end res.send (this is what will be sent to the client)
            console.info("\nSuccessfully gave you all of the medical requests\n");
            //send status unless 6 times bug occurs
            res.sendStatus(200);
        } catch (err) {
            console.error("\nUnable to send requests\n");
        }
    }



});



// ---------------------------------    Service Request DB Interaction    ---------------------------------



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


router.get("/filterByStatus", async function (req: Request, res: Response) {
    try {
        const statusFilter:status = req.query.status as status;

        console.log("statusfilter");
        console.log(statusFilter);
        //if no filter is applied to the service request, then send all the service requests
        if(statusFilter == Status.Any) {
                res.send( await PrismaClient.serviceRequest.findMany({
                    orderBy: {
                        reqID: "desc"
                    }
                }));

            // {
            //     include: {
            //         outsideTransport: true,
            //             sanReq: true,
            //             flowReq: true,
            //             medReq: true
            //     }
            // }
        } else {            //otherwise... send only the service requests that have the desired status
            res.send(await PrismaClient.serviceRequest.findMany({
                where: {
                    status: statusFilter        //filtering
                },
                orderBy: {
                    reqID: "desc"
                }
            }));

            console.log("Res: " + res); //debugging info
        }

        console.info("\nSuccessfully filtered requests\n"); //debugging info
        //send status unless 6 times bug occurs
        res.sendStatus(200);
    } catch {
        console.error("\nUnable to filter requests\n");
        res.sendStatus(400); // Send error
    }
});


router.get("/filterByPriority", async function (req: Request, res: Response) {
    try {
        //make sure we know what data is coming in (priority enum that was set by a filter)
        const priorityFilter: priorities = req.query.priorities as priorities;
        console.log("Priority Filter: " +priorityFilter);

        if(priorityFilter == priorities.any)
        {
            //send them every service request since they do not care about the priority
            res.send(await PrismaClient.serviceRequest.findMany( {
                orderBy: {
                    reqID: "asc"
                }
            }));

        }
        else
        {
            //send them their service requests with the correct priority
            res.send(await PrismaClient.serviceRequest.findMany({
                where: {
                    //filter by the desired priority
                    reqPriority: priorityFilter,
                    //do not want completed requests cluttering up our page (completed requests could block the emergency reqs)
                    NOT: [
                        {
                            status: status.Completed
                        }
                    ]
                }
            }));
            console.log("Great Job, the priority has been filtered");
        }

        //send status unless 6 times bug occurs
        res.sendStatus(200);


    } catch {
        console.log("Error Filtering by Priority");
        res.sendStatus(400);
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

        console.log("PPP "+reqID+"  "+newState);

        //checks to make sure that service request exists in database
        const serviceRequest = await PrismaClient.serviceRequest.findUnique({
            where: {reqID: reqID},
        });
        if (!serviceRequest) {
            console.error(`Service Request with ID ${reqID} not found`);
            res.sendStatus(400); // Send error
        }

        await PrismaClient.serviceRequest.update({
            where: { reqID: reqID },
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

router.post("/changePriority", async function (req: Request, res: Response){
    try {
        //let the router know that the data that is incoming will be organized like this
        const {reqID, newPriority} = req.body;

        //make sure the entry is in the DB
        const servReq = await PrismaClient.serviceRequest.findUnique({
            where: {reqID: reqID},
        });

        //if there is no entry in the DB matching that service request id, then let the person know that there is an error
        if(!servReq) {
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


// ---------------------------------    Outside Transport DB Interaction    ---------------------------------

router.post("/outsideTransport", async function (req: Request, res: Response) {
    const sentData:[ServiceRequest,OutsideTransport] = req.body;
    console.log(sentData);
    try {
        //you need a service request to make an outside transportation request, so let the router know that you are receiving both
        console.log("sds");
        console.log(sentData[0]);
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
                }
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
    const statusFilter:status = req.query.status as status;

    if(statusFilter == Status.Any){

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
                where:{
                    reqType:"transportation"
                }
            });

            //we display info from both the service req and the outside transportation req, so we send the person both DB objects
            res.send([transportReq,serviceReqs]);
            //send status unless 6 times bug occurs
            res.sendStatus(200);
            console.info("\nSuccessfully gave you all of the Outside Transportation Requests\n");
        } catch (err) {
            console.error("\nUnable to send Requests\n");
        }

    }
    else{
        try {

            const transportReq = await PrismaClient.outsideTransport.findMany({
                orderBy: {
                    serviceReqID: "asc", //order by service request id so the two arrays are parallel
                },
                where:{
                    serviceReq:{
                        status:statusFilter
                    }

                }
            });

            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where:{
                    reqType:"transportation",
                    status:statusFilter
                }
            });

            //we display info from both the service req and the outside transportation req, so we send the person both DB objects
            res.send([transportReq,serviceReqs]);
            //send status unless 6 times bug occurs
            res.sendStatus(200);
            console.info("\nSuccessfully gave you all of the Outside Transportation Requests\n");
        } catch (err) {
            console.error("\nUnable to send Requests\n");
        }

    }



});

// ---------------------------------    Sanitation DB Interaction    ---------------------------------

router.post("/sanReq", async function (req: Request, res: Response) {
    try {
        //you need a service request to make an Sanitation transportation request, so let the router know that you are receiving both
        const sentData:[ServiceRequest,sanReq] = req.body;
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
                }
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

    const statusFilter:status = req.query.status as status;

    if(statusFilter == Status.Any){
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
                where:{
                    reqType:"sanitation"
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
    else{
        try {

            const sanReq = await PrismaClient.sanReq.findMany({
                orderBy: {
                    serviceReqID: "asc", //order by service request id so the two arrays are parallel
                },
                where:{
                    serviceReq:{
                        status:statusFilter
                    }

                }
            });

            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where:{
                    reqType:"sanitation",
                    status:statusFilter
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


// ---------------------------------    Flower Request DB Interaction    ---------------------------------

router.post("/flowReq", async function (req: Request, res: Response) {
    //console.log(req.body);
    //console.log("Flow Req Above");
    const flowData:[ServiceRequest,FlowReq] = req.body;
    console.info("Flower Data");
    console.info(flowData);

    //sets every part of node to whatever was entered while running (not during compile - point of promise/await)
    try {

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
                    connect : {
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
                        create : {
                            userName: "No one",
                            firstName: "N/A",
                            lastName: "N/A",
                            designation: "N/A",
                            isAdmin: true,
                        },
                        //second part of create or connect (the what-we-connect-to part)
                        where : {
                            userName: "No one"
                        }
                    }
                }
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

// ---------------------------------    Relig Req DB Interaction    ---------------------------------
router.post('/religiousRequest', async function(req:Request, res:Response) {
    try{

        const sentData:[ServiceRequest,ReligRequest] = req.body;
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
                }
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
    }
    catch(err)
    {
        console.error("Unable to save the Religious Request");
        res.sendStatus(400);
    }
});

router.get("/religiousRequest", async function (req: Request, res: Response) {

    const statusFilter:status = req.query.status as status;

    if(statusFilter == Status.Any){
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
                where:{
                    reqType:"religious"
                }
            });

            //we display info from both the service req and the outside transportation req, so we send the person both DB objects
            res.send([religReq,serviceReqs]);
            console.info("\nSuccessfully gave you all of the Religious Requests\n");
            //send status unless 6 times bug occurs
            res.sendStatus(200);
        } catch (err) {
            console.error("\nUnable to send Requests\n");
        }
    }
    else{
        try {

            const religReq = await PrismaClient.religiousReq.findMany({
                orderBy: {
                    genReqID: "asc", //order by service request id so the two arrays are parallel
                },
                where:{
                    genReq:{
                        status:statusFilter
                    }

                }
            });

            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where:{
                    reqType:"religious",
                    status:statusFilter
                }
            });

            //we display info from both the service req and the outside transportation req, so we send the person both DB objects
            res.send([religReq,serviceReqs]);
            console.info("\nSuccessfully gave you all of the Religious Requests\n");
            //send status unless 6 times bug occurs
            res.sendStatus(200);
        } catch (err) {
            console.error("\nUnable to send Requests\n");
        }
    }


});

router.get("/flowReq", async function (req: Request, res: Response) {
    try {
        //
        const filterStatus:status = req.query.status as status;
        console.log("filter flow req");
        console.log(filterStatus);

        if (filterStatus == "Any"){
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
                where:{
                    reqType:ReqTypes.flowReq,
                }
            });
            res.send([flowReqs,serviceReqs]); //end res.send (this is what will be sent to the client)
            console.info("\nSuccessfully gave you all of the flower requests\n");
            //send status unless 6 times bug occurs
            res.sendStatus(200);
        }
        else{
            //try to send all the nodes to the client
            const flowReqs = await PrismaClient.flowReq.findMany({
                orderBy: {
                    genReqID: "asc", //order by service request id so the two arrays are parallel
                },
                where: {
                    genReq:{
                        status: filterStatus,
                    }
                }
            });
            const serviceReqs = await PrismaClient.serviceRequest.findMany({
                orderBy: {
                    reqID: "asc", //order by service request id so the two arrays are parallel
                },
                where:{
                    reqType:ReqTypes.flowReq,
                    status: filterStatus,
                }
            });
            res.send([flowReqs,serviceReqs]); //end res.send (this is what will be sent to the client)
            console.info("\nSuccessfully gave you all of the flower requests\n");
            //send status unless 6 times bug occurs
            res.sendStatus(200);
        }
    } catch (err) {
        console.error("\nUnable to send requests\n");
    }
});

export default router;
