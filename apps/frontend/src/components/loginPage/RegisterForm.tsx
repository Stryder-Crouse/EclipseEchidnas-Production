import React from "react";
import {useState} from "react";
import SimpleTextInput from "../inputComponents/SimpleTextInput.tsx";
import {Employee, Roles} from "../../../../backend/src/algorithms/Employee/Employee.ts";
import Logo from "../../images/Brigham_and_Womens_Hospital_logo.svg.png";

import axios from "axios";
import {useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [currEmail, setCurrEmail] = useState('');

    const currUser = useAuth0();
    const thisEmail = currUser?.user?.email;


    useEffect(() => {
        if (thisEmail) {
            console.log('User found');
            setCurrEmail(JSON.stringify(thisEmail));
            //todo BNBN inside this if statement should be where the function goes to check if the employee is in the database (use accessToken)
            {/*if(){
            window.location.href="http://localhost:3000/RequestList";
        }*/
            }
        } else console.log('Could not find user');
    }, [thisEmail]);

    function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        const employee: Employee = {
            userID: currEmail,
            userName: username,
            firstName: firstName,
            lastName: lastName,
            designation: Roles.None,
            isAdmin: false,
        };

        //backend functionality for new employees
        //this will map to our backend and register a new account with Auth0
        axios.post("/api/employees/employee", employee, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then();

        //window.location.href = "http://localhost:3000/RequestList";
    }

    return (
        <div>

            <form
                className={"font-project justify-content-center p-7 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl"}
            >

                <div className={"flex justify-center w-full"}>
                    <img
                        className={"w-14"}
                        src={Logo}
                        alt={"A logo of the hospital"}
                    />
                </div>

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
