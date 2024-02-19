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
import {Employee, Roles} from "../../../../backend/src/algorithms/Employee/Employee.ts";
import trashIcon from "../../images/Table Functions/trash.png";
import editPen from "../../images/Table Functions/editPen.png";
import ExportImportButtonEmployee from "../../components/EmployeeTableButtons/ExportImportButtonEmployee.tsx";


const designations = [Roles.None,Roles.nurse,Roles.doctor,Roles.admin,
    Roles.janitor,Roles.flowerDeliverer,Roles.religiousPersonnel];

function EmployeeTable() {
    
    
    const [employees, setEmployees] = useState<Employee[]>([]);

    //employee creation
    const [newUserName, setNewUserName] = useState("");
    const [newFristName, setNewFristName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newIsAdmin, setNewIsAdmin] = useState(false);
    const [newDesignation, setNewDesignation] = useState(Roles.None);
    // const [resetDesignation, setResetDesignation] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);





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
            <ExportImportButtonEmployee/>
            <div className={"employee-table-container"}>
                <div className="flex">
                    <span className={"employee-caption-container"}>
                        <span className={"employee-table-title"}>Employee Table</span>
                        <button onClick={openForm}
                                className="items- drop-shadow-lg transition-all hover:bg-navy w-48 text-white p-2 bg-navStart rounded-full h-min font-semibold ">Add Employee</button>
                    </span>
                </div>


                <div className={"employeeTable"}>
                    <table id={"request-table"}>
                        <thead>
                        <tr className={"tableTRHead"}>
                            <th className={"tableTD"}>User Name</th>
                            <th className={"tableTD"}>First Name</th>
                            <th className={"tableTD"}>Last Name</th>
                            <th className={"tableTD"}>Designation</th>
                            <th className={"tableTD"}>Is Admin</th>
                            <th className={"tableTD"}>Edit</th>
                            <th className={"tableTD"}>Delete</th>
                        </tr>
                        </thead>
                        {/* populating here */}
                        <tbody>
                        {
                            employees.map((employee, employeeIndex) => {
                                return drawEmployeeRecord(employee,employeeIndex);
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
                        <input disabled={isCreating()} type={"text"} placeholder={"Enter Username"} className={"inputText"}
                               name={"employeeUsername"} required
                               value={newUserName}
                               onChange={(e) => {
                                   setNewUserName(e.target.value);
                               }}
                        />
                    </div>
                    <div>
                        <label form={"employeeFirst"}>First Name</label><br/>
                        <input type={"text"} placeholder={"Enter First Name"} className={"inputText"}
                               name={"employeeFirst"} required
                               value={newFristName}
                               onChange={(e) => {
                                   setNewFristName(e.target.value);
                               }}
                        />
                    </div>
                    <div>
                        <label form={"employeeLast"}>Last Name</label><br/>
                        <input type={"text"} placeholder={"Enter Last Name"} className={"inputText"}
                               name={"employeeFirst"} required
                               value={newLastName}
                               onChange={(e) => {
                                   setNewLastName(e.target.value);
                               }}
                        />
                    </div>
                    <div>
                        <label form={"designation"}>Designation</label><br/>
                        <select
                            value={newDesignation}
                            onChange={
                                (e) => {
                                    setNewDesignation(e.target.value as Roles);
                                }
                            }
                        >
                            {
                                designations?.map((des)=>{
                                    return (
                                        <option
                                            className={"statis-dropdown"}
                                            value={des}
                                            key={des+"_newEmployee"}
                                        >
                                            {des}
                                        </option>
                                    );
                                })

                            }
                        </select>


                        {/*<CreateDropdown dropBtnName={"Designation"} dropdownID={"employeeDesignation"}*/}
                        {/*                isSearchable={false}*/}
                        {/*                populationArr={designations} resetDropdown={resetDesignation}*/}
                        {/*                setSelected={setNewDesignationIndex}*/}
                        {/*                inputCSS={""}*/}
                        {/*                selectCSS={"inputText"}*/}
                        {/*                resetOnSelect={false} setResetDropdown={setResetDesignation}></CreateDropdown>*/}

                    </div>
                    <div>
                        <label form={"isAdmin"}>Is Admin</label><br/>
                        <input type={"checkbox"}
                               name={"isAdmin"} required
                                 className={"inputText"}
                               id={"isAdminCheck"}
                               onChange={(e) => {
                                   console.log(e.target.checked);
                                       setNewIsAdmin(e.target.checked);
                               }}
                        />
                    </div>
                    <div>
                        <button  type={"button"} className={"submitButtonEmployee"}
                        onClick={onSubmit}
                        >{formSubmitText()}</button>
                    </div>
                    <div>
                        <button type={"button"} className={"submitButtonEmployee"}onClick={closeForm}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );


    function isCreating(){
        if(editIndex!=-1){
            return true;
        }
        return false;
    }
    function formSubmitText(){
        if(editIndex!=-1){
            return "Update Employee";
        }
        return "Add Employeee";
    }

    async function onSubmit() {

        let isEditing = false;

        if(editIndex!=-1){
            isEditing=true;
        }

        const newEmployee: Employee = {
            designation: newDesignation ,
            firstName: newFristName,
            isAdmin: newIsAdmin,
            lastName: newLastName,
            userName: newUserName
        };


        const newEmployees = [...employees];

        //editing
        if(isEditing){
            newEmployees[editIndex]=newEmployee;
        }
        //creating
        else{
            newEmployees.push(newEmployee);
        }

        setEmployees(newEmployees);


        closeForm();

        if(isEditing) {

            await axios.post("/api/employees/updateEmployee",
                newEmployee, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

        }
        else{
            await axios.post("/api/employees/employee",
                newEmployee, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
        }


    }

    function handleEdit(employee: Employee , employeeIndex:number){

        if(employee.isAdmin) {
            const checkbox = document?.getElementById("isAdminCheck") as HTMLInputElement;
            checkbox.checked = true;
        }
        else{
            const checkbox = document?.getElementById("isAdminCheck") as HTMLInputElement;
            checkbox.checked = false;
        }
        setNewDesignation(employee.designation);
        setNewIsAdmin(employee.isAdmin);
        setNewLastName(employee.lastName);
        setNewFristName(employee.firstName);
        setNewUserName(employee.userName);
        setEditIndex(employeeIndex);


        openForm();
    }

    async function handleDelete(employee: Employee) {
        const newEmployees: Employee[] = [];

        employees.forEach((employ) => {
            if (employ.userName != employee.userName) {
                newEmployees.push(employ);
            }
        });

        setEmployees(newEmployees);

        const data:string[] = [employee.userName];

        await axios.post("/api/employees/deleteEmployee",
            data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });


    }

    /**
     * Draw a table row.
     * @param employee the employee to draw.
     * @param employeeIndex
     */
    function drawEmployeeRecord(employee: Employee , employeeIndex:number) {
        return (
            <tr className={"tableTR"} key={"Employee_" + employee.userName}>
                <td className={"tableTD"}>{employee.userName}</td>
                <td className={"tableTD"}>{employee.firstName}</td>
                <td className={"tableTD"}>{employee.lastName}</td>
                <td className={"tableTD"}>{employee.designation}</td>
                <td className={"tableTD"}>{String(employee.isAdmin)}</td>
                <td className={"tableTD"}>
                    <button onClick={() => {
                        handleEdit(employee, employeeIndex);
                    }}>
                        <img src={editPen} alt={"Edit"} height={"30px"} width={"30px"}></img>
                    </button>
                </td>

                <td className={"tableTD"}>
                    <button onClick={() => {
                        handleDelete(employee).then();
                    }}>
                        <img src={trashIcon} alt={"Edit"} height={"30px"} width={"30px"}></img>
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

            //clear form
            const checkbox = document?.getElementById("isAdminCheck")as HTMLInputElement;
            checkbox.checked=false;
            setNewDesignation(Roles.None);
            setNewIsAdmin(false);
            setNewLastName("");
            setNewFristName("");
            setNewUserName("");
            setEditIndex(-1);
        }
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
