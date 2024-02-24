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

function PieChartStatsPriority({stats}:piePrioStats){
    const data = {
        labels: ['Low       ', 'Medium        ', 'High         ', 'Emergency'],
        datasets:[
            {
                label: 'Count',
                data:[stats.lowPrio, stats.medPrio, stats.highPrio, stats.emergPrio],
                backgroundColor: ["#BA1215", "#003a96", "#0C8750", "#FFBA08"]
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
            <p className="text-center"><b>Request Priority</b></p>
            {/*// @ts-expect-error asjhdska*/}
            <Pie data={data} title={"Priority"} options={options}></Pie>
        </div>
    );
}

export default PieChartStatsPriority;
