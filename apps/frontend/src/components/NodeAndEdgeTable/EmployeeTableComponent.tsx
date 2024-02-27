import React, {useEffect, useState} from "react";
import axios from "axios";
import {Employee} from "../../../../../packages/common/src/algorithms/Employee/Employee.ts";

function EmployeeTableComponent() {

    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        getEmployees().then((result) => setEmployees(result));
    }, []);

    return (


        <div className={""}>
            <div className={""}>
                <table id={"request-table"} className={"requestTable"}>
                    <thead>
                        <tr className={"tableTRHead"}>
                            <th className={"tableTD"}>User Name</th>
                            <th className={"tableTD"}>Last Name</th>
                            <th className={"tableTD"}>First Name</th>
                            <th className={"tableTD"}>Designation</th>
                            <th className={"tableTD"}>Is Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        employees.map((employee) => {
                            return(
                                <tr className={"tableTR"}>
                                    <td className={"tableTD"}>{employee.userName}</td>
                                    <td className={"tableTD"}>{employee.lastName}</td>
                                    <td className={"tableTD"}>{employee.firstName}</td>
                                    <td className={"tableTD"}>{employee.designation}</td>
                                    <td className={"tableTD"}>{String(employee.isAdmin)}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

async function getEmployees() {
    const employees = await axios.get<Employee[]>("/api/employees/employees");
    return employees.data;
}

export default EmployeeTableComponent;
