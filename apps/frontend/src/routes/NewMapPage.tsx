import { Map } from "../components/map/Map.tsx";
import "../css/route-css/newMapPage.css";
import AdminPageNavBar from "../components/navigation-bar/AdminPageNavBar.tsx";
import LocationsDropDown from "../components/navigation-bar/LocationsDropDown.tsx";

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
                        {/* Level 1
                             <select name={"floor-selection"} className={"selection-buttons"} id={"floor-selection"}>
                            <option value={""} disabled selected>Floor Selection</option>
                            <option value={""}>Level One</option>
                            <option value={""}>Level One</option>
                            </select>


                        */}
                       <LocationsDropDown/>

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
