import FullSideNavBarComponent from "./FullSideNavBarComponent.tsx";
import SameerPic from "../images/Team/Sameer.png";
import ChrisPic from "../images/Team/Chris.png";
import MikePic from "../images/Team/Mike.png";
import RyanPic from "../images/Team/Ryan.png";
import SzymPic from "../images/Team/Szymon.png";
import GracePic from "../images/Team/Grace.png";
import AJPic from "../images/Team/AJ.png";
import AlanaPic from "../images/Team/Alana.png";
import ShiivekPic from "../images/Team/Shiivek.png";
import AlexPic from "../images/Team/Alex.png";
import StryderPic from "../images/Team/Stryder.png";
import WongPic from "../images/Team/Wong.jpg";
import {useState} from "react";

function AboutPage(){
    return(
        <div className={"flex h-lvh flex-row"}>
            <div className="flex">
                <FullSideNavBarComponent/>
            </div>
            <div className="mt-5 flex flex-col m-auto">
                <p className="mb-1 m-auto flex font-bold justify-center p-3 bg-white rounded-lg w-72 shadow ">ABOUT THE DEVELOPERS</p>
                <div className="flex flex-row scale-95">
                    <div className="flex grid grid-cols-6 gap-4">
                        <ImageCard img={StryderPic} name={"Stryder Crouse"} role={"Team Lead"} quote={"test quote"}>
                        </ImageCard>
                        <ImageCard img={GracePic} name={"Grace Philips"} role={"Assistant Lead"} quote={"test quote"}>
                        </ImageCard>
                        <ImageCard img={ChrisPic} name={"Chris Lam"} role={"Assistant Lead"} quote={"test quote"}>
                        </ImageCard>
                        <ImageCard img={ShiivekPic} name={"Shiivek Agarwal"} role={"Project Manager"} quote={"test quote"}>
                        </ImageCard>
                        <ImageCard img={SameerPic} name={"Sameer Augustine"} role={"Scrum Master"} quote={"test quote"}>
                        </ImageCard>
                        <ImageCard img={AlanaPic} name={"Alana Reid"} role={"Product Owner"} quote={"test quote"}>
                        </ImageCard>
                        <ImageCard img={MikePic} name={"Mike Conroy"} role={"Documentation Analyst"} quote={"test quote"}>
                        </ImageCard>
                        <ImageCard img={AJPic} name={"Antonio Aguiar"} role={"Frontend Engineer"} quote={"test quote"}>
                        </ImageCard>
                        <ImageCard img={SzymPic} name={"Szymon Mamro"} role={"Backend Engineer"} quote={"test quote"}>
                        </ImageCard>
                        <ImageCard img={RyanPic} name={"Ryan Hunter"} role={"Backend Engineer"} quote={"test quote"}>
                        </ImageCard>
                        <ImageCard img={AlexPic} name={"Alex Ramirez"} role={"Algorithms Engineer"} quote={"test quote"}>
                        </ImageCard>
                        <ImageCard img={WongPic} name={"Wilson Wong"} role={"Professor"} quote={"test quote"}>
                        </ImageCard>
                    </div>
                    <div
                        className="flex justify-center flex-col ml-4 h-332 w-[200px] p-4 border-4 rounded overflow-hidden shadow-lg text-black bg-ivoryWhite text-center drop-shadow-xl  border-ivoryWhite cursor-pointer">
                        {/*<h1 className="flex font-bold justify-center">ABOUT</h1>*/}
                        <p className="flex font-bold justify-center">DEPARTMENT</p>
                        <p className="flex text-center justify-center">WPI Computer Science Department</p>
                        <p className="flex font-bold justify-center">COURSE</p>
                        <p className="flex justify-center text-center">CS3733-C24 Software Engineering</p>
                        <p className="flex font-bold justify-center">INSTRUCTOR</p>
                        <p className="flex justify-center">Prof. Wilson Wong</p>
                        <p className="flex font-bold justify-center">TEAM COACH</p>
                        <p className="flex justify-center">Joseph Cardarelli</p>
                        <p className="flex font-bold justify-center">SPECIAL THANKS</p>
                        <p className="flex justify-center text-center">A special thank you to Brigham and Women’s Hospital
                            for their continued partnership with WPI and to Andrew Shin for taking the
                            time to come and review the work completed by all the teams.</p>
                    </div>
                </div>
                <footer className="scale-95 justify-center bg-white rounded-lg shadow drop-shadow-xl">
                    <div className="text-center p-4 md:flex md:items-center md:justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            © The Brigham & Women’s Hospital maps and data used in this
                            application are copyrighted and provided for the sole use of educational purposes.
                        </span>
                    </div>
                </footer>

            </div>
        </div>
    );
}

export type imageProps = {
    img: string, name: string, role: string, quote: string,
}

export function ImageCard({img, name, role, quote}: imageProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="w-[10vw] rounded overflow-hidden shadow-lg text-black bg-ivoryWhite text-center drop-shadow-xl
            hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all
            hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>

            <div className={`bg-gray-800 bg-opacity-50 p-3 rounded-lg absolute bottom-[9rem] left-0 w-full ${isHovered ? 'block' : 'hidden'}`} style={{ marginTop: "calc(100% - 2rem)" }}>
                <p className="text-white">{quote}</p>
            </div>
            <img className="h-fit w-full " src={img} alt="Stryder"/>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-center">{name}</div>
                <p className="text-gray-700 text-base text-center">
                    {role}
                </p>
            </div>
        </div>

    );
}


export default AboutPage;
