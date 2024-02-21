import React from 'react';
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

const ServiceRequestStats = () =>{
    const data = {
        labels: ['Mon', 'Tue', 'Wed'],
        datasets:[
            {
                label: 'Branch',
                data:[100, 200, 300],
                backgroundColor: '#61DBFB'
            }
        ]
    };
    const options= {
        indexAxis: 'y'
    };



    return(
        <div>
            { /* @ts-expect-error fdsfsd*/}
            <Bar data={data} options={options}></Bar>
        </div>
    );
};

export default ServiceRequestStats;
