import React from "react";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {HTMLInputElement} from "happy-dom";

function ImportExportButtons() {

    //todo clean up - stryder
    async function inputFiles() {
        //Get node file
        const inputNode = document.createElement("input");
        inputNode.type = "file";
        inputNode.accept = "text/csv"; //only take csv files
        let nodeFile: File;
        inputNode.onchange = (e) => {
            nodeFile = (e.target as HTMLInputElement).files[0];

            console.log("file type");
            console.log(nodeFile.name);
            console.log(nodeFile.type);


        };
        //click input for the user
        inputNode.click();

        // get edgefile
        //now get edge file
        const inputEdge = document.createElement("input");
        inputEdge.type = "file";
        inputEdge.accept = "text/csv"; //only take csv files
        let edgeFile: File;

        inputEdge.onchange = async (e) => {
            edgeFile = (e.target as HTMLInputElement).files[0];
            console.log("file type edge");
            console.log(edgeFile.name);
            console.log(edgeFile.type);
            console.log(edgeFile);


            const fileData = new FormData();
            fileData.append("csv", nodeFile);
            fileData.append("csv", edgeFile);
            //send edge and node file to back end

            try {
                await axios.post("/api/loadCSVFile", fileData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (err) {
                throw new Error("Error with loading Nodes");
            }


        };
        //click input for the user
        inputEdge.click();
    }

    //todo clean up - stryder
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
    }

    /*const */

    return (
        <div className={"flex justify-center mt-5"}>
            <button
                className={"transition-all hover:bg-navy w-40 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"}
                onClick={inputFiles}>
                Import .csv
            </button>
            <button
                className={"transition-all hover:bg-navy w-40 text-white p-3 ml-8 bg-navStart rounded-full h-min font-semibold drop-shadow-lg"}
                onClick={exportDataBase}>
                Export Current
            </button>
        </div>
    );
}

export default ImportExportButtons;
