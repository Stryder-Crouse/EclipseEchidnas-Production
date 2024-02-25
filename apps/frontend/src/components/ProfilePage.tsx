import React, {useEffect, useState} from "react";
// import { Button } from "@material-tailwind/react";
import FullSideNavBarComponent from "./FullSideNavBarComponent.tsx";
//import ProfileIcon from "../images/Profile_icon.jpg";
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

    const [CurEmp, setCurEmp]
        = useState("");


        const [activeButton, setActiveButton] = useState("table");

        const handleButtonClick = (button: React.SetStateAction<string>) => {
            setActiveButton(button);
        };

        //const [currentEmployee , setCurrentEmployee ] = useState("");
        const currUser = useAuth0();
        const Username = String(currUser?.user?.email);
        const FirstName = String(currUser?.user?.given_name);
        const LastName = String(currUser?.user?.family_name);
        const ProfilePicture = currUser?.user?.picture;

        useEffect(() => {
            setCurEmp(Username); // Move this inside useEffect
            getEmployees(Username).then((result) => {
                setCurEmp(result);
            });
        }, [CurEmp, Username]);

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
                                <p className="text-xl">{Username}</p>
                            </div>

                            <div className="flex mb-2">
                                <span className="font-bold text-xl mr-2">First Name:</span>
                                <p className="text-xl">{FirstName}</p>
                            </div>

                            <div className="flex mb-2">
                                <span className="font-bold text-xl mr-2">Last Name:</span>
                                <p className="text-xl">{LastName}</p>
                            </div>

                            <div className="flex mb-2">
                                <span className="font-bold text-xl mr-2">Role:</span>
                                <p className="text-xl">{FirstName}</p>
                            </div>

                            <div className="flex mb-2">
                                <span className="font-bold text-xl mr-2">Pending Tasks:</span>
                                <p className="text-xl">{FirstName}</p>
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

                                {/*<button*/}
                                {/*    type="button"*/}
                                {/*    className="inline-block rounded bg-blue-700 px-9 pb-5 pt-5 text-xl font-medium uppercase leading-normal*/}
                                {/*               text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-600 hover:shadow-lg*/}
                                {/*               focus:bg-blue-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-700*/}
                                {/*               active:shadow-lg dark:shadow-md dark:hover:shadow-lg dark:focus:shadow-lg dark:active:shadow-lg"*/}

                                {/*>*/}
                                {/*    Table*/}
                                {/*</button>*/}

                                {/*<button*/}
                                {/*    type="button"*/}
                                {/*    className="inline-block rounded bg-blue-200 px-9 pb-5 pt-5 text-xl font-medium uppercase leading-normal*/}
                                {/*    text-blue-700 transition duration-150 ease-in-out hover:bg-blue-100*/}
                                {/*    focus:bg-blue-100 focus:outline-none focus:ring-0 active:bg-blue-200"*/}
                                {/*>*/}
                                {/*    Graphs*/}
                                {/*</button>*/}

                            </div>

                        </div>


                    </div>
                </div>

                {/* Right Column - Content */}
                <div className="flex-1 p-4">
                    {/*<div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300*/}
                    {/*        dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full*/}
                    {/*        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border*/}
                    {/*        after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"*/}
                    {/*></div>*/}
                    {/*<span className="ml-1"><b>Stats</b></span>*/}

                    {/* Content to be populated with each request */}
                    {generateSelectedTable()}
                </div>
            </div>

            // <div className={"flex h-lvh flex-row"}>
            //     <div className="flex">
            //         <FullSideNavBarComponent/>
            //     </div>
            //     <div className="mt-5 flex flex-col m-auto">
            //         <p className="mb-1 m-auto flex font-bold justify-center p-3 bg-white rounded-lg w-72 shadow dark:bg-gray-800">Profile
            //             Page</p>
            //
            //         <div className="flex justify-center  flex-row scale-95">
            //             <div className="flex justify-center gap-4">
            //                 <ImageCard img={ProfileIcon} name={EmpName} role={"Role "}>
            //                 </ImageCard>
            //                 <label className="flex items-center cursor-pointer ml-2">
            //                     <input type="checkbox"
            //                            checked={statsToggle}
            //                            className="sr-only peer"
            //                            onChange={(event) => {
            //                                setStatsToggle(event.target.checked);
            //                            }}
            //                     />
            //                     <div
            //                         className=" relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
            //                     dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
            //                     peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border
            //                     after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            //                     <span className="ml-1"><b>Stats</b></span>
            //                 </label>
            //
            //             </div>
            //         </div>
            //         {/* the content to be populated with each request*/}
            //         {
            //             generateSelectedTable()
            //         }
            //     </div>
            //
            // </div>
        );


    function generateSelectedTable() {
        // For each div/request to overlay

        if (statsToggle) {
            if (Username != "") {
                return ((<PieChartStatsProfile></PieChartStatsProfile>));
            }

        }


        if (Username != "") {
            return (<ServiceRequest_Table employeeFilter={Username} statusFilter={Status.Any} priorityFilter={Priorities.any}  locationFilter={"Any"}/>);

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
    return employees.data.designation;
}
