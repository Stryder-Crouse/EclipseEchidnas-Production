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

const PieChartStatsType = () => {
    const data = {
        labels: ['Flower', 'Medicine', 'Religious', 'Sanitation', 'Transport'],
        datasets: [
            {
                label: 'Service Request Type',
                data: [3, 8, 10, 5],
                backgroundColor: ["red", "blue", "green", "orange"]
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
export default PieChartStatsType;
