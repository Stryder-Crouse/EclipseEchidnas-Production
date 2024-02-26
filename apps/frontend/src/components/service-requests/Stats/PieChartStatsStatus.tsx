import {Pie} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { pieAssignedStats} from "./PieChartStatsAll.tsx";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function PieChartStatsStatus ({stats}:pieAssignedStats){
    const data = {
        labels: ['Unassigned', 'Assigned', 'In Progress', 'Completed'],
        datasets:[
            {
                label: 'Count',
                data:[stats.unassigned, stats.assigned,
                    stats.inProgress, stats.completed],
                backgroundColor: ["#0a9396", "#94d2bd", "#e9d8a6", "#ee9b00"]
            }
        ]
    };
    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                align:'start',
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
            <p className="text-center"><b>Request Status</b></p>
            {/*// @ts-expect-error asjhdska*/}
            <Pie data={data} options={options}></Pie>
        </div>
    );
}

export default PieChartStatsStatus;
