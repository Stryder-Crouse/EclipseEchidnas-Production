import {Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

function StatsBarChart(){
    const data = {
        labels: ['Shapiro',
            'Tower',
            '45 Francis',
            '15 Francis',
            'BTM'],
        datasets: [
            {
                label: 'Requests',
                data: [6, 3, 10, 8, 2],
                backgroundColor: ["#BA1215", "#003a96", "#0C8750", "#FFBA08", "#4F5459"]
            }
        ]
    };
    const options = {
        indexAxis: 'y',
        layout: {
            padding: {
                top: 50
            }
        }
    };
    return (
        <div style={
            {
                display: "flex-row",

            }}>
            <p className="text-center"><b>Request per Building</b></p>
            {/*// @ts-expect-error asjhdska*/}
            <Bar data={data} options={options}></Bar>
        </div>
    );
}

export default StatsBarChart;
