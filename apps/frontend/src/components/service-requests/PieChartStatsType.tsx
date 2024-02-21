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

const PieChartStatsType = () =>{
    const data = {
        labels: ['Flower', 'Medicine', 'Religious', 'Sanitation', 'Transport'],
        datasets:[
            {
                label: 'Service Request Type',
                data:[3, 8, 10, 5],
                backgroundColor: ["red", "blue", "green", "orange"]
            }
        ]
    };
    const options= {

    };
    return(
        <div>
            <Pie data={data} options={options}></Pie>
        </div>
    );
};

export default PieChartStatsType;
