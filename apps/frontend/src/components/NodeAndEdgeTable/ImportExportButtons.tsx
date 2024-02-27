import React, {Dispatch, SetStateAction, useState} from "react";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {HTMLInputElement} from "happy-dom";
import {Employee} from "common/src/algorithms/Employee/Employee.ts";
import ImportInput from "./ImportInput.tsx";

export type closeImportInput = {
    setIsImportOpen: Dispatch<SetStateAction<boolean>>;
}

function ImportExportButtons() {

    const [isImportOpen, setIsImportOpen] = useState(false);
    //employee -> edge -> nodes for the post stuff


            function openImportForm() {
                setIsImportOpen(true);
            }

            function closeImportForm(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
                event.preventDefault();
                setIsImportOpen(false);
            }


            // async function inputFiles() {
            //     //Get node file
            //     const inputNode = document.createElement("input");
            //     inputNode.type = "file";
            //     inputNode.accept = "text/csv"; //only take csv files
            //     let nodeFile: File;
            //     inputNode.onchange = (e) => {
            //         nodeFile = (e.target as HTMLInputElement).files[0];
            //
            //         console.log("file type");
            //         console.log(nodeFile.name);
            //         console.log(nodeFile.type);
            //
            //
            //     };
            //     //click input for the user
            //     inputNode.click();
            //
            //     // get edgefile
            //     //now get edge file
            //     const inputEdge = document.createElement("input");
            //     inputEdge.type = "file";
            //     inputEdge.accept = "text/csv"; //only take csv files
            //     let edgeFile: File;
            //
            //     inputEdge.onchange = async (e) => {
            //         edgeFile = (e.target as HTMLInputElement).files[0];
            //         console.log("file type edge");
            //         console.log(edgeFile.name);
            //         console.log(edgeFile.type);
            //         console.log(edgeFile);
            //
            //
            //         const fileData = new FormData();
            //         fileData.append("csv", nodeFile);
            //         fileData.append("csv", edgeFile);
            //         //send edge and node file to back end
            //
            //         try {
            //             await axios.post("/api/loadCSVFile", fileData, {
            //                 headers: {
            //                     "Content-Type": "multipart/form-data",
            //                 },
            //             });
            //         } catch (err) {
            //             throw new Error("Error with loading Nodes");
            //         }
            //
            //
            //     };
            //     //click input for the user
            //     inputEdge.click();
            // }


            async function exportDataBase() {
                const nodeAndEdgeStrings = await axios.get<string[]>("/api/loadCSVFile");

                //save node file
                const nodeFile = new Blob([nodeAndEdgeStrings.data[0]], {
                    type: "text/csv",
                });
                const documentSaverNode = document.createElement("a");
                documentSaverNode.download = "node.csv";
                documentSaverNode.href = window.URL.createObjectURL(nodeFile);

                //click the link to save the file for the user
                documentSaverNode.click();

                //save edge file
                const edgeFile = new Blob([nodeAndEdgeStrings.data[1]], {
                    type: "text/csv",
                });
                const documentSaverEdge = document.createElement("a");
                documentSaverEdge.download = "edge.csv";
                documentSaverEdge.href = window.URL.createObjectURL(edgeFile);

                //click the link to save the file for the user
                documentSaverEdge.click();

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

            /*const */

            return (
                <div className={"flex justify-center mt-5"}>
                    <button
                        className={"transition-all hover:bg-navy w-40 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"}
                        onClick={openImportForm}>
                        Import all .csv
                    </button>
                    <button
                        className={"transition-all hover:bg-navy w-40 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"}
                        onClick={exportDataBase}>
                        Export all .csv
                    </button>

                    {isImportOpen && (
                        <div className={"fixed inset-0 bg-gray-800 bg-opacity-50 z-50"} onClick={closeImportForm}></div>
                    )}

                    <div className={`popupForm ${isImportOpen ? "block" : "hidden"}`} id={"importPopupForm"}>
                        <ImportInput setIsImportOpen={setIsImportOpen}/>
                    </div>
                </div>
            );
        }
export default ImportExportButtons;
