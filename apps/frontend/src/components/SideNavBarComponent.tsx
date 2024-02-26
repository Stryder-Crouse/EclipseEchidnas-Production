// SideNavBarComponent.tsx
import React, { ReactNode, useState, createContext, useContext } from 'react';
import ChevronFirst from "../images/SideBar/chevron-first.png";
import Logo from "../images/SideBar/navbarLogo.png";
import ChevronLast from "../images/SideBar/chevron-last.png";

interface SidebarContextProps {
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

interface SideNavBarProps {
    children: ReactNode;
}

export default function SideNavBarComponent({ children }: SideNavBarProps): JSX.Element {
    const [expanded, setExpanded] = useState(true);

    return (
        <aside className="h-screen z-10">
            <nav className="h-full flex flex-col bg-navStart border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center mt-2 -mb-4">
                    <a href={"/"}>
                        <img src={Logo} alt={"Mass General Brigham Women's Hospital"}
                             className={`overflow-hidden scale-110 transition-all ${expanded ? "w-32 ml-4" : "w-0"}`}/>
                    </a>
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-1.5 -mr-1 rounded-lg bg-gray-50 hover:bg-gray-100 drop-shadow-lg"
                        style={{width: '40px', height: '40px'}} // Adjust the width and height as needed
                    >
                        {expanded ? <img src={ChevronFirst} alt={"ChevronFirst"}/> :
                            <img src={ChevronLast} alt={"ChevronLast"}/>}
                    </button>
                </div>

                <SidebarContext.Provider value={{expanded, setExpanded}}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>
            </nav>
        </aside>
    );
}

interface SideBarItemProps {
    icon: string;
    text: string;
    link: string;
    onClick?: () => void;
}

export function SideBarItem({icon, text, link, onClick}: SideBarItemProps): JSX.Element {

    const { expanded } = useContext(SidebarContext) || { expanded: true, setExpanded: () => {/* Empty function for default value */} };


    return (
        <a href={link} className="flex mb-8 mt-8 cursor-pointer transition-colors group hover:bg-navy rounded-md"
           onClick={onClick}>
            <li className="relative flex items-center py-2 px-3 my-1 font-medium">
                <img src={icon} alt={"Map Icon"} className={"absolute"}
                     style={{width: expanded ? '24' : '24', height: '24px'}}/>
                <span
                    className={`text-white overflow-hidden transition-all ${expanded ? "w-36 ml-8" : "w-0"}`}>{text}</span>
                {!expanded && (
                    <div
                        className={'absolute left-full rounded-md px-2 py-1 ml-6 bg-ivoryWhite text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0'}>
                        {text}
                    </div>
                )}
        </li>
        </a>
    );
}

