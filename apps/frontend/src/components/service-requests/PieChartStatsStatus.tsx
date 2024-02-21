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

export default PieChartStatsStatus;
