import {closeImportInput} from "./ImportExportButtons.tsx";
import React, {useState} from "react";
import axios from "axios";
// import axios from "axios";


export default function ImportInput({setIsImportOpen}: closeImportInput) {

    const [importFileNode, setImportFileNode] = useState<File | null>(null);
    const [importFileEdge, setImportFileEdge] = useState<File | null>(null);
    const [importFileEmployee, setImportFileEmployee] = useState<File | null>(null);


    const onChangeNode = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImportFileNode(e.target.files[0]);
        }
    };

    const onChangeEdge = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImportFileEdge(e.target.files[0]);
        }
    };

    const onChangeEmployee = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImportFileEmployee(e.target.files[0]);
        }
    };

    function closeImportForm(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
        event.preventDefault();
        setIsImportOpen(false);
    }

    async function inputFiles() {

        console.log(importFileNode);
        console.log(importFileEmployee);
        console.log(importFileEdge);

        if (importFileNode != null) {
            // do the thing
            //node
            const nodeFileData = new FormData();
            console.log("File Name: " + importFileNode?.name);
            console.log("File Type: " + importFileNode?.type);

            nodeFileData.append("csv", importFileNode as File);
            try {
                await axios.post("/api/loadCSVFile/CSV-Import-Node", nodeFileData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (err) {
                throw new Error("Error with loading Nodes");
            }
        }




        if(importFileEdge != null)
        {
            //edge
            const edgeFileData = new FormData();
            console.log("File Name: " + importFileEdge?.name);
            console.log("File Type: " + importFileEdge?.type);

            edgeFileData.append("csv", importFileEdge);

            try {
                await axios.post("/api/loadCSVFile/CSV-Import-Edge", edgeFileData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (err) {
                throw new Error("Error with loading Edges");
            }
        }




        if(importFileEmployee != null)
        {
            //edge
            const employeeFileData = new FormData();
            console.log("File Name: " + importFileEmployee?.name);
            console.log("File Type: " + importFileEmployee?.type);

            employeeFileData.append("csv", importFileEmployee);

            try {
                await axios.post("/api/employees/employee_csv_import", employeeFileData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (err) {
                throw new Error("Error with loading Edges");
            }
        }

        setIsImportOpen(false);
        //Get node file
        // const inputNode = document.createElement("input");
        // inputNode.type = "file";
        // inputNode.accept = "text/csv"; //only take csv files
        // let nodeFile: File;
        //
        // inputNode.onchange = (e) => {
        //     nodeFile = importFileNode;
        //
        //     console.log("file type");
        //     console.log(nodeFile.name);
        //     console.log(nodeFile.type);
        //
        // };
        //
        //
        // //click input for the user
        // inputNode.click();
        //
        // // get edgefile
        // //now get edge file
        // const inputEdge = document.createElement("input");
        // inputEdge.type = "file";
        // inputEdge.accept = "text/csv"; //only take csv files
        // let edgeFile: File;
        //
        // inputEdge.onchange = async (e) => {
        //     edgeFile = (e.target as HTMLInputElement).files[0];
        //     console.log("file type edge");
        //     console.log(edgeFile.name);
        //     console.log(edgeFile.type);
        //     console.log(edgeFile);
        //
        //
        //     const fileData = new FormData();
        //     fileData.append("csv", nodeFile);
        //     fileData.append("csv", edgeFile);
        //     //send edge and node file to back end
        //
        //     try {
        //         await axios.post("/api/loadCSVFile", fileData, {
        //             headers: {
        //                 "Content-Type": "multipart/form-data",
        //             },
        //         });
        //     } catch (err) {
        //         throw new Error("Error with loading Nodes");
        //     }
        //
        //
        // };
        //
        //
        //
        // //click input for the user
        // inputEdge.click();
    }

    return (
        <div
            className={"mt-3 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl p-1 align-self-center"}>
            <form className={"p-2 "}>
                <div className="text-center flex-col justify-center">
                    <h1 className="mb-3 font-bold text-xl">Import Form</h1>

                    <div className="flex-col justify-center items-center my-1.5">
                        <h3>Node</h3>
                        <input type="file" accept="text/csv" onChange={onChangeNode} />
                    </div>

                    <div className="m-auto flex-col justify-center items-center my-1.5">
                        <h3>Edge</h3>
                        <input type="file" accept="text/csv" onChange={onChangeEdge}/>
                    </div>

                    <div className="m-auto flex-col justify-center items-center my-1.5">
                        <h3>Employee</h3>
                        <input type="file" accept="text/csv" onChange={onChangeEmployee}/>
                    </div>
                </div>


            </form>
            <div className={"grid justify-center items-center m-auto my-1.5 "}>
                <button onClick={inputFiles} className={
                    "bg-navy text-white p-1 rounded-xl w-24 font-bold cursor-pointer flex justify-center m-auto mb-2 mt-5"}>
                    Submit
                </button>
            </div>
            <div className={"grid justify-center items-center m-auto my-1.5 mb-5"}>
                <button onClick={(event) => closeImportForm(event)} className={
                    "bg-tableText p-1 rounded-xl w-24 font-bold cursor-pointer flex justify-center m-auto mb-2 mt-5"}>
                    Close
                </button>
            </div>
        </div>
    );

}
