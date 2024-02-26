import React from "react";
import axios from "axios";
import {Employee} from "common/src/algorithms/Employee/Employee.ts";
import ImportIcon from "../../images/Table Functions/import.png";
import ExportIcon from "../../images/Table Functions/download.png";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {HTMLInputElement} from "happy-dom";

function ExportImportButtonEmployee() {
    /* ay cabrón */
    async function importEmployee() {
        /* alloca.h */
        const employeeInputElement: HTMLInputElement = document.createElement("input");
        employeeInputElement.type = "file";
        employeeInputElement.accept = "text/csv";

        /* put the data from the input element into a file */
        let employeeFileData: File;
        employeeInputElement.onchange = async (e: Event) => {
            /* crank it */
            employeeFileData = (e.target as HTMLInputElement).files[0];
            const fileData: FormData = new FormData();
            fileData.append("csv", employeeFileData);

            /* send it to backend */
            try {
                await axios.post("/api/employees/employee_csv_import", fileData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (err) {
                console.error("importEmployee: axios didn't like the CSV: " + err);
            }
        };

        /* why? */
        employeeInputElement.click();
    }

    async function exportEmployee() {
        const employeesGetRaw = await axios.get<Employee[]>("/api/employees/employees");
        const employeesGet = employeesGetRaw.data;


        let EmployeeString = "";

        for (const employeesGetElement of employeesGet) {
            EmployeeString += employeesGetElement.userID + ",";
            EmployeeString += employeesGetElement.userName + ",";
            EmployeeString += employeesGetElement.firstName + ",";
            EmployeeString += employeesGetElement.lastName + ",";
            EmployeeString += employeesGetElement.designation + ",";
            EmployeeString += employeesGetElement.isAdmin + "\r\n";
        }

        const employeeFile = new Blob([EmployeeString], {
            type: "text/csv",
        });

        const documentSaveEmployee = document.createElement("a");
        documentSaveEmployee.download = "employee.csv";
        documentSaveEmployee.href = window.URL.createObjectURL(employeeFile);

        documentSaveEmployee.click();
    }

    return (

        <div className={"flex justify-center "}>
            <button
                title={"Import New Set of Employees"}
                className={"p-3  bg-navStart rounded-full h-min  drop-shadow-lg"}
                onClick={importEmployee}>
                <img src={ImportIcon} alt={""} className={"invert"}/>
            </button>
            <button
                title={"Export/Download Current Employee Data"}
                className={"p-3 ml-4 mr-4 bg-navStart rounded-full h-min  drop-shadow-lg"}
                onClick={exportEmployee}>
                <img src={ExportIcon} alt={""} className={"invert"}/>
            </button>
        </div>
    );

}

export default ExportImportButtonEmployee;
