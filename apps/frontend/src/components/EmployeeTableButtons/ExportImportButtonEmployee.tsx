import React from "react";
import axios from "axios";
import {Employee} from "../../../../backend/src/algorithms/Employee/Employee.ts";

function ExportImportButtonEmployee() {

    async function importEmployee() {
        const inputEmployee = document.createElement("input");
        inputEmployee.type = "file";
        inputEmployee.accept = "text/csv";
        //let EmployeeFile: File;
        //TODO AA implement when alex does thing

        //const fileData = new FormData();
        //fileData.append("csv", EmployeeFile);

        // try {
        //     await axios.post("/api/loadCSVFile", fileData, {
        //         headers: {
        //             "Content-Type": "multipart/form-data",
        //         },
        //     });
        // } catch (err) {
        //     throw new Error("Error with loading Employees");
        // }


        inputEmployee.click();
    }

    async function exportEmployee() {
        const employeesGet:Employee[] = await axios.get("/api/employees/employees");

        let EmployeeString = "";

        for (const employeesGetElement of employeesGet) {
            EmployeeString += employeesGetElement.userName + ",";
            EmployeeString += employeesGetElement.firstName + ",";
            EmployeeString += employeesGetElement.lastName + ",";
            EmployeeString += employeesGetElement.designation + ",";
            EmployeeString += employeesGetElement.isAdmin + "\r\n";
        }

        const employeeFile = new Blob( [EmployeeString], {
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
