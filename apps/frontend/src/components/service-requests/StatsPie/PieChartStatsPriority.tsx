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
        labels: ['Low', 'Medium', 'High', 'Emergency'],
        datasets:[
            {
                label: 'Priority',
                data:[10, 15, 5, 2],
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

export default PieChartStatsPriority;
