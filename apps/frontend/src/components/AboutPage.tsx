import SideNavBarComponent, {SideBarItem} from "./SideNavBarComponent.tsx";
import MapIcon from "../images/SideBar/map.png";
import ServiceRequestIcon from "../images/SideBar/requestIcon.png";
import EmployeeIcon from "../images/SideBar/user.png";
import CSVIcon from "../images/SideBar/table.png";
import LogIcon from "../images/SideBar/log-in.png";
import AboutPageIcon from "../images/SideBar/users-round.png";
import SameerPic from "../images/Team/Sameer.png";
import ChrisPic from "../images/Team/Chris.png";
import MikePic from "../images/Team/Mike.png";
import RyanPic from "../images/Team/Ryan.png";
import SzymPic from "../images/Team/Szymon.png";
import GracePic from "../images/Team/Grace.png";
import AJPic from "../images/Team/AJ.png";
import AlanaPic from "../images/Team/Alana.png";
import ShiivekPic from "../images/Team/Shiivek.jpg";
import AlexPic from "../images/Team/Alex.png";
import StryderPic from "../images/Team/Stryder.png";
import WongPic from "../images/Team/Wong.jpg";

function AboutPage(){
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const myStyle = {
            backgroundImage:
                "url('https://lithespeed.com/wp-content/uploads/2021/04/testimonial-bg.jpg')",
            height: "100vh",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
        };
    return(
        <div className={"flex h-lvh flex-row"}>

            <div className="flex">
                <div className="z-10">
                    <SideNavBarComponent>
                        <SideBarItem icon={MapIcon} text="Map" link={window.location.pathname}/>
                        <SideBarItem icon={ServiceRequestIcon} text="Services" link="ServiceRequest"/>
                        <SideBarItem icon={EmployeeIcon} text="Employees" link="/EmployeeTable"/>
                        <SideBarItem icon={CSVIcon} text=".CSV" link="/NodeEdgeTable"/>
                        <SideBarItem icon={AboutPageIcon} text="About" link="/AboutPage"/>
                        <hr className="my-3"/>
                        <SideBarItem icon={LogIcon} text="Login" link={"/ServiceRequest"}/>
                    </SideNavBarComponent>
                </div>
            </div>
            <div className="flex flex-col m-auto">
                <p className="flex font-bold text-center">THE TEAM</p>
                <div className="flex flex-row">
                    <div className="flex grid grid-cols-6 gap-4">
                        <ImageCard img={StryderPic} name={"Stryder Crouse"} role={"Team Lead"}>
                        </ImageCard>
                        <ImageCard img={GracePic} name={"Grace Philips"} role={"Assistant Lead"}>
                        </ImageCard>
                        <ImageCard img={ChrisPic} name={"Chris Lam"} role={"Assistant Lead"}>
                        </ImageCard>
                        <ImageCard img={ShiivekPic} name={"Shiivek Agarwal"} role={"Project Manager"}>
                        </ImageCard>
                        <ImageCard img={SameerPic} name={"Sameer Augustine"} role={"Scrum Master"}>
                        </ImageCard>
                        <ImageCard img={AlanaPic} name={"Alana Reid"} role={"Product Owner"}>
                        </ImageCard>
                        <ImageCard img={MikePic} name={"Mike Conroy"} role={"Documentation Analyst"}>
                        </ImageCard>
                        <ImageCard img={AJPic} name={"Antonio Aguiar"} role={"Frontend Engineer"}>
                        </ImageCard>
                        <ImageCard img={SzymPic} name={"Szymon Mamro"} role={"Backend Engineer"}>
                        </ImageCard>
                        <ImageCard img={RyanPic} name={"Ryan Hunter"} role={"Backend Engineer"}>
                        </ImageCard>
                        <ImageCard img={AlexPic} name={"Alex Ramirez"} role={"Algorithms Engineer"}>
                        </ImageCard>
                        <ImageCard img={WongPic} name={"Wilson Wong"} role={"Professor"}>
                        </ImageCard>
                    </div>
                    <div
                        className="flex justify-center flex-col m-4 h-332 w-[200px] p-4 border-4">
                        <h1 className=" flex font-bold text-center ...">ABOUT</h1>
                        <p className="flex font-bold text-center ...">DEPARTMENT</p>
                        <p className="flex text-center ...">WPI Computer Science Department</p>
                        <p className="flex font-bold text-center ...">COURSE</p>
                        <p className="flex text-center ...">CS3733-C24 Software Engineering</p>
                        <p className="flex font-bold text-center ...">INSTRUCTOR</p>
                        <p className="flex text-center ...">Prof. Wilson Wong</p>
                        <p className="flex font-bold text-center ...">TEAM COACH</p>
                        <p className="flex text-center ...">Joseph Cardarelli</p>
                        <p className="flex font-bold text-center ...">SPECIAL THANKS</p>
                        <p className="flex text-center ...">A special thank you to Brigham and Women’s Hospital
                            for their continued partnership and to Andrew Shin for taking the
                            time to come and review the work done by the teams.</p>
                    </div>
                </div>
                <footer className="align-self-end bg-white rounded-lg shadow m-4 dark:bg-gray-800">
                    <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                    <span className="text-center text-sm text-gray-500 sm:text-center dark:text-gray-400">
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
    img: string, name: string, role: string
}

export function ImageCard({img, name, role}: imageProps) {

    return (
        <div
            className="w-[10vw] rounded overflow-hidden shadow-lg text-black bg-ivoryWhite text-center drop-shadow-xl hover:border-b-teal border-b-8 border-ivoryWhite cursor-pointer transition-all">
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
