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
        plugins: {


            legend: {
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

    return(
        <div className="flex">
            {/*// @ts-expect-error asjhdska*/}
            <Pie data={data} options={options}></Pie>
        </div>
    );
};

export default PieChartStatsType;
