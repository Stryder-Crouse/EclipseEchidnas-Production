import SideNavBarComponent, {SideBarItem} from "../../components/SideNavBarComponent.tsx";
import ServiceRequestIcon from "../../images/SideBar/requestIcon.png";
import EmployeeIcon from "../../images/SideBar/user.png";
import CSVIcon from "../../images/SideBar/table.png";
import LogIcon from "../../images/SideBar/log-in.png";
import MapIcon from "../../images/SideBar/map.png";
import "../../css/route-css/EmployeeTable.css";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Employee} from "../../../../backend/src/algorithms/Employee/Employee.ts";

//TODO IMPLEMENT THESE BUTTONS TO POPULATE WITH EVERY ROW
//import TrashIcon from "../../images/Table Functions/trash-2.png";
//import EditIcon from "../../images/Table Functions/pencil.png";

function EmployeeTable() {
    
    
    const [employees, setEmployees] = useState<Employee[]>([]);
    
    
    /* populate the requests */
    useEffect(()=>{
        getEmployees().then((result)=>setEmployees(result));
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
                <div className="flex">
                    <span className={"employee-caption-container"}>
                        <span className={"employee-table-title"}>Employee Table</span>
                        <button onClick={openForm} className="items- drop-shadow-lg transition-all hover:bg-navy w-48 text-white p-2 bg-navStart rounded-full h-min font-semibold ">Add Employee</button>

                        {/* TODO ADD THIS FUNCTION INTO IT */}
                            <div id={"addEmployeeFOrm"} className="hidden z-20">
                                <form>
                                    <label form={"employeeUsername"}>Username</label>
                                    <input type={"text"} placeholder={"Enter Username"} name={"employeeUsername"} required/>
                                    
                                    <label form={"employeeFirst"}>First Name</label>
                                    <input type={"text"} placeholder={"Enter First Name"} name={"employeeFirst"} required/>
                                    
                                    <label form={"employeeLast"}>Last Name</label>
                                    <input type={"text"} placeholder={"Enter Last Name"} name={"employeeFirst"} required/>
                                    
                                    <label form={"designation"}>Designation</label>
                                    <input type={"text"} placeholder={"Enter Designation"} name={"designation"} required/>
                                    
                                    <button type={"submit"}>Add Employee</button>
                                    <button type={"button"} onClick={closeForm}>Close</button>
                                </form>
                            </div>

                    </span>
                </div>


                <div className={"employee-table-wrapper"}>
                    <table className={"requestTable"} id={"request-table"}>
                        <thead>
                        <tr>
                            <th>User Name</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Designation</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        {/* populating here */}
                        <tbody>
                        {
                            employees.map((employee) => {
                                return (
                                    <tr key={"Employee_" + employee.userName}>
                                        <td>{employee.userName}</td>
                                        <td>{employee.firstName}</td>
                                        <td>{employee.lastName}</td>
                                        <td>{employee.designation}</td>
                                        <td>{employee.isAdmin}</td>
                                    </tr>
                                );

                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>


        </div>


    );
}

/**
 * open the div add Employee Form
 */
function openForm() {
    const openSesame = document.getElementById("addEmployeeForm");
    if (openSesame != null) {
        openSesame.style.display= "block";
    }
}

/**
 * close the div add Employee Form
 */
function closeForm() {
    const close = document.getElementById("addEmployeeForm");
    if (close != null) {
        close.style.display= "none";
    }
}

async function getEmployees() {
    const employees = await
        axios.get<Employee[]>("/api/employees/employees");
    return employees.data;
}

//TODO this function needs to replaced by actually doing the right populating, follow homework 3
// async function populateRequests() {
//     /* useless comment */
//     console.log("RAN");
//
//     /* get the employees from backend */
//     const empReqs = await axios.get<Employee[]>("/api/employees/employees");
//
//     //fine dropdown div in the html on the page
//     const table = document.getElementById("request-table");
//
//     console.log(table);
//
//     //for each node
//     empReqs.data.forEach(function (newRequest: Employee) {
//         //create tr element to store the record
//         const tableRow = document.createElement("tr");
//
//         // //create td tags for data from record
//         // const reqType = document.createElement("td");
//         // reqType.textContent = "Medicine request";
//         // reqType.setAttribute("className", "node-id");
//
//         const userName = document.createElement("td");
//         userName.textContent = newRequest.userName;
//         userName.setAttribute("className", "node-id");
//
//         const firstName = document.createElement("td");
//         firstName.textContent = newRequest.firstName;
//
//         const lastName = document.createElement("td");
//         lastName.textContent = newRequest.lastName;
//
//         const designation = document.createElement("td");
//         designation.textContent = newRequest.designation.toString();
//
//         //append data elements together to one row
//         tableRow.appendChild(userName);
//         tableRow.appendChild(firstName);
//         tableRow.appendChild(lastName);
//         tableRow.appendChild(designation);
//         //tableRow.appendChild(reqAmount);
//
//         if (table == null) {
//             return;
//         }
//
//         //add new row element to table
//         table.appendChild(tableRow);
//     });
// }

export default EmployeeTable;
