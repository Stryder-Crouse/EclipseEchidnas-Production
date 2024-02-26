import React from "react";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {HTMLInputElement} from "happy-dom";

function ImportExportNode() {


    async function inputNode() {
        const inputNode = document.createElement("input");
        inputNode.type = "file";
        inputNode.accept = "text/csv"; //only take csv files
        let nodeFile: File;
        const fileData = new FormData();
        inputNode.onchange = async (e) => {
            nodeFile = (e.target as HTMLInputElement).files[0];

            console.log("file type");
            console.log(nodeFile.name);
            console.log(nodeFile.type);

            fileData.append("csv", nodeFile);
            try {
                await axios.post("/api/loadCSVFile/CSV-Import-Node", fileData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (err) {
                throw new Error("Error with loading Nodes");
            }
        };



        //click input for the user
        inputNode.click();

    }

    async function exportNode() {
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
    }


    return (
        <div className={"flex justify-center mt-5"}>
            <button
                className={"transition-all hover:bg-navy w-40 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"}
                onClick={inputNode}>
                Import Node .csv
            </button>
            <button
                className={"transition-all hover:bg-navy w-40 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"}
                onClick={exportNode}>
                Export Node .csv
            </button>
        </div>
    );
}

export default ImportExportNode;
