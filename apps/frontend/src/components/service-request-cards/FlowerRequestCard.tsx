import FlowersImage from "../../images/Service Request/flowers.png";
import {Dispatch, SetStateAction, useState} from "react";
import "../service-request-cards/popupDiv.css";
import Flower_input from "../service-requests/flower-request/Flower_input.tsx";

export type closeFlowerCard =  {
    setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FlowerRequestCard() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    function openFlowerForm() {
        setIsPopupOpen(true);
    }

    function closeFlowerForm(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
        event.preventDefault();
        setIsPopupOpen(false);
    }
    return (
        <div className={"flex mr-12"}>
            <div
                className="text-black bg-ivoryWhite w-56 h-72 text-center drop-shadow-xl hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all hover:border-t-teal border-t-8"
                id={"medicineForm"} onClick={openFlowerForm}>
                <img src={FlowersImage} alt={"flowersImage"} className="scale-90"/>
                <h1 className="font-semibold mt-2">FLOWERS</h1>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50" onClick={closeFlowerForm}></div>
            )}

            <div className={`popupForm ${isPopupOpen ? "block" : "hidden"}`} id={"sanitationPopupForm"}>
                <Flower_input setIsPopupOpen={setIsPopupOpen}/>
            </div>
        </div>
    );
}
