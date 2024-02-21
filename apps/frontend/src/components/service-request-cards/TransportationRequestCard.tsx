import TransportationImage from "../../images/Service Request/ambulance.png";
import Transportation_Input from "../service-requests/transportation-outside-request/Transportation_Input.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import "../service-request-cards/popupDiv.css";

export type closeTransportCard =  {
    setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
}

export default function TransportationRequestCard() {

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    function openTransportForm() {
        setIsPopupOpen(true);
    }

    function closeTransportForm(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
        event.preventDefault();
        setIsPopupOpen(false);
    }
    return (
        <div className={"flex mr-12"}>
            <div className="text-black rounded-lg bg-ivoryWhite w-56 h-72 text-center drop-shadow-xl hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all hover:border-t-teal border-t-8" id={"medicineForm"} onClick={openTransportForm}>
                <img src={TransportationImage} alt={"transportationImage"} className="scale-90"/>
                <h1 className="font-semibold mt-2">TRANSPORT</h1>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50" onClick={closeTransportForm}></div>
            )}

            <div className={`popupForm ${isPopupOpen ? "block" : "hidden"}`} id={"transportationPopupForm"}>
                <Transportation_Input setIsPopupOpen={setIsPopupOpen}/>
            </div>
        </div>
    );
}
