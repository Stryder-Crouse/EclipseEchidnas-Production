import PieChartStatsPriority from "./PieChartStatsPriority.tsx";
import PieChartStatsStatus from "./PieChartStatsStatus.tsx";

function PieChartStatsServiceRequest(){
    return (
        <div className="flex flex-row h-full w-full">
            <PieChartStatsPriority></PieChartStatsPriority>
            <PieChartStatsStatus></PieChartStatsStatus>
        </div>
    );
}

export default PieChartStatsServiceRequest;
