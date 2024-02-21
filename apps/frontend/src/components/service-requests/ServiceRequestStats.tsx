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
        labels: ['Request Type', 'Priority', 'Status'],
        datasets:[
            {
                label: 'RandomBS1',
                data:[100, 200, 300],
                backgroundColor: ["red", "blue", "green"]
            },
            {
                label: 'RandomBS2',
                data:[100, 200, 300],
                backgroundColor: ["yellow", "purple", "cyan"]

            },
            {
                label: 'RandomBS3',
                data:[100, 200, 300],
                backgroundColor: ["green", "orange", "red"]
            }
        ]
    };
    const options= {
        indexAxis: 'y',
        scales:{
            x:{
                stacked:true
            },
            y:{
                stacked:true
            }
        }
    };



    return(
        <div>
            { /* @ts-expect-error fdsfsd*/}
            <Bar data={data} options={options}></Bar>
        </div>
    );
};

export default ServiceRequestStats;
