import RegisterForm from "../components/loginPage/RegisterForm.tsx";
import "../css/route-css/welcomePage.css";
import Logo from "../images/massGeneralBrighamLogo.png";
import "../css/component-css/buttons/guest-button.css";



export default function RegisterPage() {
    return (

            <div className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat bg-center"
                 style={{backgroundImage: `url("/src/images/backgroundHospitalImage.jpg")`}}>
            <div className={"welcomeLogin"}>

                {/*<h1 className={"welcomeTo"}>Welcome to</h1>*/}
                <img src={Logo} alt="Logo" className={"mgbLogo"}/>
                <div className="flex items-center justify-center h-full mt-9">
                    <RegisterForm/>
                </div>
            </div>
        </div>


    );
}
