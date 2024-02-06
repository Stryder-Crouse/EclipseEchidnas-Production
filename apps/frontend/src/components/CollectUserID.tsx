import { useAuth0 } from "@auth0/auth0-react";

async function CollectUserName() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const userName = user!.user_id;
    if (isLoading) {
        return null;
    }

    if (isAuthenticated && user != null) {
        return (userName); //remove upon post implementation
        //todo BNBN post const userName to employee database
    }
}

export default CollectUserName;

