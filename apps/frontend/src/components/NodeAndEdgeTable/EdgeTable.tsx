import React, {useEffect, useState} from "react";
import { EdgeDataBase } from "../../../../../packages/common/src/algorithms/DataBaseClasses/EdgeDataBase.ts";
import axios from "axios";
import "../../css/route-css/nodeEdgeTablePage.css";




function EdgeTable() {

    const [edges , setEdges  ] = useState([] as EdgeDataBase[]);

    useEffect(()=>{
        getEdges().then((result)=>{
            setEdges(result);
        } );

    },[]);

  return (
    <div className={""}>
      <div className={"flex justify-center"}>
        <table className={"requestTable"} >
          <thead>
            <tr className={"tableTRHead"}>
              <th className={"tableTD"}>edgeID</th>
              <th className={"tableTD"}>startNode</th>
              <th className={"tableTD"}>endNode</th>
            </tr>
          </thead>
          <tbody id={"table-rows-edges"}>
              {
                  edges.map((edge)=>{
                      return (
                          <tr className={"tableTR"}>
                              <td className={"tableTD"}>{edge.edgeID}</td>
                              <td className={"tableTD"}>{edge.startNodeID}</td>
                              <td className={"tableTD"}>{edge.endNodeID}</td>
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

async function getEdges() {
    const edgeData = await axios.get<EdgeDataBase[]>("/api/load-edges");
    return edgeData.data;
}


export default EdgeTable;
