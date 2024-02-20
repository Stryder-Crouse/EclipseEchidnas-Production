import ReligionImage from "../../images/Service Request/religion.png";
import Religious_input from "../service-requests/religious-request/Religious_input.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import "../service-request-cards/popupDiv.css";


export type closeCard =  {
    setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
}


export default function ReligionRequestCard() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    function openReligiousForm() {
        setIsPopupOpen(true);
    }

    function closeReligiousForm(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
        event.preventDefault();
        setIsPopupOpen(false);
    }
    return (
        <div className={"flex mr-12"}>
            <div className="text-black bg-ivoryWhite w-56 h-72 text-center drop-shadow-xl hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all hover:border-t-teal border-t-8" id={"medicineForm"}
                onClick={openReligiousForm}>
                <img src={ReligionImage} alt={"religionImage"} className="scale-90"/>
                <h1 className="font-semibold mt-2">RELIGIOUS</h1>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50" onClick={closeReligiousForm}></div>
            )}

            <div className={`popupForm ${isPopupOpen ? "block" : "hidden"}`} id={"religiousPopupForm"}>
                <Religious_input setIsPopupOpen={setIsPopupOpen}/>
            </div>
        </div>
    );

}
