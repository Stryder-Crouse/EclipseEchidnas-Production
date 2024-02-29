import RegisterForm from "../components/loginPage/RegisterForm.tsx";
import Logo from "../images/massGeneralBrighamLogo.png";

export default function RegisterPage() {
    return (

        <div className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat bg-center"
             style={{backgroundImage: `url("/src/images/backgroundHospitalImage.jpg")`}}>
            <div
                className="max-w-md w-full bg-white p-8 rounded-xl shadow-md flex flex-col items-center justify-center h-full">
                <img src={Logo} alt="Logo" className="mt-15 mb-20"/>
                <div className="mt-9 mb-20">
                    <RegisterForm/>
                </div>
            </div>
        </div>


    );
}
