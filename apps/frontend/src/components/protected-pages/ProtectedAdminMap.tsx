//import AdminMapPage from "../../routes/admin-routes/AdminMapPage.tsx";
import {withAuthenticationRequired} from "@auth0/auth0-react";
import TailwindMapPage from "../../routes/TailwindMapPage.tsx";

const ProtectedAdminMap = withAuthenticationRequired(TailwindMapPage);

export default ProtectedAdminMap;
