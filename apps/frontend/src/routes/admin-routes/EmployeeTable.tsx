import SideNavBarComponent, {SideBarItem} from "../../components/SideNavBarComponent.tsx";
import ServiceRequestIcon from "../../images/SideBar/requestIcon.png";
import EmployeeIcon from "../../images/SideBar/user.png";
import CSVIcon from "../../images/SideBar/table.png";
import LogIcon from "../../images/SideBar/log-in.png";
import MapIcon from "../../images/SideBar/map.png";
import "../../css/route-css/EmployeeTable.css";
import "../../css/route-css/EmployeeTableInput.css";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Employee} from "../../../../backend/src/algorithms/Employee/Employee.ts";
import trashIcon from "../../images/Table Functions/trash.png";
import editPen from "../../images/Table Functions/editPen.png";

//TODO IMPLEMENT THESE BUTTONS TO POPULATE WITH EVERY ROW
//import TrashIcon from "../../images/Table Functions/trash-2.png";
//import EditIcon from "../../images/Table Functions/pencil.png";

function EmployeeTable() {
    
    
    const [employees, setEmployees] = useState<Employee[]>([]);

    //employee creation
    // const [newUserName, setNewUserName] = useState("");
    // const [newFristName, setNewFristName] = useState("");
    // const [newLastName, setNewLastName] = useState("");
    // const [newDis, setNewUserName] = useState("");
    
    /* populate the requests */
    useEffect(()=>{
        getEmployees().then((result)=>setEmployees(result));
    },[]);
    //table-id is request-table
    return (
        <div className="flex h-lvh flex-row">
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
                        <button onClick={openForm}
                                className="items- drop-shadow-lg transition-all hover:bg-navy w-48 text-white p-2 bg-navStart rounded-full h-min font-semibold ">Add Employee</button>
                    </span>
                </div>


                <div>
                    <table id={"request-table"}>
                        <thead>
                        <tr className={"tableTRHead"}>
                            <th className={"tableTD"}>User Name</th>
                            <th className={"tableTD"}>First Name</th>
                            <th className={"tableTD"}>Last Name</th>
                            <th className={"tableTD"}>Designation</th>
                            <th className={"tableTD"}>Actions</th>
                            <th className={"tableTD"}>Edit</th>
                            <th className={"tableTD"}>Delete</th>
                        </tr>
                        </thead>
                        {/* populating here */}
                        <tbody>
                        {
                            employees.map((employee) => {
                                return drawEmployeeRecord(employee);
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
            {/*add employee form*/}
            <div id={"addEmployeeForm"} className="employeeInputHidden">
                <div><b>New Employee</b></div>
                <form className={"formNewEmployee"}>
                    <div>
                        <label form={"employeeUsername"}>Username</label><br/>
                        <input type={"text"} placeholder={"Enter Username"} className={"inputText"}
                               name={"employeeUsername"} required/>
                    </div>
                    <div>
                        <label form={"employeeFirst"}>First Name</label><br/>
                        <input type={"text"} placeholder={"Enter First Name"} className={"inputText"}
                               name={"employeeFirst"} required/>
                    </div>
                    <div>
                        <label form={"employeeLast"}>Last Name</label><br/>
                        <input type={"text"} placeholder={"Enter Last Name"} className={"inputText"}
                               name={"employeeFirst"} required/>
                    </div>
                    <div>
                        <label form={"designation"}>Designation</label><br/>
                        <input type={"text"} placeholder={"Enter Designation"} className={"inputText"}
                               name={"designation"} required/>
                    </div>
                    <div>
                        <button type={"submit"} className={"submitButtonEmployee"}>Add Employee</button>
                    </div>
                    <div>
                        <button type={"button"} onClick={closeForm}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/**
 * Draw a table row.
 * @param employee the employee to draw.
 */
function drawEmployeeRecord(employee: Employee) {
    return (
        <tr className={"tableTR"} key={"Employee_" + employee.userName}>
            <td className={"tableTD"}>{employee.userName}</td>
            <td className={"tableTD"}>{employee.firstName}</td>
            <td className={"tableTD"}>{employee.lastName}</td>
            <td className={"tableTD"}>{employee.designation}</td>
            <td className={"tableTD"}>{employee.isAdmin}</td>
            <td className={"tableTD"}>
                <button>
                    <img src={trashIcon} alt={"Edit"} height={"30px"} width={"30px"}></img>
                </button>
            </td>
            <td className={"tableTD"}>
                <button>
                    <img src={editPen} alt={"Edit"} height={"30px"} width={"30px"}></img>
                </button>
            </td>
        </tr>
    );
}


/**
 * open the div add Employee Form
 */
function openForm() {
    const openSesame = document.getElementById("addEmployeeForm");
    if (openSesame != null) {
        openSesame.setAttribute("class","employeeInputVisible");
    }
}

/**
 * close the div add Employee Form
 */
function closeForm(): void {
    const close = document.getElementById("addEmployeeForm");
    if (close != null) {
        close.setAttribute("class","employeeInputHidden");
    }
}

async function getEmployees()  {
    const employees = await axios.get<Employee[]>("/api/employees/employees");
    return employees.data;
}

/**
 * Delete an employee from the database.
 * @param employee the employee to remove.
 */
// async function deleteEmployee(employee: Employee): void {
//     console.log("Tried to delete employee " + employee);
//     return;
// }





export default EmployeeTable;
