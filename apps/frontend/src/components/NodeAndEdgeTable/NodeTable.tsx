import "../../css/route-css/nodeEdgeTablePage.css";
import axios from "axios";
import { NodeDataBase } from "../../../../../packages/common/src/algorithms/DataBaseClasses/NodeDataBase.ts";
import {useEffect, useState} from "react";


function NodeTable() {

    const [node, setNodes] = useState([] as NodeDataBase[]);

    useEffect(()=>{
        getNodes().then((result) => setNodes(result));
    },[]);

  return (
    <div className={""}>
            <div className={""}>
                <table>
                    <thead>
                        <tr>
                            <th>nodeID</th>
                            <th>xcoord</th>
                            <th>ycoord</th>
                            <th>floor</th>
                            <th>building</th>
                            <th>nodeType</th>
                            <th>longName</th>
                            <th>shortName</th>
                        </tr>
                    </thead>
                    <tbody id={"table-rows-nodes"}>
                        {
                            node.map((node) => {
                                return (
                                    <tr>
                                        <td className={"tableTD"}>{node.nodeID}</td>
                                        <td className={"tableTD"}>{node.xcoord}</td>
                                        <td className={"tableTD"}>{node.ycoord}</td>
                                        <td className={"tableTD"}>{node.floor}</td>
                                        <td className={"tableTD"}>{node.building}</td>
                                        <td className={"tableTD"}>{node.nodeType}</td>
                                        <td className={"tableTD"}>{node.longName}</td>
                                        <td className={"tableTD"}>{node.shortName}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

async function getNodes() {
    const nodeData = await axios.get<NodeDataBase[]>("/api/load-nodes");
    return nodeData.data;
}

export default NodeTable;
