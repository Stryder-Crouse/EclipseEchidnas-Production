import express, {Router, Request, Response} from "express";
import PrismaClient from "../bin/database-connection.ts";
import {Employee} from "../algorithms/Employee/Employee.ts";

const router: Router = express.Router();


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
        console.info("Successfully saved employee"); // Log that it was successful
    } catch (error) {
        // Log any failures
        console.error(`Unable to save employee`);
        res.sendStatus(400); // Send error
    }
});

//function to update an employee's info (pass in an Employee object)
router.post("/updateEmployee", async function (req: Request, res: Response) {
    //get the new employee info (new info is stored in an employee object)
    const data: Employee = req.body;
    //debug info
    console.log("Updated Info");
    console.log(data);

    //query the database to update the desired employee
    try {
        await PrismaClient.employee.update({
            where: {
                userID: data.userID
            },
            data: {
                //transfer all the info from the object into the database
                userName: data.userName,
                firstName: data.firstName,
                lastName: data.lastName,
                designation: data.designation,
                isAdmin: data.isAdmin
            }
        });
        //debug info to let us know that the employee was successfully updated
        console.log("Employee successfully updated");
        res.sendStatus(200);
    } catch {
        //debug info to let us know that we failed to update the employee
        console.log("Error with Updating an Employee (Check to see if the employee exists)");
        res.sendStatus(400);
    }
});

//function to delete employee (fire them) --- Pass a string (employee's username) to function
router.post("/deleteEmployee", async function (req: Request, res: Response) {
    console.log("req.body");
    console.log(req.body);
    try {
        //get the user which the admin wants to fire
        const data: string[] = req.body;

        //query the database to delete the employee
        await PrismaClient.employee.delete({
            where: {
                userName: data[0]          //employee's username is unique, so we must delete an employee by their username
            }
        });
        //debug info to know that we successfully deleted the employee
        console.log("Employee Successfully Fired!");
        res.sendStatus(200);
    } catch {
        //debug info to know that we failed to delete the employee
        console.log("Error with Firing the Employee (Check to see if the employee exists)");
        res.sendStatus(400);
    }
});


//gets all employees from the database in the form of employee objects
router.get("/employees", async function (req: Request, res: Response) {
    try {
        //try to send all the employees to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.send(await PrismaClient.employee.findMany()); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you the the employees\n");
    } catch (err) {
        console.error("\nUnable to send employees\n");
    }
});

//gets all employees with medicineRequest permissions
router.get("/employees/med", async function (req: Request, res: Response) {
    try {

        res.send(await PrismaClient.employee.findMany(
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
        console.error("\nUnable to send employees\n");
    }
});

//gets all employees with sanitationRequest permissions
router.get("/employees/san", async function (req: Request, res: Response) {
    try {

        res.send(await PrismaClient.employee.findMany(
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
        console.error("\nUnable to send employees\n");
    }
});

//gets all employees with outsideTransport permissions
router.get("/employees/transport", async function (req: Request, res: Response) {
    try {

        res.send(await PrismaClient.employee.findMany(
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
        console.error("\nUnable to send employees\n");
    }
});

//gets all employees with flowerRequest permissions
router.get("/employees/flow", async function (req: Request, res: Response) {
    try {

        res.send(await PrismaClient.employee.findMany(
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
        console.error("\nUnable to send employees\n");
    }
});

//gets all employees with religiousRequest permissions
router.get("/employees/rel", async function (req: Request, res: Response) {
    try {
        const religion: string = req.body;
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

        res.send(await PrismaClient.employee.findMany(
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
        )); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you the the employees\n");
    } catch (err) {
        console.error("\nUnable to send employees\n");
    }
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
        console.info("\nSuccessfully gave you the employee\n");
    } catch (err) {
        console.error("\nUnable to send employees\n");
    }
});


router.get("/determineIfUniqueEmail", async function (req: Request, res: Response)  {
    const emailStr: string = req.query.string as string;
    try {
        if(PrismaClient.employee.findUnique( {
            where : {
                userID: emailStr
            }
        }) == null)
        {
            res.send(false);
        }
        res.send(true);
    } catch {
        console.log("Did not work");
        res.sendStatus(400);
    }
});
export default router;
