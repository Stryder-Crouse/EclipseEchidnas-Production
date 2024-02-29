import React, {useEffect, useState} from "react";
import { EdgeDataBase } from "common/src/algorithms/DataBaseClasses/EdgeDataBase.ts";
import axios from "axios";





function EdgeTable() {

    const [edges , setEdges  ] = useState([] as EdgeDataBase[]);

    useEffect(()=>{
        getEdges().then((result)=>{
            setEdges(result);
        } );

    },[]);

  return (
    <div className={"overflow-x-scroll overflow-y-scroll rounded-lg"}>
      <div className={"flex justify-center rounded-lg"}>
        <table className={"requestTable rounded-lg"} >
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
