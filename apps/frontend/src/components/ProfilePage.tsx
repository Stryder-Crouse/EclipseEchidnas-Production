import React, {useEffect, useState} from "react";
import FullSideNavBarComponent from "./FullSideNavBarComponent.tsx";
import {useAuth0} from "@auth0/auth0-react";
//import PieChartStatsAll from "./StatsPie/PieChartStatsAll.tsx";
//import {ServiceRequest} from "../../../backend/src/algorithms/Requests/Request.ts";
//import PieChartStatsServiceRequest from "./service-requests/StatsPie/PieChartStatsServiceRequest.tsx";
import ServiceRequest_Table from "./service-requests/service-request/ServiceRequest_Table.tsx";

import axios from "axios";
import PieChartStatsProfile from "./service-requests/StatsPie/PieChartStatsProfile.tsx";
import {Employee} from "common/src/algorithms/Employee/Employee.ts";
import Status from "common/src/algorithms/Requests/Status.ts";
import {Priorities} from "common/src/algorithms/Requests/Request.ts";


function ProfilePage() {

    const [statsToggle, setStatsToggle]
        = useState(false);

    const [designation, setDesignation]
        = useState("");

    const [firstName, setFirstName]
        = useState("");

    const [lastName, setLastName]
        = useState("");



    const [activeButton, setActiveButton] = useState("table");

        const handleButtonClick = (button: React.SetStateAction<string>) => {
            setActiveButton(button);
        };

        //const [currentEmployee , setCurrentEmployee ] = useState("");
        const currUser = useAuth0();
        const decodedEmail = decodeURIComponent(String(currUser?.user?.email));
        const username = String(currUser?.user?.email);
        const ProfilePicture = currUser?.user?.picture;

        useEffect(() => {
            getEmployees(decodedEmail!).then((results) => {

                setFirstName(results.firstName);
                setLastName(results.lastName);
                setDesignation(results.designation);
            });
        }, [decodedEmail]);


    console.log(getEmployees);


        return (

            <div className="flex h-screen">
                <FullSideNavBarComponent/>
                {/* Left Column - User Information */}
                <div className="w-1/4 bg-gray-200 p-4">
                    <div className="flex flex-col items-center justify-center text-center">
                        <h1 className="mb-1 font-bold text-2xl mt-5">Profile Page</h1>
                        {ProfilePicture && <ImageCard img={ProfilePicture} />}

                    </div>
                    <input
                        type="checkbox"
                        checked={statsToggle}
                        className="sr-only peer"
                        onChange={(event) => {
                            setStatsToggle(event.target.checked);
                        }}
                    />

                    <div className="text-center">

                        <div className="flex flex-col mt-9">
                            <div className="flex mb-2">
                                <span className="font-bold text-xl mr-2">Username:</span>
                                <p className="text-xl">{username}</p>
                            </div>

                            <div className="flex mb-2">
                                <span className="font-bold text-xl mr-2">First Name:</span>
                                <p className="text-xl">{firstName}</p>
                            </div>

                            <div className="flex mb-2">
                                <span className="font-bold text-xl mr-2">Last Name:</span>
                                <p className="text-xl">{lastName}</p>
                            </div>

                            <div className="flex mb-2">
                                <span className="font-bold text-xl mr-2">Role:</span>
                                <p className="text-xl">{designation}</p>
                            </div>

                            <div className="flex mb-2">
                                <span className="font-bold text-xl mr-2">Pending Tasks:</span>
                                <p className="text-xl">{firstName}</p>
                            </div>

                            <div className="mt-10">
                                <button
                                    type="button"
                                    className={`inline-block rounded px-9 pb-5 pt-5 text-xl font-medium uppercase leading-normal shadow-md transition duration-150 ease-in-out 
                                    ${
                                        activeButton === "table"
                                            ? "bg-navy text-white hover:bg-navy focus:bg-navy active:bg-navy"
                                            : "bg-blue-200 text-blue-700 hover:bg-blue-100 focus:bg-blue-100 active:bg-blue-200"
                                    }`}
                                    onClick={() => handleButtonClick("table")}
                                >
                                    Table
                                </button>

                                <button
                                    type="button"
                                    className={`inline-block rounded px-9 pb-5 pt-5 text-xl font-medium uppercase leading-normal shadow-md transition duration-150 ease-in-out ${
                                        activeButton === "graph"
                                            ? `bg-navy text-white hover:bg-navy focus:bg-navy active:bg-navy`
                                            : "bg-blue-200 text-blue-700 hover:bg-blue-100 focus:bg-blue-100 active:bg-blue-200"
                                    }`}
                                    onClick={() => handleButtonClick("graph")}
                                >
                                    Graph
                                </button>


                            </div>

                        </div>


                    </div>
                </div>

                {/* Right Column - Content */}
                <div className="flex-1 p-4">

                    {/* Content to be populated with each request */}
                    {generateSelectedTable()}
                </div>
            </div>

        );


    function generateSelectedTable() {
        // For each div/request to overlay

        if (statsToggle) {
            if (username != "") {
                return ((<PieChartStatsProfile></PieChartStatsProfile>));
            }

        }


        if (username != "") {
            return (<ServiceRequest_Table employeeFilter={username!} statusFilter={Status.Any} priorityFilter={Priorities.any}  locationFilter={"Any"}/>);

        }
        {
            return (<div> bad state</div>);

        }
    }

    }

export function ImageCard({ img }: { img: string }){

    return (
        <div
            className="w-[10vw] rounded-full overflow-hidden shadow-lg drop-shadow-xl
             cursor-pointer transition-all
            hover:scale-105 mt-3">
            <img className="h-fit w-full " src={img} alt="missing"/>
        </div>

    );
}

export default ProfilePage;

async function getEmployees(emp: string) {
    const employees = await axios.get<Employee>("/api/employees/current_employee", { params: { userName: emp } });
    return employees.data;

}
