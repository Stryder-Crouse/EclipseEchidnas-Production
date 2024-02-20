import SanitationImage from "../../images/Service Request/sanitation.png";
import Sanitation_input from "../service-requests/sanitation-request/Sanitation_input.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import "../service-request-cards/popupDiv.css";

export type closeSanitationCard =  {
    setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SanitationRequestCard() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    function openSanitationForm() {
        setIsPopupOpen(true);
    }

    function closeSanitationForm(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
        event.preventDefault();
        setIsPopupOpen(false);
    }
    return (
        <div className={"flex mr-12"}>
            <div className="text-black bg-ivoryWhite w-56 h-72 text-center drop-shadow-xl hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all hover:border-t-teal border-t-8" id={"medicineForm"} onClick={openSanitationForm}>
                <img src={SanitationImage} alt={"sanitationImage"} className="scale-90"/>
                <h1 className="font-semibold mt-2">SANITATION</h1>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50" onClick={closeSanitationForm}></div>
            )}

            <div className={`popupForm ${isPopupOpen ? "block" : "hidden"}`} id={"sanitationPopupForm"}>
                <Sanitation_input setIsPopupOpen={setIsPopupOpen}/>
            </div>
        </div>
    );
}
