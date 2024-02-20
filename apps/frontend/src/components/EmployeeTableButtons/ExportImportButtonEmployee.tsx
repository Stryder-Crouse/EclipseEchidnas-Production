import React from "react";
import axios from "axios";
import {Employee} from "../../../../backend/src/algorithms/Employee/Employee.ts";
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
            employeeFileData = (e.target as HTMLInputElement).files[0];
            console.log("new employee file type Just Dropped");
            console.log(employeeFileData.name);
            console.log(employeeFileData.type);

            const fileData: FormData = new FormData();
            fileData.append("csv", employeeFileData);

            try {
                await axios.post("/api/employees/employee_csv_import", fileData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (err) {
                throw new Error("Error with loading Employees");
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

        <div className={"flex justify-center mt-5"}>
            <button
                className={"transition-all hover:bg-navy w-40 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"}
                onClick={importEmployee}>
                Import .csv
            </button>
            <button
                className={"transition-all hover:bg-navy w-40 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"}
                onClick={exportEmployee}>
                Export Current
            </button>
        </div>
    );

}

export default ExportImportButtonEmployee;
