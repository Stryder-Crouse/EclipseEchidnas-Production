
import axios from "axios";
import { NodeDataBase } from "common/src/algorithms/DataBaseClasses/NodeDataBase.ts";
import {useEffect, useState} from "react";



function NodeTable() {

    const [node, setNodes] = useState([] as NodeDataBase[]);

    useEffect(()=>{
        getNodes().then((result) => setNodes(result));
    },[]);

    return (
        <div className="overflow-x-scroll overflow-y-scroll max-w-[80%] rounded-lg">
            <div className={""}>
                <table className={"requestTable "}>
                    <thead>
                        <tr className={"tableTRHead"}>
                            <th className={"tableTD"}>nodeID</th>
                            <th className={"tableTD"}>xcoord</th>
                            <th className={"tableTD"}>ycoord</th>
                            <th className={"tableTD"}>floor</th>
                            <th className={"tableTD"}>building</th>
                            <th className={"tableTD"}>nodeType</th>
                            <th className={"tableTD"}>longName</th>
                            <th className={"tableTD"}>shortName</th>
                        </tr>
                    </thead>
                    <tbody id={"table-rows-nodes"}>
                        {
                            node.map((node) => {
                                return (
                                    <tr className={"tableTR"}>
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
