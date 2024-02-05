import NodeEdgeTablePage from "../../routes/admin-routes/NodeEdgeTablePage.tsx";
import {withAuthenticationRequired} from "@auth0/auth0-react";

const ProtectedNodeEdgeTable = withAuthenticationRequired(NodeEdgeTablePage);

export default ProtectedNodeEdgeTable;
