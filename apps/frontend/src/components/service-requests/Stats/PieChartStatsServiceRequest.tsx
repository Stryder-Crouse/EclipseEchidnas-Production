import PieChartStatsPriority from "./PieChartStatsPriority.tsx";
import PieChartStatsStatus from "./PieChartStatsStatus.tsx";
import axios from "axios";
import {prioStats,assignedStats} from "./PieChartStatsAll.tsx";
import {useEffect, useState} from "react";
import StatsBarChart from "./StatsBarChart.tsx";



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
}
function PieChartStatsServiceRequest({urlToGetStats,urlForBuildingStats}:requestStats){

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
        getAllStats(urlToGetStats).then( (result)=>{
            setAssignedStats(result[0] as assignedStats);
            setPrioStats(result[1] as prioStats);
        });
    }, [urlToGetStats]);
    
    return (
        <div className="flex flex-row justify-evenly m-auto h-full w-full ">
            <PieChartStatsPriority stats={prioStats}></PieChartStatsPriority>
            <PieChartStatsStatus stats={assignedStats}></PieChartStatsStatus>
            <StatsBarChart urlForBuildingStats={urlForBuildingStats}></StatsBarChart>
        </div>
    );
}

async function getAllStats(urlToGetStats:string) {
    const getAllStats = await axios.get<servStats>(urlToGetStats);

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


    return [assigned,prioStats];
}

export default PieChartStatsServiceRequest;
