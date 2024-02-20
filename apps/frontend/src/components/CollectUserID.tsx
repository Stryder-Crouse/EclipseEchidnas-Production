import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

async function CollectUserName() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const userName = user!.user_id;
    if (isLoading) {
        return null;
    }

    if (isAuthenticated && user != null) {
        try {
            await axios.post("/api/employees/employee", {
                    userID: userName,
                    userName: "This should be a display name:"+userName,
                    firstName: "First",
                    lastName: "Last",
                    designation: "None",
                    isAdmin: false,
                },
                {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (err) {
            throw new Error("Error with loading Nodes");
        }

//        return (userName); //remove upon post implementation
//        //todo BNBN post const userName to employee database :)
    }
}

export default CollectUserName;

