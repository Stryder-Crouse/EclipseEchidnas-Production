// import PieChartStatsPriority from "./PieChartStatsPriority.tsx";
// import PieChartStatsType from "./PieChartStatsType.tsx";
// import PieChartStatsStatus from "./PieChartStatsStatus.tsx";
// import {useEffect, useState} from "react";
//
// import axios from "axios";
//
// export type allStats = {
//
//     total: number,
//     medReq: number,
//     religReq: number,
//     flowReq: number,
//     sanReq: number,
//     tranReq: number,
//     lowPrio: number,
//     medPrio: number,
//     highPrio: number,
//     emergPrio: number,
//     unassigned: number,
//     assigned: number,
//     inProgress: number,
//     completed: number
//
// }
//
// export type prioStats = {
//
//
//     lowPrio: number,
//     medPrio: number,
//     highPrio: number,
//     emergPrio: number
//
//
// }
//
// export type reqStats = {
//
//
//     total: number,
//     medReq: number,
//     religReq: number,
//     flowReq: number,
//     sanReq: number,
//     tranReq: number
//
//
// }
//
// export type assignedStats = {
//
//     unassigned: number,
//     assigned: number,
//     inProgress: number,
//     completed: number
//
// }
//
// export type piePrioStats = {
//     stats:prioStats
// }
//
// export type pieTypeStats = {
//     stats:reqStats
// }
//
// export type pieAssignedStats = {
//     stats:assignedStats
// }
//
// function PieChartStatsAll(){
//
//     const [assignedStats , setAssignedStats ]
//         = useState<assignedStats>(
//         {
//             unassigned: 0,
//             assigned: 0,
//             inProgress: 0,
//             completed: 0
//         }
//     );
//
//     const [reqStats , setReqStats ]
//         = useState<reqStats>(
//         {
//             total: 0,
//             medReq: 0,
//             religReq: 0,
//             flowReq: 0,
//             sanReq: 0,
//             tranReq: 0
//         }
//     );
//
//     const [prioStats , setPrioStats ]
//         = useState<prioStats>(
//         {
//             lowPrio: 0,
//             medPrio: 0,
//             highPrio: 0,
//             emergPrio: 0
//         }
//     );
//
//
//
//     useEffect(() => {
//         getAllStats().then( (result)=>{
//             setAssignedStats(result[0] as assignedStats);
//             setReqStats(result[1] as reqStats);
//             setPrioStats(result[2] as prioStats);
//         });
//     }, []);
//
//     return (
//         <div className="flex justify-evenly m-auto h-full w-full">
//             <PieChartStatsPriority stats={prioStats}></PieChartStatsPriority>
//             <PieChartStatsType stats={reqStats}></PieChartStatsType>
//             <PieChartStatsStatus stats={assignedStats}></PieChartStatsStatus>
//         </div>
//     );
// }
//
// async function getAllStats() {
//     const getAllStats = await axios.get<allStats>("/api/serviceRequests/serviceReq/statistics");
//
//     const allStats = getAllStats.data;
//
//     const assigned:assignedStats ={
//         unassigned: allStats.unassigned,
//         assigned: allStats.assigned,
//         inProgress: allStats.inProgress,
//         completed: allStats.completed
//     };
//
//     const reqStats:reqStats ={
//         total: allStats.total,
//         medReq: allStats.medReq,
//         religReq: allStats.religReq,
//         flowReq: allStats.flowReq,
//         sanReq: allStats.sanReq,
//         tranReq: allStats.tranReq
//     };
//
//     const prioStats:prioStats={
//         lowPrio: allStats.lowPrio,
//         medPrio: allStats.medPrio,
//         highPrio: allStats.highPrio,
//         emergPrio: allStats.emergPrio
//     };
//
//
//     return [assigned,reqStats,prioStats];
// }
//
// export default PieChartStatsAll;

import PieChartStatsPriority from "./PieChartStatsPriority.tsx";
import PieChartStatsStatus from "./PieChartStatsStatus.tsx";
import axios from "axios";
import {prioStats,assignedStats} from "./PieChartStatsAll.tsx";
import {useEffect, useState} from "react";
import StatsBarChart from "./StatsBarChart.tsx";
import {buildingStats} from "./PieChartStatsServiceRequest.tsx";



export type servStats = {
    total: number,
    lowPrio: number,
    medPrio: number,
    highPrio: number,
    emergPrio: number,
    unassigned: number,
    assigned: number,
    inProgress: number,
    completed: number
}

export type requestStats = {
    urlToGetStats:string
    urlForBuildingStats:string
    userEmail:string
}
function PieChartStatsServiceRequest({urlToGetStats,urlForBuildingStats,userEmail}:requestStats){

    const [buildingStats , setBuildingStats ]
        = useState<buildingStats>(
        {
            shapiro: {
                total: 0,
                lowPrio: 0,
                medPrio: 0,
                highPrio: 0,
                emergPrio: 0,
                unassigned: 0,
                assigned: 0,
                inProgress: 0,
                completed: 0
            },
            tower: {
                total: 0,
                lowPrio: 0,
                medPrio: 0,
                highPrio: 0,
                emergPrio: 0,
                unassigned: 0,
                assigned: 0,
                inProgress: 0,
                completed: 0
            },
            Francis45: {
                total: 0,
                lowPrio: 0,
                medPrio: 0,
                highPrio: 0,
                emergPrio: 0,
                unassigned: 0,
                assigned: 0,
                inProgress: 0,
                completed: 0
            },
            Francis15: {
                total: 0,
                lowPrio: 0,
                medPrio: 0,
                highPrio: 0,
                emergPrio: 0,
                unassigned: 0,
                assigned: 0,
                inProgress: 0,
                completed: 0
            },
            BTM: {
                total: 0,
                lowPrio: 0,
                medPrio: 0,
                highPrio: 0,
                emergPrio: 0,
                unassigned: 0,
                assigned: 0,
                inProgress: 0,
                completed: 0
            }
        }
    );

    const [assignedStats , setAssignedStats ]
        = useState<assignedStats>(
        {
            unassigned: 0,
            assigned: 0,
            inProgress: 0,
            completed: 0
        }
    );

    const [prioStats , setPrioStats ]
        = useState<prioStats>(
        {
            lowPrio: 0,
            medPrio: 0,
            highPrio: 0,
            emergPrio: 0
        }
    );

    useEffect(() => {
        getAllStats(urlToGetStats,urlForBuildingStats,userEmail).then( (result)=>{
            setAssignedStats(result[0] as assignedStats);
            setPrioStats(result[1] as prioStats);
            setBuildingStats(result[2] as buildingStats);
        });
    }, [urlToGetStats,urlForBuildingStats,userEmail]);

    return (
        <div className="flex flex-row justify-evenly m-auto h-full w-full ">
            <PieChartStatsPriority stats={prioStats}></PieChartStatsPriority>
            <PieChartStatsStatus stats={assignedStats}></PieChartStatsStatus>
            <StatsBarChart buildingStats={buildingStats}></StatsBarChart>
        </div>
    );
}

async function getAllStats(urlToGetStats:string,urlForBuildingStats:string,email:string) {
    const getAllStats = await axios.get<servStats>(urlToGetStats,{params:{email:email}});

    const servStats = getAllStats.data;

    const assigned:assignedStats ={
        unassigned: servStats.unassigned,
        assigned: servStats.assigned,
        inProgress: servStats.inProgress,
        completed: servStats.completed
    };



    const prioStats:prioStats={
        lowPrio: servStats.lowPrio,
        medPrio: servStats.medPrio,
        highPrio: servStats.highPrio,
        emergPrio: servStats.emergPrio
    };

    const getAllBuildingStats = await axios.get<buildingStats>
    (urlForBuildingStats,{params:{email:email}});

    console.log(getAllBuildingStats.data);

    return [assigned,prioStats,getAllBuildingStats.data];
}

export default PieChartStatsServiceRequest;
