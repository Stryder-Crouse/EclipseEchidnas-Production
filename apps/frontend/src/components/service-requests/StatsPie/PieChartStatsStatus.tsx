import {Pie} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const PieChartStatsStatus = () =>{
    const data = {
        labels: ['Unassigned', 'Assigned', 'In Progress', 'Completed'],
        datasets:[
            {
                label: 'Service Request Type',
                data:[7, 2, 5, 15],
                backgroundColor: ["#BA1215", "#003a96", "#0C8750", "#FFBA08"]
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
            {/*// @ts-expect-error asjhdska*/}
            <Pie data={data} options={options}></Pie>
        </div>
    );
};

export default PieChartStatsStatus;
