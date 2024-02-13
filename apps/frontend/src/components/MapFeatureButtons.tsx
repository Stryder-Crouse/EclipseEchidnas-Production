import EyeIcon from "../images/MapFunctions/eye.png";
import RefreshIcon from "../images/MapFunctions/refresh-cw.png";
import ZoomInIcon from "../images/MapFunctions/plus.png";
import ZoomOutIcon from "../images/MapFunctions/minus.png";
import {Dispatch, SetStateAction} from "react";




export interface zoomAndMapStates{
    drawEntirePath:boolean;
    setDrawEntirePath: Dispatch<SetStateAction<boolean>>;
    veiwbox:{x:number, y:number, width:number, height:number},
    setVeiwbox:Dispatch<SetStateAction<{x:number, y:number, width:number, height:number}>>
    setZoomScale:Dispatch<SetStateAction<number>>
}
export default function MapFeatureButtons({drawEntirePath:drawEntirePath,
                                              setDrawEntirePath:setDrawEntirePath,
                                              veiwbox:veiwbox,
                                              setVeiwbox:setVeiwbox,
                                              setZoomScale:setZoomScale}:zoomAndMapStates) {


    function handleMapToggle() {
        if (!drawEntirePath) {
            setDrawEntirePath(true);
        } else {
            setDrawEntirePath(false);
        }
    }

    function zoomMap(direction:number){
        const svgElement =  document.getElementById("map")!;
        const svgSize:{width:number,height:number} = {width:svgElement.clientWidth, height:svgElement.clientHeight};


        //calulate change in width and height of the box based on zoom direction
        const changeInWidth = veiwbox.width * Math.sign(direction)*0.2;
        const changeInHeight = veiwbox.height * Math.sign(direction)*0.2;

        //keep mouse in the center of the zoom and get new x and y
        const newX = veiwbox.x +(changeInWidth*(svgSize.width/2))/svgSize.width;
        const newY = veiwbox.y +(changeInHeight*(svgSize.height/2))/svgSize.height;

        //set scale for proper panning
        setZoomScale(svgSize.width/veiwbox.width);
        //set new veiwbox
        setVeiwbox({x: newX, y: newY,
            width:veiwbox.width - changeInWidth,height:veiwbox.height - changeInHeight});


    }

    //TODO 1. have ALL node toggle work 2. toggle on/off selection of nodes 3/4. zoom in and out functionality
    return(
        <div className="grid z-10 fixed bottom-5 right-5">
            <button className="bg-ivoryWhite rounded-md p-2 mb-4 drop-shadow-lg" onClick={handleMapToggle}>
                <img src={EyeIcon} alt={"See All Locations and Paths"}/>
            </button>
            <button className="bg-ivoryWhite rounded-md p-2 mb-4 drop-shadow-lg">
                <img src={RefreshIcon} alt={"Refresh"}/>
            </button>
            <div className="grid ">
                <button className="bg-ivoryWhite p-2 drop-shadow-lg rounded-t-md"
                        onClick={()=>{zoomMap(1);}}
                >
                    <img src={ZoomInIcon} alt={"Zoom In"}/>
                </button>
                <button className="bg-ivoryWhite p-2 drop-shadow-lg rounded-b-md "
                        onClick={()=>{zoomMap(-1);}}
                >
                    <img src={ZoomOutIcon} alt={"Zoom Out"}/>
                </button>
            </div>

        </div>
    );
}
