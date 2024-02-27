import {closeExportOutput} from "./ImportExportButtons.tsx";
import {Employee} from "common/src/algorithms/Employee/Employee.ts";
import axios from "axios";



export default function ExportOutput({setIsExportOpen}: closeExportOutput) {

    function closeExportForm(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
        event.preventDefault();
        setIsExportOpen(false);
    }

    async function exportDataBase() {
        const nodeAndEdgeStrings = await axios.get<string[]>("/api/loadCSVFile");

        const nodeCheck = document.getElementById("node") as HTMLInputElement;
        const edgeCheck = document.getElementById("edge") as HTMLInputElement;
        const employeeCheck = document.getElementById("employee") as HTMLInputElement;

        //save node file
        if(nodeCheck.checked) {
            const nodeFile = new Blob([nodeAndEdgeStrings.data[0]], {
                type: "text/csv",
            });
            const documentSaverNode = document.createElement("a");
            documentSaverNode.download = "node.csv";
            documentSaverNode.href = window.URL.createObjectURL(nodeFile);

            //click the link to save the file for the user
            documentSaverNode.click();
        }

        if(edgeCheck.checked) {
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

        if (employeeCheck.checked) {
            const employeesGetRaw = await axios.get<Employee[]>("/api/employees/employees");
            const employeesGet = employeesGetRaw.data;


            let EmployeeString = "";

            for (const employeesGetElement of employeesGet) {
                //dont output the no one user
                if(employeesGetElement.userName!="No one") {
                    EmployeeString += employeesGetElement.userID + ",";
                    EmployeeString += employeesGetElement.userName + ",";
                    EmployeeString += employeesGetElement.firstName + ",";
                    EmployeeString += employeesGetElement.lastName + ",";
                    EmployeeString += employeesGetElement.designation + ",";
                    EmployeeString += employeesGetElement.isAdmin + "\r\n";
                }
            }

            const employeeFile = new Blob([EmployeeString], {
                type: "text/csv",
            });

            const documentSaveEmployee = document.createElement("a");
            documentSaveEmployee.download = "employee.csv";
            documentSaveEmployee.href = window.URL.createObjectURL(employeeFile);

            documentSaveEmployee.click();
        }

        setIsExportOpen(false);
    }

    return (
        <div className={"mt-3 min-w-min max-w-max bg-ivoryWhite border-2 border-black rounded-2xl p-1 pl-14 pr-14 align-self-center"}>
            <form>
                <h1 className={"grid mb-3 justify-center font-bold text-xl"}>Export Form</h1>
                <h3>Node</h3>
                <div>
                    <input type={"checkbox"} id={"node"}/>
                </div>
                <h3>Edge</h3>
                <div>
                    <input type={"checkbox"} id={"edge"}/>
                </div>
                <h3>Employee</h3>
                <div>
                    <input type={"checkbox"} id={"employee"}/>
                </div>
            </form>


            <div className={"grid justify-center items-center m-auto my-1.5 mb-5"}>
                <button onClick={exportDataBase} className={
                    "bg-tableText p-1 rounded-xl w-24 font-bold cursor-pointer flex justify-center m-auto mb-2 mt-5"}>
                    Submit
                </button>
            </div>
            <div className={"grid justify-center items-center m-auto my-1.5 mb-5"}>
                <button onClick={(event) => closeExportForm(event)} className={
                    "bg-tableText p-1 rounded-xl w-24 font-bold cursor-pointer flex justify-center m-auto mb-2 mt-5"}>
                    Close
                </button>
            </div>
        </div>
    );
}
