import EyeIcon from "../images/MapFunctions/eye.png";
import RefreshIcon from "../images/MapFunctions/refresh-cw.png";
import ZoomInIcon from "../images/MapFunctions/plus.png";
import ZoomOutIcon from "../images/MapFunctions/minus.png";
export default function MapFeatureButtons() {
    //TODO 1. have ALL node toggle work 2. toggle on/off selection of nodes 3/4. zoom in and out functionality
    return(
        <div className="grid z-10 fixed bottom-5 right-5">
            <button className="bg-ivoryWhite rounded-md p-2 mb-4 drop-shadow-lg">
                <img src={EyeIcon} alt={"See All Locations and Paths"}/>
            </button>
            <button className="bg-ivoryWhite rounded-md p-2 mb-4 drop-shadow-lg">
                <img src={RefreshIcon} alt={"Refresh"}/>
            </button>
            <button className="bg-ivoryWhite rounded-md p-2 mb-4 drop-shadow-lg">
                <img src={ZoomInIcon} alt={"Zoom In"}/>
            </button>
            <button className="bg-ivoryWhite rounded-md p-2 drop-shadow-lg">
                <img src={ZoomOutIcon} alt={"Zoom Out"}/>
            </button>
        </div>
    );
}
