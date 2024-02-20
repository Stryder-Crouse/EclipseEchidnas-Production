import SideNavBarComponent, {SideBarItem} from "../components/SideNavBarComponent.tsx";
import MedicineRequestCard from "../components/service-request-cards/MedicineRequestCard.tsx";
import FlowerRequestCard from "../components/service-request-cards/FlowerRequestCard.tsx";
import ReligionRequestCard from "../components/service-request-cards/ReligionRequestCard.tsx";
import TransportationRequestCard from "../components/service-request-cards/TransportationRequestCard.tsx";
import SanitationRequestCard from "../components/service-request-cards/SanitationRequestCard.tsx";
import RequestListCard from "../components/service-request-cards/RequestListCard.tsx";
import MapIcon from "../images/SideBar/map.png";
import ServiceRequestIcon from "../images/SideBar/requestIcon.png";
import EmployeeIcon from "../images/SideBar/user.png";
import CSVIcon from "../images/SideBar/table.png";
import LogIcon from "../images/SideBar/log-in.png";

function ServiceRequestPage() {



    return (
        <div className="flex">
            <div className="z-10">
                <SideNavBarComponent>
                    <SideBarItem icon={MapIcon} text="Map" link="/TailwindMapPage"/>
                    <SideBarItem icon={ServiceRequestIcon} text="Services" link="ServiceRequest"/>
                    <SideBarItem icon={EmployeeIcon} text="Employees" link="/EmployeeTable"/>
                    <SideBarItem icon={CSVIcon} text=".CSV" link="/NodeEdgeTable"/>
                    <hr className="my-3"/>
                    {/*NEED THIS FIXED OR SUM */}
                    <SideBarItem icon={LogIcon} text="Login" link={"/ServiceRequest"}/>
                </SideNavBarComponent>
            </div>
            <div className={"grid justify-center m-auto"}>
                <div className={"relative flex  justify-center "}>
                    <FlowerRequestCard/>
                    <ReligionRequestCard/>
                    <MedicineRequestCard/>

                </div>
                <div className={"relative flex  justify-center mt-12"}>
                    <TransportationRequestCard/>
                    <SanitationRequestCard/>
                    <RequestListCard/>
                </div>
            </div>

        </div>
    );
}

export default ServiceRequestPage;
