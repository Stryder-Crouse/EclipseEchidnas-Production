import React, { useState} from "react";
import "../../css/component-css/ServicePage.css";


import NodeTable from "../NodeAndEdgeTable/NodeTable.tsx";
import EdgeTable from "../NodeAndEdgeTable/EdgeTable.tsx";



export default function CsvPageTableContainer() {


    const [curentTable , setCurentTable ] = useState("node");

    return (
        <div className="tabs-container">
            <ul className="tabs">
                <li>
                    <a id={"button_nodes"} title="Node Table" className={"tabButton"} onClick={() => {
                        setCurentTable("node");
                    }}>
                        Node Table
                    </a>
                </li>
                <li>
                    <a id={"button_edge"} title="Edge Table" className={"tabButton"} onClick={() => {
                        setCurentTable("edge");
                    }}>
                        Edge Table
                    </a>
                </li>
                <li>
                    <a id={"button_employee"} title="Employee Table" className={"tabButton"}
                       onClick={() => {
                           setCurentTable("employee");
                       }}>
                        Employee Table
                    </a>
                </li>

            </ul>
            <div className="tab-content-wrapper">
                {/* the content to be populated with each request*/}
                {
                    generateSelectedTable()
                }
            </div>
        </div>
    );

    function generateSelectedTable() {
        // For each div/request to overlay
        switch (curentTable) {
            case "node":
                return <NodeTable></NodeTable>;
            case "edge":
               return <EdgeTable></EdgeTable>;
            case "employee":
               return <div>employee table</div>;
            default:
                return (<div> bad state</div>);

        }

    }


}



