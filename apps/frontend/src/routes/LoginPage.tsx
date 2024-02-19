/** importations **/
import LoginForm from "../components/loginPage/LoginForm.tsx";

/**
 * Create login page for staff/admin
 */
export default function WelcomePage() {

    return (
        <div className={"flex items-center justify-center bg-navy min-h-screen min-w-screen"}>
            <LoginForm/>
        </div>
    );
}
