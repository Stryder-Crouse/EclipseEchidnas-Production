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


function StatsBarChart({buildingStats}:requestStats){



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



export default StatsBarChart;
