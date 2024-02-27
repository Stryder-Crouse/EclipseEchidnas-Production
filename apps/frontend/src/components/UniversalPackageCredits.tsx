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
        <div className={"border-black"}>
            <div
                className="w-40 h-56 rounded overflow-hidden shadow-lg text-black bg-ivoryWhite text-center drop-shadow-xl
            hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all
            hover:scale-105"
                id={"base"}
                onClick={openDescription}
            >
                <div className={"w-full flex justify-center bg-white"}>
                    <img className="h-32 border-black" src={packageImage} alt="Logo"/>
                </div>
                <div className="px-6 py-4 flex-column col-1  justify-center h-24 w-40">
                    <p className="font-bold text-xl  text-center align-middle m-auto">{packageName}</p>
                </div>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 z-50" onClick={closeDescription}></div>
            )}

            <div className={`popupForm ${isPopupOpen ? "block" : "hidden"}`} id={"descriptionPopup"}>
                <a href={link} target= "_blank" className="flex items-center justify-center">
                    <div className="flex items-center justify-center p-8">
                        <div
                            className="flex flex-col gap-3 items-center justify-center border border-black rounded-2xl bg-ivoryWhite p-8 font-project w-80">

                            <div className="w-48 h-48 flex items-center justify-center">
                                <img
                                    src={packageImage}
                                    alt="Logo"
                                    className="object-contain w-full h-full bg-white border border-transparent rounded-lg"
                                />
                            </div>


                            <h1 className="font-semibold text-navStart text-2xl my-1">{packageName}</h1>

                            <p className="border border-black rounded p-2">{useDescription}</p>
                            <p className="text-[0.625rem]">{copyright}</p>
                        </div>
                    </div>


                    {/*<div className="flex items-center justify-center h-screen">*/}
                    {/*    <div*/}
                    {/*        className={"grid justify-items-center border border-black rounded-2xl bg-ivoryWhite p-8 font-project w-80 "}*/}
                    {/*    >*/}
                    {/*        <div>*/}
                    {/*            <img*/}
                    {/*                src={packageImage}*/}
                    {/*                alt={"Logo"}*/}
                    {/*                className={"bg-white border border-transparent rounded-lg w-48 my-1"}*/}
                    {/*            />*/}
                    {/*        </div>*/}

                    {/*        <h1*/}
                    {/*            className={"font-semibold text-navStart text-2xl my-1"}*/}
                    {/*        >*/}
                    {/*            {packageName}*/}
                    {/*        </h1>*/}

                    {/*        <div className={"font-project text-center"}>*/}
                    {/*            <p className={"border border-black rounded p-2 my-1"}>*/}
                    {/*                {useDescription}*/}
                    {/*            </p>*/}
                    {/*            <p className={"text-xs my-1"}>*/}
                    {/*                {copyright}*/}
                    {/*            </p>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </a>
            </div>
        </div>
    );
}
