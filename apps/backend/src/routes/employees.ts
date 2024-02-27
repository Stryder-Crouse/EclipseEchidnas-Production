import express, {Request, Response, Router} from "express";
import PrismaClient from "../bin/database-connection.ts";
import {Employee} from "../../../../packages/common/src/algorithms/Employee/Employee.ts";
import fs from "fs";
import {readEmployeeCSV} from "../algorithms/readCSV.ts";
import multer from "multer";

const router: Router = express.Router();
const upload = multer({dest: 'uploadedCSVs/'});

/**
 * import the oh my goodnesses into the badness
 * @param req it's got the csv
 * @param res send this
 *
 */
async function handleCSVImport(req: Request, res: Response): Promise<void> {
    /* What the FUCK */
    console.log("handleCSVImport: Employee CSV import requested");

    /* Deadass */
    const employeeFile: Express.Multer.File[] = req.files as Express.Multer.File[];
    if (employeeFile == null) {
        console.error("handleCSVImport: employee file was FUCKED");
        res.status(500).send("FUCK");
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
            PrismaClient.edgeDB.deleteMany(),
            PrismaClient.medReq.deleteMany(),
            PrismaClient.sanReq.deleteMany(),
            PrismaClient.religiousReq.deleteMany(),
            PrismaClient.outsideTransport.deleteMany(),
            PrismaClient.flowReq.deleteMany(),
            PrismaClient.serviceRequest.deleteMany(),
            PrismaClient.nodeDB.deleteMany(),
            PrismaClient.employee.deleteMany()
        ]);

        /* shove it into a clean prisma */
        await PrismaClient.employee.createMany({data: employeeArray});
    }

        /* yikes case */ catch (error) {
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
                orderBy: {
                    firstName: "asc"
                }
            }
        )); //end res.send (this is what will be sent to the client)
        console.info("Successfully gave you the the employees");
    } catch (err) {
        console.error("Unable to send employees" + err);
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
        console.info("Successfully gave you the the employees");
    } catch (err) {
        console.error("Unable to send employees" + err);
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
        console.info("Successfully gave you the the employees");
    } catch (err) {
        console.error("Unable to send employees" + err);
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
        console.info("Successfully gave you the the employees");
    } catch (err) {
        console.error("Unable to send employees" + err);
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
        console.info("Successfully gave you the the employees");
    } catch (err) {
        console.error("Unable to send employees" + err);
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
        //try to send all the employees to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.send(await PrismaClient.employee.findUnique(
            {
                where: {userName: currentUser.userName}
            }
        )); //end res.send (this is what will be sent to the client)
        console.info("Successfully gave you the employee");
    } catch (err) {
        console.error("Unable to send employees");
    }
});

export async function religEmployees(religion: string) {
    console.log("abstract employees/rel");
    try {
        console.log("religion is " + religion);
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
        console.info("Successfully gave you the the employees");
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
        console.error("Unable to send employees" + err);
    }
}

//gets the employee with the username of the Auth0 login
router.get("/current_employee", async function (req: Request, res: Response) {
    const currentUser: Employee = req.body;
    try {
        //try to send all the employees to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.status(200).send(await PrismaClient.employee.findUnique(
            {
                where: {userName: currentUser.userName}
            }
        )); //end res.send (this is what will be sent to the client)
        console.info("Successfully gave you the employee");
    } catch (err) {
        console.error("Unable to send employees" + err);
        res.sendStatus(500);
    }
});

router.post("/onLogin", async function (req: Request, res: Response) {
    //param is specified in frontend to have an attribute of "email", which is what req.query is referencing
    const employeeData: Employee = req.body as Employee;

    console.log("this is employee");
    console.log(employeeData);

    // console.log("Email String: " + emailStr);

    try {
        const answer = await PrismaClient.employee.findUnique(
            {where: {userID: employeeData.userName}});
        console.log("Prisma Response: " + answer);
        console.log(answer);

        if (answer == null) {
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
    } catch (err) {
        console.log("could not update or add user on login");
        console.log(err);
        res.sendStatus(400);
    }
});

export default router;
