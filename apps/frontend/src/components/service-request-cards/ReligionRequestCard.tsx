import ReligionImage from "../../images/Service Request/religion.png";

export default function ReligionRequestCard() {

    return (
        <div className={"flex mr-12"}>
            <div

                className="text-black bg-ivoryWhite w-56 h-72 text-center drop-shadow-xl hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all hover:border-t-teal border-t-8"
                id={"medicineForm"}
            >
                <img src={ReligionImage} alt={"religionImage"} className="scale-90"/>
                <h1 className="font-semibold mt-2">RELIGIOUS</h1>
            </div>
        </div>
    );

}
