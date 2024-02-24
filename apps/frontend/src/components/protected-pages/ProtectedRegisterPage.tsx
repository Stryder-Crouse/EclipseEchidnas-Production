import RegisterPage from "../../routes/RegisterPage.tsx";
import {withAuthenticationRequired} from "@auth0/auth0-react";

const ProtectedNodeEdgeTable = withAuthenticationRequired(RegisterPage);

export default ProtectedNodeEdgeTable;
