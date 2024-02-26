import {Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';
import axios from "axios";
import {useEffect, useState} from 'react';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);
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
    urlForBuildingStats:string
}


function StatsBarChart({urlForBuildingStats}:requestStats){

    const [stats , setStats ]
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

    useEffect(() => {
        getAllBuildingStats(urlForBuildingStats).then((res)=>{
            setStats(res);
        });
    }, [urlForBuildingStats]);


    const data = {
        labels: ['Shapiro',
            'Tower',
            '45 Francis',
            '15 Francis',
            'BTM'],
        datasets: [
            {
                data: [stats.shapiro.total,stats.tower.total,stats.Francis45.total,stats.Francis15.total,stats.BTM.total],
                backgroundColor: ["#0a9396", "#94d2bd", "#e9d8a6", "#ee9b00", "#bb3e03"]
            }
        ]
    };
    const options = {
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false
            },
        },
        layout: {
            padding: {
            }
        }
    };
   
    
    return (
        <div className={""} style={
            {}}>
            <p className="text-center"><b>Request per Building</b></p>
            <div className="canvas-container">
                <canvas width="150" height="100"></canvas>
            </div>


            <div className={"scale-90"}>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-expect-error */}
                <Bar data={data} options={options}></Bar>
            </div>

        </div>
    );
}

async function getAllBuildingStats(url: string) {
    const getAllBuildingStats = await axios.get<buildingStats>(url);
    return getAllBuildingStats.data;
}

export default StatsBarChart;
