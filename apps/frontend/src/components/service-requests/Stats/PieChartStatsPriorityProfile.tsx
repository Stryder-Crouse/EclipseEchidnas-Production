import {Pie} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { piePrioStats} from "./PieChartStatsAll.tsx";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function PieChartStatsPriorityProfile({stats}:piePrioStats){
    const data = {
        labels: ['Low', 'Medium', 'High', 'Emergency'],
        datasets:[
            {
                label: 'Count',
                data:[stats.lowPrio, stats.medPrio, stats.highPrio, stats.emergPrio],
                backgroundColor: ["#0a9396", "#94d2bd", "#e9d8a6", "#ee9b00"]
            }
        ]
    };
    const options = {
        maintainAspectRatio: false,
        plugins: {

            legend: {
                align: 'center',
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
            <p className="text-center mb-4 text-2xl"><b>Request Priority</b></p>
            {/*// @ts-expect-error asjhdska*/}
            <Pie data={data} title={"Priority"} options={options}></Pie>
        </div>
    );
}

export default PieChartStatsPriorityProfile;
