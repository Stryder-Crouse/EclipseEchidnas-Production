import PieChartStatsPriority from "./PieChartStatsPriority.tsx";
import PieChartStatsType from "./PieChartStatsType.tsx";
import PieChartStatsStatus from "./PieChartStatsStatus.tsx";
import {useEffect, useState} from "react";

import axios from "axios";

export type allStats = {

    total: number,
    medReq: number,
    religReq: number,
    flowReq: number,
    sanReq: number,
    tranReq: number,
    lowPrio: number,
    medPrio: number,
    highPrio: number,
    emergPrio: number,
    unassigned: number,
    assigned: number,
    inProgress: number,
    completed: number

}

export type prioStats = {


    lowPrio: number,
    medPrio: number,
    highPrio: number,
    emergPrio: number


}

export type reqStats = {


    total: number,
    medReq: number,
    religReq: number,
    flowReq: number,
    sanReq: number,
    tranReq: number


}

export type assignedStats = {

    unassigned: number,
    assigned: number,
    inProgress: number,
    completed: number

}

export type piePrioStats = {
    stats:prioStats
}

export type pieTypeStats = {
    stats:reqStats
}

export type pieAssignedStats = {
    stats:assignedStats
}

function PieChartStatsAll(){

    const [assignedStats , setAssignedStats ]
        = useState<assignedStats>(
        {
            unassigned: 0,
            assigned: 0,
            inProgress: 0,
            completed: 0
        }
    );

    const [reqStats , setReqStats ]
        = useState<reqStats>(
        {
            total: 0,
            medReq: 0,
            religReq: 0,
            flowReq: 0,
            sanReq: 0,
            tranReq: 0
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
        getAllStats().then( (result)=>{
            setAssignedStats(result[0] as assignedStats);
            setReqStats(result[1] as reqStats);
            setPrioStats(result[2] as prioStats);
        });
    }, []);

    return (
        <div className="flex  flex-row justify-evenly m-auto h-full w-full">
            <PieChartStatsPriority stats={prioStats}></PieChartStatsPriority>
            <PieChartStatsType stats={reqStats}></PieChartStatsType>
            <PieChartStatsStatus stats={assignedStats}></PieChartStatsStatus>
        </div>
    );
}

async function getAllStats() {
    const getAllStats = await axios.get<allStats>("/api/serviceRequests/serviceReq/statistics");

    const allStats = getAllStats.data;

    const assigned:assignedStats ={
        unassigned: allStats.unassigned,
        assigned: allStats.assigned,
        inProgress: allStats.inProgress,
        completed: allStats.completed
    };

    const reqStats:reqStats ={
        total: allStats.total,
        medReq: allStats.medReq,
        religReq: allStats.religReq,
        flowReq: allStats.flowReq,
        sanReq: allStats.sanReq,
        tranReq: allStats.tranReq
    };

    const prioStats:prioStats={
        lowPrio: allStats.lowPrio,
        medPrio: allStats.medPrio,
        highPrio: allStats.highPrio,
        emergPrio: allStats.emergPrio
    };


    return [assigned,reqStats,prioStats];
}

export default PieChartStatsAll;
