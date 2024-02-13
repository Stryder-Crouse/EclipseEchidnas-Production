import SideNavBarComponent, {SideBarItem} from "../../components/SideNavBarComponent.tsx";
import ServiceRequestIcon from "../../images/SideBar/requestIcon.png";
import EmployeeIcon from "../../images/SideBar/user.png";
import CSVIcon from "../../images/SideBar/table.png";
import LogIcon from "../../images/SideBar/log-in.png";
import MapIcon from "../../images/SideBar/map.png";
import "../../css/route-css/EmployeeTable.css";
import React, { useEffect} from "react";
import axios from "axios";
import {Employee} from "../../../../backend/src/algorithms/Employee/Employee.ts";

function EmployeeTable() {
    useEffect(()=>{
        let ran;
        if (!ran) {
            populateRequests().then();

            ran = true;
        }

    },[]);
    //table-id is request-table
    return (
        <div className="flex h-lvh">
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

            <div className={"employee-table-container"}>
                    <span className={"employee-caption-container"}>
                        <span className={"employee-table-title"}>Employee Table</span>
                    </span>
                <div className={"employee-table-wrapper"}>
                    <table className={"requestTable"} id={"request-table"}>
                        <thead>
                        <tr>
                            <th>User Name</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Designation</th>
                        </tr>
                        </thead>
                        {/* populating here */}
                    </table>
                </div>
            </div>


        </div>


    );
}

async function populateRequests() {
    console.log("RAN");

    const empReqs = await axios.get<Employee[]>("/api/employees/employees");

    //fine dropdown div in the html on the page
    const table = document.getElementById("request-table");

    console.log(table);

    //for each node
    empReqs.data.forEach(function (newRequest: Employee) {
        //create tr element to store the record
        const tableRow = document.createElement("tr");

        // //create td tags for data from record
        // const reqType = document.createElement("td");
        // reqType.textContent = "Medicine request";
        // reqType.setAttribute("className", "node-id");

        const userName = document.createElement("td");
        userName.textContent = newRequest.userName;
        userName.setAttribute("className", "node-id");

        const firstName = document.createElement("td");
        firstName.textContent = newRequest.firstName;

        const lastName = document.createElement("td");
        lastName.textContent = newRequest.lastName;

        const designation = document.createElement("td");
        designation.textContent = newRequest.designation.toString();

        //append data elements together to one row
        tableRow.appendChild(userName);
        tableRow.appendChild(firstName);
        tableRow.appendChild(lastName);
        tableRow.appendChild(designation);
        //tableRow.appendChild(reqAmount);

        if (table == null) {
            return;
        }

        //add new row element to table
        table.appendChild(tableRow);
    });
}

export default EmployeeTable;
