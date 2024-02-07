import EmployeeTable from "../../routes/admin-routes/EmployeeTable.tsx";
import {withAuthenticationRequired} from "@auth0/auth0-react";

const ProtectedEmployeeTable = withAuthenticationRequired(EmployeeTable);

export default ProtectedEmployeeTable;
