import AdminMapPage from "../../routes/admin-routes/AdminMapPage.tsx";
import {withAuthenticationRequired} from "@auth0/auth0-react";

const ProtectedAdminMap = withAuthenticationRequired(AdminMapPage);

export default ProtectedAdminMap;
