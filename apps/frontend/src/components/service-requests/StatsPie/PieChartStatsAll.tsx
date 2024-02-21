import PieChartStatsPriority from "./PieChartStatsPriority.tsx";
import PieChartStatsType from "./PieChartStatsType.tsx";
import PieChartStatsStatus from "./PieChartStatsStatus.tsx";

function PieChartStatsAll(){
    return (
        <div className="flex flex-row h-full w-full">
            <PieChartStatsPriority></PieChartStatsPriority>
            <PieChartStatsType></PieChartStatsType>
            <PieChartStatsStatus></PieChartStatsStatus>
        </div>
    );
}

export default PieChartStatsAll;
