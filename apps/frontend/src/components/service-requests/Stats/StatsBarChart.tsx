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

function StatsBarChart(){

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
        getAllBuildingStats().then((res)=>{
            setStats(res);
        });
    }, []);


    const data = {
        labels: ['Shapiro',
            'Tower',
            '45 Francis',
            '15 Francis',
            'BTM'],
        datasets: [
            {
                label: 'Requests',
                data: [stats.shapiro.total,stats.tower.total,stats.Francis45.total,stats.Francis15.total,stats.BTM.total],
                backgroundColor: ["#BA1215", "#003a96", "#0C8750", "#FFBA08", "#4F5459"]
            }
        ]
    };
    const options = {
        indexAxis: 'y',
        layout: {
            padding: {
                top: 0
            }
        }
    };
    return (
        <div style={
            {
                display: "flex-row",

            }}>
            <p className="text-center"><b>Request per Building</b></p>
            {/*// @ts-expect-error asjhdska*/}
            <Bar data={data} options={options}></Bar>
        </div>
    );
}

async function getAllBuildingStats() {
    const getAllBuildingStats = await axios.get<buildingStats>("/api/serviceRequests/flowReq/building-statistics");
    return getAllBuildingStats.data;
}

export default StatsBarChart;
