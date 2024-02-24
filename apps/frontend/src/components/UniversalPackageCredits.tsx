import React from "react";
import {useState} from "react";

export interface Credits {
    packageName: string,
    packageImage: string,
    useDescription: string,
    copyright: string,
    link: string,
}

export function UniversalPackageCredits({packageName, packageImage, useDescription, copyright, link}: Credits) {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    function openDescription() {
        setIsPopupOpen(true);
    }

    function closeDescription(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
        event.preventDefault();
        setIsPopupOpen(false);
    }

    return (
        <div>
            <div
                className="w-[10vw] rounded overflow-hidden shadow-lg text-black bg-ivoryWhite text-center drop-shadow-xl
            hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all
            hover:scale-105"
                id={"base"}
                onClick={openDescription}
            >
                <img className="h-fit w-full " src={packageImage} alt="Logo"/>
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2 text-center">{packageName}</div>
                </div>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50" onClick={closeDescription}></div>
            )}

            <div className={`popupForm ${isPopupOpen ? "block" : "hidden"}`} id={"descriptionPopup"}>
                <div
                    className={"grid justify-items-center border rounded-2xl bg-ivoryWhite p-8 font-project w-80"}
                >

                    <div>
                        <img
                            src={packageImage}
                            alt={"Logo"}
                            className={"border border-transparent rounded-lg w-48 my-2"}
                        />
                    </div>

                    <h1
                        className={"font-semibold text-navStart text-2xl underline"}
                    >
                        <a href={link}>{packageName}</a>
                    </h1>

                    <div className={"font-project text-center"}>
                        <p className={"border border-black rounded p-3"}>
                            {useDescription}
                        </p>
                        <p className={"text-sm"}>
                            {copyright}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
