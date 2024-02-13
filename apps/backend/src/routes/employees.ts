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
                userName: employeeData.userName,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                designation: employeeData.designation,
                isAdmin: employeeData.isAdmin,
            },
        });
        console.info("Successfully saved employee"); // Log that it was successful
    } catch(error){
    // Log any failures
    console.error(`Unable to save employee`);
    res.sendStatus(400); // Send error
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

//gets all employees with medicalRequest permissions
router.get("/employees/med", async function (req: Request, res: Response) {
    try {

        res.send(await PrismaClient.employee.findMany(
            {
                where:{
                    OR:[
                        {
                        designation:"doctor"
                        },
                        {
                            designation:"nurse"
                        },
                        {
                            designation:"administrator"
                        },
                        {
                            userName:"No one"
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

//gets all employees with medicalRequest permissions
router.get("/employees/flow", async function (req: Request, res: Response) {
    try {

        res.send(await PrismaClient.employee.findMany(
            {
                where:{
                    OR:[
                        {
                            designation:"flower deliverer"
                        },
                        {
                            userName:"No one"
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
    const currentUser : Employee = req.body;
    try {
        //try to send all the employees to the client
        //order the nodes by their longName (alphabetical ordering) (1 -> a -> ' ' is the order of Prisma's alphabet)
        res.send(await PrismaClient.employee.findUnique(
            {
                where:{ userName: currentUser.userName}
            }
        )); //end res.send (this is what will be sent to the client)
        console.info("\nSuccessfully gave you the employee\n");
    } catch (err) {
        console.error("\nUnable to send employees\n");
    }
});
export default router;
