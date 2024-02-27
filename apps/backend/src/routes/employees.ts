import express, {Router, Request, Response} from "express";
import PrismaClient from "../bin/database-connection.ts";
import {Employee} from "common/src/algorithms/Employee/Employee.ts";
import fs from "fs";
import {readEmployeeCSV} from "../algorithms/readCSV.ts";
import multer from "multer";
import {ManagementClient} from "auth0";
import Status from "common/src/algorithms/Requests/Status.ts";


const router: Router = express.Router();
const upload = multer({dest: 'uploadedCSVs/'});


const auth0 = new ManagementClient({
    domain: 'dev-hca27okc2srfyen8.us.auth0.com',
    clientId: 'sjOBn2g3OxSS11LMuXopKBZ4mao8drry',
    clientSecret: 'B0rX2U4tbxl9fO_SNNfgOgQxo9lrqGd2ti2CPqNwUxUxcMESdONNeZcK52Ec4g4d',
});


/**
 * import the oh my goodnesses into the badness
 * @param req it's got the csv
 * @param res send this
 *
 */
async function handleCSVImport(req: Request, res: Response): Promise<void> {
    /* What the HECK */
    console.log("handleCSVImport: Employee CSV import requested");


    const employeeFile: Express.Multer.File[] = req.files as Express.Multer.File[];
    if (employeeFile == null) {
        console.error("handleCSVImport: employee file was BAD");
        res.status(500).send("EMPLOYEE CSV DID NOT PROCESS");
        return;
    }

    /* put the "File" into a string */
    const employeeDataString: string = fs.readFileSync(employeeFile[0].path, "utf-8");

    /* turn the string into an array of employees */
    const employeeArray: Array<Employee> = readEmployeeCSV(employeeDataString);

    /* stryder's prisma */
    try {
        /* DROP TABLE * */
        await PrismaClient.$transaction([
            PrismaClient.medReq.deleteMany(),
            PrismaClient.sanReq.deleteMany(),
            PrismaClient.religiousReq.deleteMany(),
            PrismaClient.outsideTransport.deleteMany(),
            PrismaClient.flowReq.deleteMany(),
            PrismaClient.serviceRequest.deleteMany(),
            // PrismaClient.employee.deleteMany()
        ]);


        //delete all old users from auth0
        await PrismaClient.employee.findMany().then(async (allEmps) => {
            for (const singleEmp of allEmps) {
                if(singleEmp.userName=="No one"){
                    continue;
                }
                console.log("trying to delete " + singleEmp.userName);

                await new Promise(r => setTimeout(r, 500));

                await auth0.users.delete({id: singleEmp.userID}).then(
                    (authRes) => {
                        console.log("deleted " + singleEmp.userName);
                        console.log(authRes.data);
                    });
            }
        });
        console.log("ended");

        //now delete all users in the db
        await PrismaClient.employee.deleteMany();


        //add users to auth0
        for (const emp of employeeArray) {
            await new Promise(r => setTimeout(r, 500));
            try {
                await auth0.users.create({
                    email: emp.userName,
                    password: 'EclipseEchidnasDB!',
                    connection: 'Username-Password-Authentication'
                }).then((authRes) =>
                {
                    console.log(authRes.data);
                    emp.userID = authRes.data.user_id;
                });
            }catch (e){
                console.log("auth0 errorr");
                console.log(e);
            }
        }


        //create the no one employee
        await PrismaClient.employee.create({data: {
                userID: "0",
                userName: "No one",
                firstName: "N",
                lastName: "/ A",
                designation: "N/A",
                isAdmin: false,
            }});
        /* shove it into a clean prisma */
        await PrismaClient.employee.createMany({data: employeeArray});
    }

    /* yikes case */
    catch (error) {
        console.error("handleCSVImport: failed to put CSV into prisma: " + error);
        res.sendStatus(500); // and send 204
        return;
    }

    /* we did it */
    res.status(200).send("ok, nice");
}

router.route("/employee_csv_import").post(upload.array("csv", 1), handleCSVImport);

//post one employee into the database
router.post("/employee", async function (req: Request, res: Response) {
    const employeeData: Employee = req.body;
    console.log(req.body);

    try {
        await PrismaClient.employee.create({
            data: {
                userID: employeeData.userID,
                userName: employeeData.userName,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                designation: employeeData.designation,
                isAdmin: employeeData.isAdmin,
            },
        });
        res.sendStatus(200);
        console.info("Successfully saved employee"); // Log that it was successful
        res.sendStatus(200);
    } catch (err) {
        // Log any failures
        console.error("Unable to save employee" + err);
        res.sendStatus(500); // Send error
    }
});

//function to update an employee's info (pass in an Employee object)
router.post("/updateEmployee", async function (req: Request, res: Response) {
    //get the new employee info (new info is stored in an employee object)
    const employeeData: Employee = req.body;
    //debug info
    console.log("Updated Info");
    console.log(employeeData);

    //query the database to update the desired employee
    try {
        await PrismaClient.employee.update({
            where: {
                userID: employeeData.userID
            },
            data: {
                //transfer all the info from the object into the database
                userName: employeeData.userName,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                designation: employeeData.designation,
                isAdmin: employeeData.isAdmin
            }
        });
        //debug info to let us know that the employee was successfully updated
        console.log("Employee successfully updated");
        res.sendStatus(200);
    } catch (err) {
        //debug info to let us know that we failed to update the employee
        console.log("Error with Updating an Employee (Check to see if the employee exists)" + err);
        res.sendStatus(500);
    }
});

//function to delete employee (fire them) --- Pass a string (employee's username) to function
router.post("/deleteEmployee", async function (req: Request, res: Response) {
    console.log("req.body");
    console.log(req.body);

    //get the user which the admin wants to fire
    const data: string[] = req.body as string[];

    console.log("DDDD");
    console.log(data[0]);




    try {

        //query the database to delete the employee
        await PrismaClient.employee.delete({
            where: {
                userID: data[0]          //employee's username is unique, so we must delete an employee by their username
            }
        });
        //debug info to know that we successfully deleted the employee
        console.log("Employee Successfully Fired!");
        res.sendStatus(200);
    } catch (err) {
        //debug info to know that we failed to delete the employee
        console.log("Error with Firing the Employee (Check to see if the employee exists)" + err);
        res.sendStatus(500);
    }
});


//gets all employees from the database in the form of employee objects
router.get("/employees", async function (req: Request, res: Response) {
    try {
        //try to send all the employees to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.status(200).send(await PrismaClient.employee.findMany(
            {
                orderBy:{
                    firstName: "asc"
                }
            }

        )); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you the the employees\n");
    } catch (err) {
        console.error("\nUnable to send employees\n" + err);
        res.sendStatus(500);
    }
});

//gets all employees with medicineRequest permissions
router.get("/employees/med", async function (req: Request, res: Response) {
    try {

        res.status(200).send(await PrismaClient.employee.findMany(
            {
                where: {
                    OR: [
                        {
                            designation: "doctor"
                        },
                        {
                            designation: "nurse"
                        },
                        {
                            designation: "administrator"
                        },
                        {
                            userName: "No one"
                        }
                    ]

                }

            }
        )); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you the the employees\n");
    } catch (err) {
        console.error("\nUnable to send employees\n" + err);
        res.sendStatus(500);
    }
});

//gets all employees with sanitationRequest permissions
router.get("/employees/san", async function (req: Request, res: Response) {
    try {

        res.status(200).send(await PrismaClient.employee.findMany(
            {
                where: {
                    OR: [
                        {
                            designation: "janitor"
                        },
                        {
                            userName: "No one"
                        }
                    ]

                }

            }
        )); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you the the employees\n");
    } catch (err) {
        console.error("\nUnable to send employees\n" + err);
        res.sendStatus(500);
    }
});

//gets all employees with outsideTransport permissions
router.get("/employees/transport", async function (req: Request, res: Response) {
    try {
        res.status(200).send(await PrismaClient.employee.findMany(
            {
                where: {
                    OR: [
                        {
                            designation: "doctor"
                        },
                        {
                            designation: "nurse"
                        },
                        {
                            designation: "administrator"
                        },
                        {
                            userName: "No one"
                        }
                    ]

                }

            }
        )); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you the the employees\n");
    } catch (err) {
        console.error("\nUnable to send employees\n" + err);
        res.sendStatus(500);
    }
});

//gets all employees with flowerRequest permissions
router.get("/employees/flow", async function (req: Request, res: Response) {
    try {

        res.status(200).send(await PrismaClient.employee.findMany(
            {
                where: {
                    OR: [
                        {
                            designation: "flower deliverer"
                        },
                        {
                            userName: "No one"
                        }
                    ]

                }

            }
        )); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you the the employees\n");
    } catch (err) {
        console.error("\nUnable to send employees\n" + err);
        res.sendStatus(500);
    }
});

//gets all employees with religiousRequest permissions
router.get("/employees/rel", async function (req: Request, res: Response) {
    res.send(
        religEmployees(req.body)
    ); //end res.send (this is what will be sent to the client)
});

//gets the employee with the username of the Auth0 login
router.get("/current_employee", async function (req: Request, res: Response) {
    const currentUser: Employee = req.body;
    try {
        //try to send the employee to the client
        res.send(await PrismaClient.employee.findUnique(
            {
                where: {userName: currentUser.userName}
            }
        )); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you the employee\n");
    } catch (err) {
        console.error("\nUnable to send employee\n");
        res.send(500);
    }
});

//gets the employee with the username of the Auth0 login
router.get("/employee_by_uname", async function (req: Request, res: Response) {
    console.log("entered the router.get");
    const uName: string = req.query.name as string;
    console.log("uName in the backend is "+uName);
    try {
        //try to send the employee to the client
        res.send(await PrismaClient.employee.findUnique(
            {
                where: {userName: uName}
            }
        )); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you the employee\n");
    } catch (err) {
        console.error("\nUnable to send employee\n");
        res.send(500);
    }
});

router.get("/current_employee/doesExist", async function (req: Request, res: Response) {
    const email: string = req.query.email as string;
    console.log("this is checked email " +email);
    try {


        const emp = await PrismaClient.employee.findUnique(
            {
                where: {userName: email}
            }
        );

        if(emp == null){
            res.status(200).send(null);
        }
        else{
            res.status(200).send(emp);
        }



        console.info("\nSuccessfully checked a employee \n");
    } catch (err) {
        console.error("\nUnable to send employees\n");
    }
});

router.get("/current_employee/stats", async function (req: Request, res: Response) {
    const email: string = req.query.email as string;
    console.log("this is checked email " +email);
    try {
        const statistics = await PrismaClient.serviceRequest.findMany({
            where: {
                assignedUName:email,
                NOT:{
                    status:Status.Completed
                }

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

        res.status(200).send(result);
        console.info("\nSuccessfully gave you all of the statistics\n");


    } catch (err) {
        console.error("\nUnable to send employees\n");
    }
});

router.get("/current_employee/buildingStats", async function (req: Request, res: Response) {
    const email: string = req.query.email as string;
    console.log("this is checked email " +email);
    try {
        const serviceRequest = await PrismaClient.serviceRequest.findMany({
            where: {
                assignedUName:email,
                NOT:{
                    status:Status.Completed
                }
            },
            include: {
                reqLocation: true
            }
        });
        const shapiro = {
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
        const tower = {
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
        const Francis45 = {
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
        const Francis15 = {
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
        const BTM = {
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
        for (const entry of serviceRequest) {
            if (entry.reqLocation.building == "Shapiro") {
                shapiro.total++;
                if (entry.reqPriority == "Low") shapiro.lowPrio++;
                if (entry.reqPriority == "Medium") shapiro.medPrio++;
                if (entry.reqPriority == "High") shapiro.highPrio++;
                if (entry.reqPriority == "Emergency") shapiro.emergPrio++;
                if (entry.status == "Unassigned") shapiro.unassigned++;
                if (entry.status == "Assigned") shapiro.assigned++;
                if (entry.status == "In Progress") shapiro.inProgress++;
                if (entry.status == "Completed") shapiro.completed++;
            }
            if (entry.reqLocation.building == "Tower") {
                tower.total++;
                if (entry.reqPriority == "Low") tower.lowPrio++;
                if (entry.reqPriority == "Medium") tower.medPrio++;
                if (entry.reqPriority == "High") tower.highPrio++;
                if (entry.reqPriority == "Emergency") tower.emergPrio++;
                if (entry.status == "Unassigned") tower.unassigned++;
                if (entry.status == "Assigned") tower.assigned++;
                if (entry.status == "In Progress") tower.inProgress++;
                if (entry.status == "Completed") tower.completed++;
            }
            if (entry.reqLocation.building == "45 Francis") {
                Francis45.total++;
                if (entry.reqPriority == "Low") Francis45.lowPrio++;
                if (entry.reqPriority == "Medium") Francis45.medPrio++;
                if (entry.reqPriority == "High") Francis45.highPrio++;
                if (entry.reqPriority == "Emergency") Francis45.emergPrio++;
                if (entry.status == "Unassigned") Francis45.unassigned++;
                if (entry.status == "Assigned") Francis45.assigned++;
                if (entry.status == "In Progress") Francis45.inProgress++;
                if (entry.status == "Completed") Francis45.completed++;
            }
            if (entry.reqLocation.building == "15 Francis") {
                Francis15.total++;
                if (entry.reqPriority == "Low") Francis15.lowPrio++;
                if (entry.reqPriority == "Medium") Francis15.medPrio++;
                if (entry.reqPriority == "High") Francis15.highPrio++;
                if (entry.reqPriority == "Emergency") Francis15.emergPrio++;
                if (entry.status == "Unassigned") Francis15.unassigned++;
                if (entry.status == "Assigned") Francis15.assigned++;
                if (entry.status == "In Progress") Francis15.inProgress++;
                if (entry.status == "Completed") Francis15.completed++;
            }
            if (entry.reqLocation.building == "BTM") {
                BTM.total++;
                if (entry.reqPriority == "Low") BTM.lowPrio++;
                if (entry.reqPriority == "Medium") BTM.medPrio++;
                if (entry.reqPriority == "High") BTM.highPrio++;
                if (entry.reqPriority == "Emergency") BTM.emergPrio++;
                if (entry.status == "Unassigned") BTM.unassigned++;
                if (entry.status == "Assigned") BTM.assigned++;
                if (entry.status == "In Progress") BTM.inProgress++;
                if (entry.status == "Completed") BTM.completed++;
            }

        }

        const result = {
            shapiro, tower, Francis45, Francis15, BTM
        };

        res.status(200).send(result);
        console.info("\nSuccessfully gave you all of the statistics\n");





        console.info("\nSuccessfully checked a employee \n");
    } catch (err) {
        console.error("\nUnable to send employees\n");
    }
});




export async function religEmployees(religion:string){
    console.log("abstract employees/rel");
    try {
        console.log("religion is "+religion+"\n");
        let typeOfReligiousPersonnel = "religious personnel";
        switch (religion) {
            case "Buddhism":
                typeOfReligiousPersonnel = "Buddhist personnel";
                break;
            case "Christianity (Catholicism)":
                typeOfReligiousPersonnel = "Catholic personnel";
                break;
            case "Christianity (Mormonism)":
                typeOfReligiousPersonnel = "Mormon personnel";
                break;
            case "Christianity (Non-Denominational)":
                typeOfReligiousPersonnel = "Christian (non-denominational) personnel";
                break;
            case "Christianity (Protestantism)":
                typeOfReligiousPersonnel = "Protestant personnel";
                break;
            case "Hinduism":
                typeOfReligiousPersonnel = "Hindu personnel";
                break;
            case "Islam":
                typeOfReligiousPersonnel = "Muslim personnel";
                break;
            case "Jainism":
                typeOfReligiousPersonnel = "Jain personnel";
                break;
            case "Judaism":
                typeOfReligiousPersonnel = "Jewish personnel";
                break;
            case "Sikhism":
                typeOfReligiousPersonnel = "Sikh personnel";
                break;
            case "Shinto":
                typeOfReligiousPersonnel = "Shinto personnel";
                break;
            /*default:
                typeOfReligiousPersonnel = "religious personnel";
                break;*/ //already covered by the definition of the var
        }
        console.info("\nSuccessfully gave you the the employees\n");
        return await PrismaClient.employee.findMany(
            {
                where: {
                    OR: [
                        {
                            designation: typeOfReligiousPersonnel
                        },
                        { //always pull "religious personnel", no matter the religion
                            designation: "religious personnel"
                        },
                        {
                            userName: "No one"
                        }
                    ]

                }

            }
        ); //end res.send (this is what will be sent to the client)
    } catch (err) {
        console.error("\nUnable to send employees\n" + err);
    }
}

//gets the employee with the username of the Auth0 login
router.get("/current_employee/:emp", async function (req: Request, res: Response) {
    console.log(req.params);
    const currentUser: string = req.params.emp as string;
    console.log("CURRENT USER: " + currentUser);
    try {
        //try to send all the employees to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        const test = await PrismaClient.employee.findUnique(
            {
                where: {userName: currentUser}
            });
        res.status(200).send(test);
        console.info("\nSuccessfully gave you the employee\n");
    } catch (err) {
        console.error("\nUnable to send employees\n" + err);
        res.sendStatus(500);
    }
});

router.post("/onLogin", async function (req: Request, res: Response)  {
    //param is specified in frontend to have an attribute of "email", which is what req.query is referencing
    const employeeData:Employee = req.body as Employee;

    console.log("this is employee");
    console.log(employeeData);

    // console.log("\n\n\n\nEmail String: " + emailStr + "\n\n\n");

    try {
        const answer = await PrismaClient.employee.findUnique(
            {where:{userID:employeeData.userName}});
        console.log("Prisma Response: " + answer);
        console.log(answer);

        if(answer == null)
        {
            //create
            await PrismaClient.employee.create({
                data: {
                    userID: employeeData.userID,
                    userName: employeeData.userName,
                    firstName: employeeData.firstName,
                    lastName: employeeData.lastName,
                    designation: employeeData.designation,
                    isAdmin: employeeData.isAdmin,
                },
            });


            res.sendStatus(200);
        }

        //update
        await PrismaClient.employee.update({
            where: {
                userID: employeeData.userID
            },
            data: {
                //transfer all the info from the object into the database
                userName: employeeData.userName,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                designation: employeeData.designation,
                isAdmin: employeeData.isAdmin
            }
        });

        res.sendStatus(200);
    } catch(err) {
        console.log("could not update or add user on login");
        console.log(err);
        res.sendStatus(400);
    }
});

export default router;
