
import SpreadsheetImage from "../../images/Service Request/spreadsheetNoBackground.png";
export default function RequestListCard() {
    return (
        <a href={"/RequestList"}>
            <div className={"flex mr-12 "}>
                <div
                    className="text-black bg-ivoryWhite w-56 h-72 text-center drop-shadow-xl hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all hover:border-t-teal border-t-8 rounded-lg"
                    id={"medicineForm"}>
                    <img src={SpreadsheetImage} alt={"spreadsheetImage"} className="scale-90"/>
                    <h1 className="font-semibold mt-2">SEE ALL REQUESTS</h1>
                </div>
            </div>
        </a>
    );
}
