//import {useNavigate} from "react-router-dom";
import React from "react";
import {useState} from "react";
import "../../css/route-css/LoginPage.css";
import Logo from "../../images/Brigham_and_Womens_Hospital_logo.svg.png";
import {Auth0Error} from "auth0-js";
import {webAuth} from "../../../auth0.service.ts";
//import IncorrectAlert from "./IncorrectAlert.tsx";
import EmailAlert from "./EmailAlert.tsx";
import PasswordAlert from "./PasswordAlert.tsx";

function LoginForm() {
    //Create email and password variables to store inputs
    const [email, setEmail] = useState(""); //Variable for email
    const [password, setPassword] = useState(""); //Variable for Password
    const [showPassword, setShowPassword] = useState(false); //Boolean for if password is shown or not
    const [incorrect, setIncorrect] = useState(false);

    //const navigate = useNavigate();

    /**
     * Assigns input to the email variable, and if empty displays alert
     * @param email Value entered into the email textbox
     */
    function handleEmail(email: string) {
        setEmail(email);
        if (email === "") {
            return <EmailAlert/>;
        }
    }

    /**
     * Assigns input to the password variable, and if empty displays alert
     * @param password Value entered into the password textbox
     */
    function handlePassword(password: string) {
        setPassword(password);
        if (password === "") {
            return <PasswordAlert/>;
        }
    }

    /**
     * When submit button pushed, determines if values entered are valid login credentials
     * If so, navigates to the map page
     * If not, returns with telling the error message to show
     */
    function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        webAuth.login({
            email: email,
            password: password,
            realm: 'Username-Password-Authentication',
            redirectUri: 'http://localhost:3000/AdminMapPage',
            responseType: 'token'
        }, function (error: Auth0Error | null, result) {
            if (error) {
                setIncorrect(true);
            }
            console.log(result);
        });
    }

    return (
        <div>

            <form
                className={"font-project justify-content-center p-7 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl"}>

                <div className={"flex justify-center w-full"}>
                    <img
                        className={"w-14"}
                        src={Logo}
                        alt={"A logo of the hospital"}
                    />
                </div>


                {incorrect ? ( //If the entered username or password are incorrect, shows error message
                    <div className={"flex justify-center w-full mt-1.5"}>
                        <div
                            className={"w-48 my-1.5 p-1 text-black text-xs bg-red-200 rounded-lg border border-black drop-shadow"}
                        >
                            Incorrect Username or Password
                        </div>
                    </div>
                ) : null}

                <div className={"grid justify-center items-center my-1.5"}>
                    <label
                        className={"mb-1"}
                        htmlFor={"email"}>
                        Email:
                    </label>
                    <input //Textbox to enter Password
                        className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                        id="email"
                        value={email}
                        placeholder={"Email: "}
                        onChange={(e) => handleEmail(e.target.value)}
                    />
                </div>

                <div className={"grid justify-center items-center my-1.5"}>
                    <label
                        className={"mb-1"}
                        htmlFor={"password"}>
                        Password:
                    </label>
                    <input //Textbox to enter Password
                        className={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        placeholder={"Password: "}
                        onChange={(e) => handlePassword(e.target.value)}
                    />
                </div>

                {/*Button to toggle visbility of password on/off (defaults to off)*/}
                <div className={"flex justify-center w-full my-1.5"}>
                    <div className={"p-2 w-40 bg-navy hover:bg-navStart rounded-3xl border border-black drop-shadow"}>
                        <input
                            className={"accent-navy"}
                            id={"showPass"}
                            type={"checkbox"}
                            onChange={() => setShowPassword((prev) => !prev)}
                        />
                        <label
                            className={"text-white p-1"}
                            htmlFor={"showPass"}
                        >
                            Show Password
                        </label>
                    </div>
                </div>

                <div className={"flex justify-center w-full my-1.5"}>
                    <button
                        className={"p-2 w-40 text-white bg-navStart hover:bg-navy rounded-3xl border border-black drop-shadow"}
                        onClick={handleSubmit}
                    >
                        Login
                    </button>
                </div>

            </form>

        </div>
    );
}

export default LoginForm;
