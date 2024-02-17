import {useNavigate} from "react-router-dom";
import React from "react";
import {useState} from "react";
//import UsernameAlert from "./UsernameAlert.tsx";
import PasswordAlert from "./PasswordAlert.tsx";
import "../../css/route-css/LoginPage.css";
import Logo from "../../images/Brigham_and_Womens_Hospital_logo.svg.png";
import SimpleTextInput from "../inputComponents/SimpleTextInput.tsx";

function LoginForm() {
    //Create username and password variables to store inputs
    const [username, setUsername] = useState(""); //Variable for Username
    const [password, setPassword] = useState(""); //Variable for Password
    const [showPassword, setShowPassword] = useState(false); //Boolean for if password is shown or not
    const navigate = useNavigate();

    /**
     * Assigns input to the password variable, and if empty displays alert (alert currently not working, alternative implemented but hope to use in future)
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
        if (username === "admin" && password === "admin") {
            navigate("/AdminMapPage");
            //to get map to load properly on adminMapPage
            window.location.reload();
        }
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

                <div>
                    <SimpleTextInput id={"userName"} labelContent={"Username: "} inputStorage={username}
                                     setInputStorage={setUsername}
                                     inputCSS={"p-1 w-60 bg-white text-black rounded-xl border border-black drop-shadow"}
                                     divCSS={"grid justify-center items-center my-1.5"} labelCSS={"mb-1"}
                                     placeHolderText={"Username: "}>
                    </SimpleTextInput>
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
