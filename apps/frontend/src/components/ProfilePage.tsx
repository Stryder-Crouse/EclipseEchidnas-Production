import React, {useEffect, useState} from "react";
import FullSideNavBarComponent from "./FullSideNavBarComponent.tsx";
import {useAuth0} from "@auth0/auth0-react";
//import PieChartStatsAll from "./Stats/PieChartStatsAll.tsx";
//import {ServiceRequest} from "../../../backend/src/algorithms/Requests/Request.ts";
//import PieChartStatsServiceRequest from "./service-requests/Stats/PieChartStatsServiceRequest.tsx";
import ServiceRequest_Table from "./service-requests/service-request/ServiceRequest_Table.tsx";

import axios from "axios";
import PieChartStatsProfile from "./service-requests/Stats/PieChartStatsProfile.tsx";
import {Employee} from "common/src/algorithms/Employee/Employee.ts";
import Status from "common/src/algorithms/Requests/Status.ts";
import {Priorities, ServiceRequest} from "common/src/algorithms/Requests/Request.ts";


function ProfilePage() {

    // const [statsToggle, setStatsToggle]
    //     = useState(false);

    const [designation, setDesignation]
        = useState("");

    const [firstName, setFirstName]
        = useState("");

    const [lastName, setLastName]
        = useState("");

    const [PendingTask, setPendingTask]
        = useState(-1);



    const [activeButton, setActiveButton] = useState("table");

        const handleButtonClick = (button: React.SetStateAction<string>) => {
            setActiveButton(button);
        };

        //const [currentEmployee , setCurrentEmployee ] = useState("");
        const currUser = useAuth0();
        //const decodedEmail = decodeURIComponent(String(currUser?.user?.email));
        const username = currUser?.user?.email;
        const ProfilePicture = currUser?.user?.picture;

        useEffect(() => {
            getEmployees(username!).then((results) => {

                setFirstName(results.firstName);
                setLastName(results.lastName);
                setDesignation(results.designation);

            });
            getServiceRequestSize(username!).then((results) => {
                setPendingTask(results);

            });
        }, [username]);
    //
    // useEffect(() => {
    //
    // }, [username]);


    console.log(getEmployees);


        return (

            <div className="flex h-screen overflow-x-hidden overflow-y-hidden">
                <FullSideNavBarComponent/>
                {/* Left Column - User Information */}
                <div className="w-1/3 max-w-[29%] bg-gray-200 p-4 bg-ivoryWhite rounded-lg">
                    <div className="flex flex-col items-center  justify-center text-center">
                        <h1 className="mb-5 font-bold text-2xl mt-5">Welcome, {firstName}</h1>
                        {ProfilePicture && <ImageCard img={ProfilePicture} />}

                    </div>

                    <div className="text-center  ">

                        <div className="flex flex-col mt-9 scale-90">
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
                                <p className="text-xl">{PendingTask}</p>
                            </div>

                            <div className="mt-10">

                                <button
                                    type="button"
                                    className={`inline-block rounded px-9 pb-5 pt-5 text-xl font-medium uppercase leading-normal shadow-md transition duration-150 ease-in-out 
                                    ${
                                        activeButton === "table"
                                            ? "bg-navy text-white hover:bg-navy focus:bg-navy active:bg-navy"
                                            : "bg-white  text-black hover:bg-blue-100 focus:bg-blue-100 active:bg-blue-200"
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
                                            : "bg-white text-black hover:bg-blue-100 focus:bg-blue-100 active:bg-blue-200"
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
                <div className="flex-1 p-8 justify-center items-center mt-6 ">

                    {/* Content to be populated with each request */}
                    {generateSelectedTable()}
                </div>
            </div>

        );


    function generateSelectedTable() {
        // For each div/request to overlay

        if (activeButton === "graph") {
            if (username != "") {
                return ((<PieChartStatsProfile></PieChartStatsProfile>));
            }

        }

        if (activeButton == "table") {
            if (username != "") {
                return (<ServiceRequest_Table employeeFilter={username!} statusFilter={Status.Any}
                                              priorityFilter={Priorities.any} locationFilter={"Any"}/>);

            }
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
    console.log("GET EMPLOYEES: " + emp);
    const employees = await axios.get<Employee>(`/api/employees/current_employee/${emp}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
);
    return employees.data;

}

async function getServiceRequestSize(emp : string) {
    const serviceRequest =
        await axios.get<ServiceRequest[]>("/api/serviceRequests/serviceReq/filter", {params: {status: "Any", priority: "Any",
                employee:emp, location:"Any"
            } });
    // console.log("sss");
    // console.log(serviceRequest.data);
    return serviceRequest.data.length;
}