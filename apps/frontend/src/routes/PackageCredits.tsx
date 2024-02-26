import {UniversalPackageCredits} from "../components/UniversalPackageCredits.tsx";
import FullSideNavBarComponent from "../components/FullSideNavBarComponent.tsx";
import React from "react";
import Auth0Logo from "../images/packageLogos/Auth0.jpg";
import AxiosLogo from "../images/packageLogos/axios.png";
import ChartJS from "../images/packageLogos/chartjs.png";
import DockerLogo from "../images/packageLogos/docker.png";
import ExpressLogo from "../images/packageLogos/express.png";
import NodeLogo from "../images/packageLogos/nodejs.png";
import PrismaLogo from "../images/packageLogos/prisma.png";
import ReactLogo from "../images/packageLogos/react.png";
import TailwindLogo from "../images/packageLogos/tailwindLogoNew.svg";
import WebstormLogo from "../images/packageLogos/webstorm.png";
import YarnLogo from "../images/packageLogos/yarn.png";

export default function PackageCredits() {
    return (
        <div className={"flex h-lvh flex-row"}>
            <div className="flex">
                <FullSideNavBarComponent/>
            </div>
            <div className="mt-14 flex flex-col m-auto justify-center items-center">
                <p className="mb-1 m-auto flex font-bold text-2xl justify-center p-3 bg-white rounded-lg w-72 shadow ">Package
                    Credits</p>
                <div className="flex flex-row  justify-center scale-95">
                    <div className="grid grid-cols-6 gap-4">

                        <UniversalPackageCredits
                            packageName={"Auth0-React"}
                            packageImage={Auth0Logo}
                            useDescription={
                            "The Auth0-React package was utilized to integrate the Auth0 service with our front end, which we utilized for our login feature."
                        }
                            copyright={"https://medium.com/@jaypatel32157/using-auth0-to-secure-your-react-web-app-2d551d312d1"}
                            link={"https://developer.auth0.com/resources/get-started/spa/react"}
                        />

                        <UniversalPackageCredits
                            packageName={"Axios"}
                            packageImage={AxiosLogo}
                            useDescription={
                            "The Axios package was utilized by the team to send and retrieve data between the front end and the back end of our app."
                        }
                            copyright={"https://medium.com/@selieshjksofficial/an-in-depth-guide-to-axios-making-http-requests-with-ease-6eefa557bb07"}
                            link={"https://axios-http.com/docs/intro"}
                        />

                        <UniversalPackageCredits
                            packageName={"Chart.js"}
                            packageImage={ChartJS}
                            useDescription={"Chart.js was used for all graphs and charts generated on the website."}
                            copyright={"https://alternative.me/chart-js"}
                            link={"https://www.chartjs.org/docs/latest/"}
                        />

                        <UniversalPackageCredits
                            packageName={"Docker"}
                            packageImage={DockerLogo}
                            useDescription={"Docker was used for development to allow developers to easily run the development front-end and back-end"}
                            copyright={"https://tech.osteel.me/posts/docker-for-local-web-development-introduction-why-should-you-care"}
                            link={"https://docs.docker.com/get-started/overview/"}
                        />

                        <UniversalPackageCredits
                            packageName={"Express"}
                            packageImage={ExpressLogo}
                            useDescription={"Express was used to route backend http requests from the front end to the correct back end functions."}
                            copyright={"https://www.guayerd.com/expressjs-logo/"}
                            link={"https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction"}
                        />

                        <UniversalPackageCredits
                            packageName={"Node-Auth0"}
                            packageImage={Auth0Logo}
                            useDescription={"Node-Auth0 was used to integrate the auth0 service into the Node.js back end."}
                            copyright={"https://medium.com/@jaypatel32157/using-auth0-to-secure-your-react-web-app-2d551d312d1"}
                            link={"https://workos.com/docs/migrate/auth0"}
                        />

                        <UniversalPackageCredits
                            packageName={"Node.js"}
                            packageImage={NodeLogo}
                            useDescription={"Node.js was used to run the back end and implement its functionality."}
                            copyright={"https://iconduck.com/icons/27728/node-js"}
                            link={"https://nodejs.org/en/learn/getting-started/introduction-to-nodejs"}
                        />

                        <UniversalPackageCredits
                            packageName={"Prisma"}
                            packageImage={PrismaLogo}
                            useDescription={"Prisma was used to perform queries on the database from the back end."}
                            copyright={"https://vecta.io/symbols/261/databases/35/prisma"}
                            link={"https://www.prisma.io/docs/getting-started"}
                        />

                        <UniversalPackageCredits
                            packageName={"React"}
                            packageImage={ReactLogo}
                            useDescription={"React is a framework that was used to create the front end and its functionality."}
                            copyright={"https://www.cleanpng.com/png-react-javascript-angularjs-ionic-atom-2904925/"}
                            link={"https://react.dev/learn"}
                        />

                        <UniversalPackageCredits
                            packageName={"Tailwind"}
                            packageImage={TailwindLogo}
                            useDescription={"Tailwind is a highly customizable, low-level CSS framework that was used to style the front end."}
                            copyright={"https://commons.wikimedia.org/wiki/File:Tailwind_CSS_Logo.svg"}
                            link={"https://tailwindcss.com/docs/installation"}
                        />

                        <UniversalPackageCredits
                            packageName={"Webstorm"}
                            packageImage={WebstormLogo}
                            useDescription={"Webstorm is the IDE that was used for development."}
                            copyright={"https://commons.wikimedia.org/wiki/File:WebStorm_Icon.svg"}
                            link={"https://www.jetbrains.com/help/webstorm/getting-started-with-webstorm.html"}
                        />

                        <UniversalPackageCredits
                            packageName={"Yarn"}
                            packageImage={YarnLogo}
                            useDescription={"Yarn is an additional Package manager used to install the rest of the packages we used."}
                            copyright={"https://github.com/yarnpkg"}
                            link={"https://yarnpkg.com/getting-started"}
                        />

                    </div>
                </div>

                <footer className="flex m-auto scale-90 w-[90%] justify-center bg-white rounded-lg shadow drop-shadow-xl">
                    <div className="text-center p-4 md:flex md:items-center md:justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            For more details on what each package is and how we utilized it, click on the package you'd like to know more about. Order of cards determined by alphabetical order, not with regard to it's significance to our team's use of the packages.
                        </span>
                    </div>
                </footer>

            </div>
        </div>
    )
        ;
}
