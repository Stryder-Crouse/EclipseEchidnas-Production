import React, {useState} from "react";
import FullSideNavBarComponent from "./FullSideNavBarComponent.tsx";
import ProfileIcon from "../images/Profile_icon.jpg";
import {imageProps} from "./AboutPage.tsx";
import {useAuth0} from "@auth0/auth0-react";
//import {ServiceRequest} from "../../../backend/src/algorithms/Requests/Request.ts";
import PieChartStatsServiceRequest from "./service-requests/StatsPie/PieChartStatsServiceRequest.tsx";
import ServiceRequest_Table from "./service-requests/service-request/ServiceRequest_Table.tsx";
import Status from "../../../backend/src/algorithms/Requests/Status.ts";
import {Priorities} from "../../../backend/src/algorithms/Requests/Request.ts";


function ProfilePage() {

    const [statsToggle, setStatsToggle]
        = useState(false);
    const [currentEmployee , setCurrentEmployee ] = useState("");
    const currUser = useAuth0();
    const thisUsername = currUser?.user?.preferred_username;
    const thisFirstname = currUser?.user?.name;
    const CurrEmployee = JSON.stringify(thisUsername);
    const EmpName = JSON.stringify(thisFirstname);

    console.log(setCurrentEmployee);
    console.log(CurrEmployee);
    //console.log(getEmployees);

    return (
        <div className={"flex h-lvh flex-row"}>
            <div className="flex">
                <FullSideNavBarComponent/>
            </div>
            <div className="mt-5 flex flex-col m-auto">
                <p className="mb-1 m-auto flex font-bold justify-center p-3 bg-white rounded-lg w-72 shadow dark:bg-gray-800">Profile
                    Page</p>

                <div className="flex justify-center  flex-row scale-95">
                    <div className="flex justify-center gap-4">
                        <ImageCard img={ProfileIcon} name={EmpName} role={"Role "}>
                        </ImageCard>
                        <label className="flex items-center cursor-pointer ml-2">
                            <input type="checkbox"
                                   checked={statsToggle}
                                   className="sr-only peer"
                                   onChange={(event) => {
                                       setStatsToggle(event.target.checked);
                                   }}
                            />
                            <div
                                className=" relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
                            dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                            peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border
                            after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-1"><b>Stats</b></span>
                        </label>

                    </div>
                </div>
                {/* the content to be populated with each request*/}
                {
                    generateSelectedTable()
                }
            </div>

        </div>
    );


    function generateSelectedTable() {
        // For each div/request to overlay

        if (statsToggle) {
            if (currentEmployee != "") {
                return (<PieChartStatsServiceRequest
                    urlToGetStats={"/api/serviceRequests/flowReq/statistics"}>
                </PieChartStatsServiceRequest>);
            }
            {
                return (<div> bad state</div>);
            }

        }


        if (currentEmployee != "") {
            return (<ServiceRequest_Table employeeFilter={CurrEmployee} statusFilter={Status.Any} priorityFilter={Priorities.any}  locationFilter={"Any"}/>);

        }
        {
            return (<div> bad state</div>);

        }
    }

    }

export function ImageCard({img, name, role}: imageProps) {

    return (
        <div
            className="w-[10vw] rounded overflow-hidden shadow-lg text-black bg-ivoryWhite text-center drop-shadow-xl
            hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all
            hover:scale-105">
            <img className="h-fit w-full " src={img} alt="Stryder"/>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-center">{name}</div>
                <p className=" font-bold text-gray-700 text-base text-center">
                    {role}
                </p>
            </div>
        </div>

    );
}

export default ProfilePage;
