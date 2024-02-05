import { Map } from "../components/map/Map.tsx";
import "../css/route-css/newMapPage.css";
import AdminPageNavBar from "../components/navigation-bar/AdminPageNavBar.tsx";

function NewMapPage() {
    return (
        //TODO BNBN implement backend feature to populate SELECTS for each floor node/edge
        //located in div "sidenav" , id for each is under each select

        //TODO BNBN implement toggle function to reset selected node


        <div className={"newMapPage-container"}>
            <AdminPageNavBar/>
            <div className={"wholeNewMapPageBody"}>
                <div className={"sidenav"}>
                    <div className={"sidenav-elements"}>
                        {/* Level 1 */}
                        <select name={"level1"} className={"selection-buttons"} id={"levelOne"}>
                            <option value="" disabled selected>Level One</option>
                        </select>

                        {/* Level 2 */}
                        <select name={"level2"} className={"selection-buttons"} id={"levelTwo"}>
                            <option value="" disabled selected>Level Two</option>
                        </select>

                        {/* Level 3 */}
                        <select name={"level3"} className={"selection-buttons"} id={"levelThree"}>
                            <option value="" disabled selected>Level Three</option>
                        </select>

                        {/* Level 4 */}
                        <select name={"level4"} className={"selection-buttons"} id={"levelFour"}>
                            <option value="" disabled selected>Level Four</option>
                        </select>

                        {/* Level 5 */}
                        <select name={"level5"} className={"selection-buttons"} id={"levelFive"}>
                            <option value="" disabled selected>Level Five</option>
                        </select>

                        {/* Level 6 */}
                        <select name={"level6"} className={"selection-buttons"} id={"levelSix"}>
                            <option value="" disabled selected>Level Six</option>
                        </select>

                        {/* THIS BUTTON NEEDS TO BNBN RESET */}
                        <button className={"reset-location-button"}>Reset Current Location</button>
                    </div>


                </div>
                <div className={"mapSide"}>
                    <Map/>
                    <div className={"start-end-typing-navigation"}>
                        <label className={"mapSide-label"}>
                        START AT: <input type={"text"} className={"newMapPage-input-fields"}/>
                        </label>
                        <label className={"mapSide-label"}>
                            END AT: <input type={"text"} className={"newMapPage-input-fields"}/>
                        </label>

                        {/* BNBN NEED TO CONNECT THIS TO NODES */}
                        <div className={"button-div"}>
                            <button className={"go-button"}>GO!</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default NewMapPage;
