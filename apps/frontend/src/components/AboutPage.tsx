import SideNavBarComponent, {SideBarItem} from "./SideNavBarComponent.tsx";
import MapIcon from "../images/SideBar/map.png";
import ServiceRequestIcon from "../images/SideBar/requestIcon.png";
import EmployeeIcon from "../images/SideBar/user.png";
import CSVIcon from "../images/SideBar/table.png";
import LogIcon from "../images/SideBar/log-in.png";
import AboutPageIcon from "../images/SideBar/users-round.png";
import SameerPic from "../images/Team/Sameer.jpg";

function AboutPage(){

    return(
        <>
            <div className="flex">
                <div className="flex absolute w-screen h-screen">
                    <SideNavBarComponent>
                        <SideBarItem icon={MapIcon} text="Map" link={window.location.pathname}/>
                        <SideBarItem icon={ServiceRequestIcon} text="Services" link="ServiceRequest"/>
                        <SideBarItem icon={EmployeeIcon} text="Employees" link="/EmployeeTable"/>
                        <SideBarItem icon={CSVIcon} text=".CSV" link="/NodeEdgeTable"/>
                        <SideBarItem icon={AboutPageIcon} text="About" link="/AboutPage"/>
                        <hr className="my-3"/>
                        {/*NEED THIS FIXED OR SUM */}
                        <SideBarItem icon={LogIcon} text="Login" link={"/ServiceRequest"}/>
                    </SideNavBarComponent>
                </div>
            </div>
            <p className="font-bold text-center ...">DEPARTMENT</p>
            <p className="text-center ...">WPI Computer Science Department</p>
            <p className="font-bold text-center ...">COURSE</p>
            <p className="text-center ...">CS3733-C24 Software Engineering</p>
            <p className="font-bold text-center ...">INSTRUCTOR</p>
            <p className="text-center ...">Prof. Wilson Wong</p>
            <p className="font-bold text-center ...">TEAM COACH</p>
            <p className="text-center ...">Joseph Cardarelli</p>
            <p className="font-bold text-center ...">THE TEAM</p>
            <div className="grid grid-cols-5 gap-7">
                <div></div>
                <div>
                    <div className="max-w-sm rounded overflow-hidden shadow-lg">
                        <img className="h-60 w-full " src={SameerPic} alt="Stryder"/>
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2 text-center">Stryder Crouse</div>
                            <p className="text-gray-700 text-base text-center">
                                Team Lead
                            </p>
                        </div>

                    </div>
                </div>
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <img className="h-60 w-full" src={SameerPic} alt="Sunset in the mountains"/>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-center">Grace Philips</div>
                        <p className="text-gray-700 text-base text-center">
                            Assistant Lead
                        </p>
                    </div>

                </div>

                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <img className="h-60 w-full" src={SameerPic} alt="Sunset in the mountains"/>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-center">Chris Lam</div>
                        <p className="text-gray-700 text-base text-center">
                            Assistant Lead
                        </p>
                    </div>

                </div>
                <div></div>
                <div></div>
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <img className="h-60 w-full" src={SameerPic} alt="Sunset in the mountains"/>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-center">Shiivek Agarwal</div>
                        <p className="text-gray-700 text-base text-center">
                            Project Manager
                        </p>
                    </div>

                </div>
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <img className="h-60 w-full" src={SameerPic} alt="Sunset in the mountains"/>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-center">Sameer Augustine</div>
                        <p className="text-gray-700 text-base text-center">
                            Scrum Master
                        </p>
                    </div>

                </div>
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <img className="h-60 w-full" src={SameerPic} alt="Sunset in the mountains"/>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-center">Alana Reid</div>
                        <p className="text-gray-700 text-base text-center">
                            Product Owner
                        </p>
                    </div>

                </div>
                <div></div>
                <div></div>
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <img className="h-60 w-full" src={SameerPic} alt="Sunset in the mountains"/>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-center">Mike Conroy</div>
                        <p className="text-gray-700 text-base text-center">
                            Documentation Analyst
                        </p>
                    </div>

                </div>
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <img className="h-60 w-full" src={SameerPic} alt="Sunset in the mountains"/>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-center">Antonio Aguiar</div>
                        <p className="text-gray-700 text-base text-center">
                            Frontend Engineer
                        </p>
                    </div>

                </div>
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <img className="h-60 w-full" src={SameerPic} alt="Sunset in the mountains"/>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-center">Szymon Mamro</div>
                        <p className="text-gray-700 text-base text-center">
                            Backend Engineer
                        </p>
                    </div>

                </div>
                <div></div>
                <div></div>


            </div>
            <div className="grid grid-cols-6 gap-7">
                <div></div>
                <div></div>
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <img className="h-60 w-full" src={SameerPic} alt="Sunset in the mountains"/>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-center">Ryan Hunter</div>
                        <p className="text-gray-700 text-base text-center">
                            Backend Engineer
                        </p>
                    </div>

                </div>

                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <img className="h-60 w-full" src={SameerPic} alt="Sunset in the mountains"/>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2 text-center">Alex Ramirez</div>
                        <p className="text-gray-700 text-base text-center">
                            Algorithms Engineer
                        </p>
                    </div>

                </div>

            </div>

            <p className="font-bold text-center ...">SPECIAL THANKS</p>
            <p className="text-center ...">A special thank you to Brigham and Women’s Hospital
                for their continued partnership and to Andrew Shin for taking the
                time to come and review the work done by the teams.</p>

            <p className="font-bold text-center ...">COPYRIGHT</p>
            <p className="text-center ...">The Brigham & Women’s Hospital maps and data used in this
                application are copyrighted and provided for the sole use of educational purposes.</p>

        </>

    );
}

export default AboutPage;
