import {Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';

import {buildingStats} from "./PieChartStatsServiceRequest.tsx";


ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);
export type requestStats = {
    buildingStats:buildingStats
}


function StatsBarChartProfile({buildingStats}:requestStats){



    const data = {
        labels: ['Shapiro',
            'Tower',
            '45 Francis',
            '15 Francis',
            'BTM'],
        datasets: [
            {
                data: [buildingStats.shapiro.total,buildingStats.tower.total,buildingStats.Francis45.total
                    ,buildingStats.Francis15.total,buildingStats.BTM.total],
                backgroundColor: ["#0a9396", "#94d2bd", "#e9d8a6", "#ee9b00", "#bb3e03"]
            }
        ]
    };
    const options = {
        elements: {
            bar: {
                borderWidth: 2,
                borderColor: 'white'
            }
        },
        plugins: {
            legend: {
                display: false
            },
        },
        scales: {

            x: {
                grid:{
                    color: ['#898180']
                },
                ticks: {
                    color: ['black'],
                    font: {
                        size: 20
                    }
                }
            },
            y: {
                grid:{
                    color: ['#898180']
                },
                ticks: {
                    color: ['black'],
                    font: {
                        size: 20
                    }
                }
            }
        }
    };
   
    
    return (
        <div className={"mb-4"} style={
            {
                position: "relative", height: "50%",
                width: "100%"
            }}>
            <p className="text-center text-2xl"><b>Request per Building</b></p>



            <div className={""}>
                <Bar data={data} options={options}></Bar>
            </div>

        </div>
    );
}


export default StatsBarChartProfile;
