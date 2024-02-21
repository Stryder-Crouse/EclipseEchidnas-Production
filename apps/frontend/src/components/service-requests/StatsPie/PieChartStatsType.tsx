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
                backgroundColor: ["#BA1215", "#003a96", "#0C8750", "#FFBA08", "#4F5459"]
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
            {/*// @ts-expect-error asjhdska*/}
            <Pie data={data} options={options}></Pie>
        </div>
    );
}
export default PieChartStatsType;
