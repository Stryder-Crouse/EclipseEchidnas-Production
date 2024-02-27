import React, {useEffect} from "react";
import {useState} from "react";
import SimpleTextInput from "../inputComponents/SimpleTextInput.tsx";
import {Employee, Roles} from "common/src/algorithms/Employee/Employee.ts";

import axios from "axios";
// import {useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";

//import Employees from "../../../../backend/src/routes/employees.ts";

export default function RegisterForm() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [userExistsEmp, setUserExistsEmp] = useState<Employee|null>(null);
    //const [currEmail, setCurrEmail] = useState('');

    const currUser = useAuth0();
    const thisEmail = currUser?.user?.email;
    thisEmail!.replace('"','');

    useEffect(() => {
        doesUserExist(thisEmail!).then( (res)=>{

            if(res!=null){
                setFirstName(res.firstName);
                setLastName(res.lastName);
                setUserExistsEmp(res);
            }

        });

    }, [thisEmail]);

    async function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        console.log("HIHI");

        //thisEmail stores the email which was entered into auth0
        console.log('User found');
        //setCurrEmail(JSON.stringify(thisEmail));

        // const email =JSON.stringify(thisEmail);
        // console.log(email);
        console.log(thisEmail);

        if(userExistsEmp!=null){
            userExistsEmp.firstName = firstName;
            userExistsEmp.lastName = lastName;
            await axios.post("api/employees/updateEmployee",userExistsEmp, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

        }
        else {


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
                employee, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
        }

        window.location.href = window.location.origin;

    }

    return (
        <div>

            <form
                className={"font-project justify-content-center p-7 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl"}
            >
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


async function doesUserExist(email: string) {
    const doesEmpExist = await axios.get<Employee|null>(
        "/api/employees/current_employee/doesExist"
        ,{params:{email:email}});
    return doesEmpExist.data;
}
