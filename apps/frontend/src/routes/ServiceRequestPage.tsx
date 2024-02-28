/** importations **/
import React from "react";
import MedicineRequestCard from "../components/service-request-cards/MedicineRequestCard.tsx";
import FlowerRequestCard from "../components/service-request-cards/FlowerRequestCard.tsx";
import ReligionRequestCard from "../components/service-request-cards/ReligionRequestCard.tsx";
import TransportationRequestCard from "../components/service-request-cards/TransportationRequestCard.tsx";
import SanitationRequestCard from "../components/service-request-cards/SanitationRequestCard.tsx";
import RequestListCard from "../components/service-request-cards/RequestListCard.tsx";
import FullSideNavBarComponent from "../components/FullSideNavBarComponent.tsx";
import { useAuth0 } from "@auth0/auth0-react";

function ServiceRequestPage() {
    const { isAuthenticated } = useAuth0();

    return (
        <div className="flex">
            <FullSideNavBarComponent />
            <div className={"grid justify-center m-auto"}>
                <div className={"relative flex  justify-center "}>
                    {isAuthenticated && <FlowerRequestCard/>}
                    {isAuthenticated && <ReligionRequestCard/>}

                    {isAuthenticated && <MedicineRequestCard />}
                </div>
                <div className={"relative flex  justify-center mt-12"}>
                    {isAuthenticated && <TransportationRequestCard/>}
                    {isAuthenticated && <SanitationRequestCard/>}
                    {/* Conditionally render RequestListCard based on authentication status */}
                    {isAuthenticated && <RequestListCard />}
                </div>
            </div>
        </div>
    );
}

export default ServiceRequestPage;
