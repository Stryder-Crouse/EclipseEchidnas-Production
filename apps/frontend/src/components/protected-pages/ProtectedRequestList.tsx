import RequestList from "../../routes/admin-routes/RequestList.tsx";
import {withAuthenticationRequired} from "@auth0/auth0-react";

const ProtectedRequestList = withAuthenticationRequired(RequestList);

export default ProtectedRequestList;
