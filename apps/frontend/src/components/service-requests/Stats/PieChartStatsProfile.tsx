import axios from "axios";
import {prioStats,assignedStats} from "./PieChartStatsAll.tsx";
import {useEffect, useState} from "react";
import {buildingStats} from "./PieChartStatsServiceRequest.tsx";
import StatsBarChartProfile from "./StatsBarChartProfile.tsx";
import PieChartStatsPriorityProfile from "./PieChartStatsPriorityProfile.tsx";
import PieChartStatsStatusProfile from "./PieChartStatsStatusProfile.tsx";


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
        <div className="flex flex-col justify-evenly m-auto h-full w-full ">
            <div className="flex flex-row h-[50%]">
                <PieChartStatsPriorityProfile stats={prioStats}></PieChartStatsPriorityProfile>
                <PieChartStatsStatusProfile stats={assignedStats}></PieChartStatsStatusProfile>
            </div>
            <StatsBarChartProfile buildingStats={buildingStats}></StatsBarChartProfile>
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
