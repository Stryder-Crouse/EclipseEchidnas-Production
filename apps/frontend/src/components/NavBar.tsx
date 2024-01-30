
import React, { useEffect } from "react";
import "../css/welcomePage.css";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
    /** NAVIGATION **/
    const navigate = useNavigate();

    useEffect(() => {
        //set background to first floor on component load
        document.body.style.backgroundImage =
            "url(/src/images/backgroundHospitalImage.jpg)";
    }, []);

    return (
        <div className={"welcomeLogin"}>
            {/* Div Container for the Login surrounded by white space */}
            <h1 className={"welcomeTo"}></h1>


            {/* Button Container */}
            <div className={"Navbar"}>
                <button
                    className={"Staff Login"}
                    onClick={() => navigate("/routes/LoginPage")}
                >
                    Staff Login
                </button>
                <button
                    className={"Service Request"}
                    onClick={() => navigate("/ImportEdgeFile")}
                >
                    Service Request
                </button>
            </div>
        </div>
    );
}
