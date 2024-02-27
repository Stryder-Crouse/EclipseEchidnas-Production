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

function PieChartStatsStatusProfile ({stats}:pieAssignedStats){
    const data = {
        labels: ['Assigned', 'In Progress'],
        datasets:[
            {
                label: 'Count',
                data:[stats.unassigned, stats.assigned,
                    stats.inProgress, stats.completed],
                backgroundColor: ["#94d2bd", "#ee9b00"]
            }
        ]
    };
    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                align:'center',
                position: 'bottom',
                labels: {
                    color: 'black',
                    font: {
                        size: 20,
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
                width: "50%"
            }}>
            <p className="text-center mb-4 text-2xl"><b>Request Status</b></p>
            {/*// @ts-expect-error asjhdska*/}
            <Pie data={data} options={options}></Pie>
        </div>
    );
}

export default PieChartStatsStatusProfile;
