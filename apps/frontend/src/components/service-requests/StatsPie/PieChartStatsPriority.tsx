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

const PieChartStatsPriority = () =>{
    const data = {
        labels: ['Low       ', 'Medium    ', 'High', 'Emergency'],
        datasets:[
            {
                label: 'Priority',
                data:[10, 15, 5, 2],
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
            {/*// @ts-expect-error asjhdska*/}
            <Pie data={data} options={options}></Pie>
        </div>
    );
};

export default PieChartStatsPriority;
