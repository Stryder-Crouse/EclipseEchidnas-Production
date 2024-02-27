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

export type building = {
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
export type buildingStats = {
    shapiro: building,
    tower: building,
    Francis45: building,
    Francis15: building,
    BTM: building
}

export type requestStats = {
    urlToGetStats:string
    urlForBuildingStats:string

}



function PieChartStatsServiceRequest({urlToGetStats,urlForBuildingStats}:requestStats){

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
        getAllStats(urlToGetStats,urlForBuildingStats).then( (result)=>{
            setAssignedStats(result[0] as assignedStats);
            setPrioStats(result[1] as prioStats);
            setBuildingStats(result[2] as buildingStats);
        });
    }, [urlToGetStats,urlForBuildingStats]);
    
    return (
        <div className="flex flex-row justify-evenly m-auto h-full w-full ">
            <PieChartStatsPriority stats={prioStats}></PieChartStatsPriority>
            <PieChartStatsStatus stats={assignedStats}></PieChartStatsStatus>
            <StatsBarChart buildingStats={buildingStats}></StatsBarChart>
        </div>
    );
}

async function getAllStats(urlForSevStats:string,urlForBuildingStats:string) {
    const getAllStats = await axios.get<servStats>(urlForSevStats);

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
    (urlForBuildingStats);

    return [assigned,prioStats,getAllBuildingStats.data];
}

export default PieChartStatsServiceRequest;
