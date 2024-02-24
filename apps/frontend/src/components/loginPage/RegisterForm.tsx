import React from "react";
import {useState} from "react";
import SimpleTextInput from "../inputComponents/SimpleTextInput.tsx";
import {Employee, Roles} from "../../../../../packages/common/src/algorithms/Employee/Employee.ts";

import axios from "axios";
// import {useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";
//import Employees from "../../../../backend/src/routes/employees.ts";

export default function RegisterForm() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    //const [currEmail, setCurrEmail] = useState('');

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

    async function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        console.log("HIHI");

        //thisEmail stores the email which was entered into auth0
        console.log('User found');
        //setCurrEmail(JSON.stringify(thisEmail));

        // const email =JSON.stringify(thisEmail);
        // console.log(email);
        thisEmail!.replace('"','');
        console.log(thisEmail);


        const employee: Employee = {

            userID: currUser.user!.sub!,
            userName: thisEmail!,
            firstName: firstName,
            lastName: lastName,
            designation: Roles.None,
            isAdmin: false,
        };

        console.log("new user");
        console.log(employee);
        // console.log("Curr: " + currEmail);
        // console.log("this: " + thisEmail);
        await axios.post("api/employees/onLogin",
            employee,{
                headers: {
                    "Content-Type": "application/json",
                },
            });

        window.location.href = "/AdminMapPage";

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



                <div className={"flex justify-center w-full mt-5"}>
                    <button
                        className={"p-2 w-40 text-white bg-navStart hover:bg-navy rounded-3xl border border-black drop-shadow"}
                        onClick={
                            handleSubmit}
                    >
                        Register
                    </button>
                </div>

            </form>

        </div>
    );
}
