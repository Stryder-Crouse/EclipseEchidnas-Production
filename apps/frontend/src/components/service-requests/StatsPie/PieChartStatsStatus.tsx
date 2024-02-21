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
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 20,
                        family: "sans-serif"
                    }
                }
            }
        }
    };
    return(
        <div className="flex">
            {/*// @ts-expect-error asjhdska*/}
            <Pie data={data} options={options}></Pie>
        </div>
    );
};

export default PieChartStatsStatus;
