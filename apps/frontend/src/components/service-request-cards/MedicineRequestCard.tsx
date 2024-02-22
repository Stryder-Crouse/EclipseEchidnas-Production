import "../service-request-cards/popupDiv.css";
import MedicineImage from "../../images/Service Request/medicine.png";
import Medicine_input from "../service-requests/medicine-request/Medicine_input.tsx";
import {Dispatch, SetStateAction, useState} from "react";

export type closeMedicineCard =  {
    setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
}

function MedicineRequestCard() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    function openMedicineForm() {
        setIsPopupOpen(true);
    }
    function closeMedicineForm(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
        event.preventDefault();
        setIsPopupOpen(false);
    }

    return (
        <div className={"flex mr-12 "}>
            <div
                onClick={openMedicineForm}
                className="text-black rounded-lg bg-ivoryWhite w-56 h-72 text-center drop-shadow-xl hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all hover:border-t-teal border-t-8"
                id={"medicineForm"}
            >
                <img src={MedicineImage} alt={"medicineImage"} className="scale-90"/>
                <h1 className="font-semibold mt-2">MEDICINE</h1>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50" onClick={closeMedicineForm}></div>
            )}

            <div className={`popupForm ${isPopupOpen ? "block" : "hidden"}`} id={"sanitationPopupForm"}>
                <Medicine_input setIsPopupOpen={setIsPopupOpen}/>
            </div>
        </div>
    );
}

export default MedicineRequestCard;


