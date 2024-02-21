import React from "react";
import {useState} from "react";
import SimpleTextInput from "../inputComponents/SimpleTextInput.tsx";
import {Employee, Roles} from "../../../../backend/src/algorithms/Employee/Employee.ts";

import axios from "axios";
// import {useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";
//import Employees from "../../../../backend/src/routes/employees.ts";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [currEmail, setCurrEmail] = useState('');

    const currUser = useAuth0();
    const thisEmail = currUser?.user?.email;


    // useEffect(() => {
    //     // if (thisEmail) {
    //     //     let inDB: boolean = false;
    //     //     console.log('User found');
    //     //     setCurrEmail(JSON.stringify(thisEmail));
    //     //     axios.get("api/employees/determineIfUniqueEmail").then((result) => {
    //     //         console.log("Result: " + result.data);
    //     //         inDB = result.data;
    //     //     });
    //     //     console.log(inDB);  //remove when login actually implemented
    //         // if(inDB)
    //         // {
    //         //     const employee: Employee = {
    //         //         userID: thisEmail,
    //         //         userName: username,
    //         //         firstName: firstName,
    //         //         lastName: lastName,
    //         //         designation: Roles.None,
    //         //         isAdmin: false,
    //         //     };
    //         //     axios.post("/api/employees/updateEmployee", employee, {
    //         //         headers: {
    //         //             "Content-Type": "application/json",
    //         //         }
    //         //     }).then( (param) => {
    //         //         if(param.status == 200)
    //         //         {
    //         //             console.log("There was an error updating employee! WEEE WOOOOO WEEEEE WOOOO");
    //         //         }
    //         //     });
    //         //     window.location.href="http://localhost:3000/RequestList";
    //         // }
    //     } else console.log('Could not find user');
    // }, [thisEmail]);

    function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();


        let inDB: boolean = false;

        //check to see if the email is currently in the db
        if(thisEmail) {
            //thisEmail stores the email which was entered into auth0
            console.log('User found');
            setCurrEmail(JSON.stringify(thisEmail));
            // console.log("Curr: " + currEmail);
            // console.log("this: " + thisEmail);
            axios.get("api/employees/determineIfUniqueEmail", {params: {email: thisEmail}}).then((result) => {
                // console.log("Result: " + result.data);
                inDB = result.data;
                // console.log("\n\n\n\nResult: " + result.data);
                if(inDB)
                {
                    // console.log("\n\n\n\nHERE 3\n\n\n\n");


                    //create a new employee with the updated info
                    const employee: Employee = {
                            userID: thisEmail,
                            userName: username,
                            firstName: firstName,
                            lastName: lastName,
                            designation: Roles.None,
                            isAdmin: false,
                    };


                    // console.log("thisEmail: " + thisEmail);
                    // console.log("currEmail: + " + currEmail);

                    //send the new employee data to the database and update the employee
                    axios.post("/api/employees/updateEmployee", employee, {
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }).then((param) => {
                        //if there is a problem with registering the employee's info, error out here
                        if (param.status == 400) {
                            console.log("There was an error updating employee! WEEE WOOOOO WEEEEE WOOOO");
                        }
                    });
                }
                else {
                    //create the new employee
                    const employee: Employee = {
                        userID: thisEmail,
                        userName: username,
                        firstName: firstName,
                        lastName: lastName,
                        designation: Roles.None,
                        isAdmin: false,
                    };


                    console.log("(To avoid error) currEmail: " + currEmail);

                    //backend functionality for new employees
                    //this will map to our backend and register a new account with Auth0
                    axios.post("/api/employees/employee", employee, {
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }).then((response) => {
                        //if there is an issue with posting, log it here
                        if (response.status == 400) {
                            console.log("There was an error with saving the employee again");
                        }
                    });
                }
                window.location.href = window.location.origin;
            });
        }
    }

    return (
        <div>

            <form
                className={"font-project justify-content-center p-7 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl"}
            >
                {/*
                <div className={"flex justify-center w-full"}>
                    <img
                        className={"w-14"}
                        src={Logo}
                        alt={"A logo of the hospital"}
                    />
                </div>*/}

                <div className={"flex justify-center w-full"}>
                    <h1 className={"font-bold text-xl text-navStart"}>
                        New Employee Registration
                    </h1>
                </div>

                <div>
                    <SimpleTextInput id={"firstName"} labelContent={"First Name: "} inputStorage={firstName}
                                     setInputStorage={setFirstName}
                                     inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                     divCSS={"grid justify-center items-center my-1.5"} labelCSS={"mb-1"}
                                     placeHolderText={"First Name: "}>
                    </SimpleTextInput>
                </div>

                <div>
                    <SimpleTextInput id={"lastName"} labelContent={"Last Name: "} inputStorage={lastName}
                                     setInputStorage={setLastName}
                                     inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                     divCSS={"grid justify-center items-center my-1.5"} labelCSS={"mb-1"}
                                     placeHolderText={"Last Name: "}>
                    </SimpleTextInput>
                </div>

                <div>
                    <SimpleTextInput id={"userName"} labelContent={"Username: "} inputStorage={username}
                                     setInputStorage={setUsername}
                                     inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                     divCSS={"grid justify-center items-center my-1.5"} labelCSS={"mb-1"}
                                     placeHolderText={"Username: "}>
                    </SimpleTextInput>
                </div>

                <div className={"flex justify-center w-full mt-5"}>
                    <button
                        className={"p-2 w-40 text-white bg-navStart hover:bg-navy rounded-3xl border border-black drop-shadow"}
                        onClick={handleSubmit}
                    >
                        Register
                    </button>
                </div>

            </form>

        </div>
    );
}
