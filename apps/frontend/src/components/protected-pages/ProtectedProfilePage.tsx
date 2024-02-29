import ProfilePage from "../ProfilePage.tsx";
import {withAuthenticationRequired} from "@auth0/auth0-react";

const ProtectedProfilePage = withAuthenticationRequired(ProfilePage);

export default ProtectedProfilePage;
