import React from "react";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {HTMLInputElement} from "happy-dom";

function ImportExportEdge() {


    //TODO ryan this one
    async function inputEdge() {
        const inputEdge = document.createElement("input");
        inputEdge.type = "file";
        inputEdge.accept = "text/csv"; //only take csv files
        let edgeFile: File;
        const fileData = new FormData();
        inputEdge.onchange = async (e) => {
            edgeFile = (e.target as HTMLInputElement).files[0];

            console.log("file type");
            console.log(edgeFile.name);
            console.log(edgeFile.type);

            fileData.append("csv", edgeFile);

            try {
                await axios.post("/api/loadCSVFile/CSV-Import-Edge", fileData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (err) {
                throw new Error("Error with loading Edges");
            }
        };

        //click input for the user
        inputEdge.click();

    }

    async function exportEdge() {
        const nodeAndEdgeStrings = await axios.get<string[]>("/api/loadCSVFile");

        //save node file
        const edgeFile = new Blob([nodeAndEdgeStrings.data[1]], {
            type: "text/csv",
        });
        const documentSaverEdge = document.createElement("a");
        documentSaverEdge.download = "edge.csv";
        documentSaverEdge.href = window.URL.createObjectURL(edgeFile);

        //click the link to save the file for the user
        documentSaverEdge.click();
    }


    return (
        <div className={"flex justify-center mt-5"}>
            <button
                className={"transition-all hover:bg-navy w-40 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"}
                onClick={inputEdge}>
                Import Edge .csv
            </button>
            <button
                className={"transition-all hover:bg-navy w-40 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"}
                onClick={exportEdge}>
                Export Edge .csv
            </button>
        </div>
    );
}

export default ImportExportEdge;
