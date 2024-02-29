import {Pie} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { pieTypeStats} from "./PieChartStatsAll.tsx";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function PieChartStatsType({stats}:pieTypeStats){
    const data = {
        labels: ['Flower', 'Medicine', 'Religious', 'Sanitation', 'Transport'],
        datasets: [
            {
                label: 'Count',
                data: [stats.flowReq, stats.medReq, stats.religReq, stats.sanReq, stats.tranReq],
                backgroundColor: ["#0a9396", "#94d2bd", "#e9d8a6", "#ee9b00", "#bb3e03"]
            }
        ]
    };
    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                align: 'start',
                position: 'bottom',
                labels: {
                    font: {
                        size: 16,
                        family: "sans-serif"
                    }
                }
            }
        }
    };
    return (
        <div style={
            {
                position: "relative", height: "90%",
                width: "30%"
            }}>
            <p className="text-center"><b>Request Type</b></p>
            {/*// @ts-expect-error asjhdska*/}
            <Pie data={data} options={options}></Pie>
        </div>
    );
}

export default PieChartStatsType;
