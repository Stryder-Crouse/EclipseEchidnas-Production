import LayersIcon from "../images/MapFunctions/layers-3.png";
import RefreshIcon from "../images/MapFunctions/refresh-cw.png";
import ZoomInIcon from "../images/MapFunctions/plus.png";
import ZoomOutIcon from "../images/MapFunctions/minus.png";
import {Dispatch, SetStateAction, useState} from "react";
import {Node} from "common/src/algorithms/Graph/Node.ts";
import { Viewbox} from "./map/HospitalMap.tsx";
import {setViewBoxForLevel} from "./map/mapLogic.ts";

const maxZoom =4.2;

/**
 * Type to hold all applicable states on the Tailwind map page wrapper.
 */
export type zoomAndMapStates = {
    drawEntirePath: boolean;
    setDrawEntirePath: Dispatch<SetStateAction<boolean>>;
    viewbox: Viewbox,
    setViewbox: Dispatch<SetStateAction<Viewbox>>
    setZoomScale: Dispatch<SetStateAction<number>>,
    setStartNode: Dispatch<SetStateAction<Node>>
    setEndNode: Dispatch<SetStateAction<Node>>
    drawEntirePathOptions:boolean[]
    setDrawEntirePathOptions:Dispatch<SetStateAction<boolean[]>>
    selectedFloorIndex:number
}
export default function MapFeatureButtons({
                                              drawEntirePath: drawEntirePath,
                                              setDrawEntirePath: setDrawEntirePath,
                                              viewbox: viewbox,
                                              setViewbox: setViewbox,
                                              setZoomScale: setZoomScale,selectedFloorIndex,
                                              drawEntirePathOptions,
                                              setDrawEntirePathOptions
                                          }: zoomAndMapStates) {
    /**
     * Handle when the all edges toggle is pressed.
     */
    const [isButtonActive, setIsButtonActive] = useState(false);
    function handleAllEdgesToggle() {
        if (!drawEntirePath) {
            setDrawEntirePath(true);
            openForm();
        } else {
            setDrawEntirePath(false);
            closeForm();
        }

        // Toggle button active state
        setIsButtonActive(!isButtonActive);
    }


    function openForm() {
        const openSesame = document.getElementById("options");
        if (openSesame != null) {
            openSesame.setAttribute("class","mb-4 bg-ivoryWhite rounded-md drop-shadow-lg p-2 visible");
        }
    }

    function closeForm() {
        const openSesame = document.getElementById("options");
        if (openSesame != null) {
            openSesame.setAttribute("class","w-0 h-0 mb-4 bg-ivoryWhite rounded-md drop-shadow-lg p-2 invisible");
        }
    }

    /**
     * Handle zooming the map using the on-screen buttons.
     * @param direction the direction (in or out) to zoom
     */
    function zoomMap(direction: number) {
        /* find the map on the page */
        const svgElement = document.getElementById("map")!;
        const svgSize: { width: number, height: number } = {
            width: svgElement.clientWidth,
            height: svgElement.clientHeight
        };

        /* calculate transformation of the viewbox based on zoom direction */
        const changeInWidth = viewbox.width * Math.sign(direction) * 0.2;
        const changeInHeight = viewbox.height * Math.sign(direction) * 0.2;

        /* reference the mouse to the center and get the new x and y coordinates*/
        const newX = viewbox.x + (changeInWidth * (svgSize.width / 2)) / svgSize.width;
        const newY = viewbox.y + (changeInHeight * (svgSize.height / 2)) / svgSize.height;

        if((svgSize.width / viewbox.width)>maxZoom){
            return;
        }

        /* update the scale */
        setZoomScale(svgSize.width / viewbox.width);

        /* update the viewbox*/
        setViewbox(keepWithinZoom(
            {
                x: newX,
                y: newY,
                width: viewbox.width - changeInWidth,
                height: viewbox.height - changeInHeight
            }
        ));
    }


    function keepWithinZoom(viewbox:{
        x: number,
        y: number,
        width: number,
        height:number,
    }){
        //console.log(newViewbox);


        const newViewbox = viewbox;
        let diffrence=0;
        if(newViewbox.x < 950 ){
            diffrence = 950 - newViewbox.x;
            newViewbox.x = 950;

            newViewbox.width +=diffrence;

        }
        if(newViewbox.y < 0 ){
            diffrence = 0 - newViewbox.y;
            newViewbox.y = 0;

            newViewbox.height +=diffrence;

        }
        if( newViewbox.x + newViewbox.width > 4500){
            diffrence = newViewbox.x + newViewbox.width - 4500;
            newViewbox.width -=diffrence;

        }
        if(newViewbox.y+newViewbox.height > 2500){
            diffrence = newViewbox.y + newViewbox.height - 2500;
            newViewbox.height -=diffrence;

        }





        return newViewbox;

    }
    /*
    function openOptionsDiv() {
        const openSesame = document.getElementById("optionTime");
            if (openSesame != null) {
                openSesame.style.display = "block";
            }
    }
    function closeOptionsDiv() {
        const closeSesame = document.getElementById("optionTime");
            if (closeSesame != null) {
                closeSesame.style.display = "none";
            }
    }
    */

    //TODO Stryder, replace the options div that has the "handleAllEdgesToggle" with the openOptionsDiv
    //TODO the div that we is to be opened needs to be "hidden" state and the backend functionality


    /* what you see is what you get */
    return (
        <div className="z-10 fixed bottom-5 right-5 flex flex-col">


            <div id={"options"} className={"w-0 h-0 mb-4 bg-ivoryWhite rounded-md drop-shadow-lg p-2 invisible"}>
                <b>Options</b><br/>
                <label htmlFor={"toggleNodes"}>Show Nodes</label><br/>
                <input type={"checkbox"} name={"toggleNodes"} id={"toggleNodes"}
                       checked={drawEntirePathOptions[0]}
                       onChange={(e) => {
                           const newDrawEntirePathOptions = [...drawEntirePathOptions];
                           newDrawEntirePathOptions[0] = e.target.checked;
                           console.log(e.target.checked);
                           setDrawEntirePathOptions(newDrawEntirePathOptions);
                       }}


                ></input><br/>
                <label htmlFor={"toggleEdges"}>Show Edges</label><br/>
                <input type={"checkbox"} name={"toggleEdges"} id={"toggleEdges"}
                       checked={drawEntirePathOptions[1]}
                       onChange={(e) => {
                           const newDrawEntirePathOptions = [...drawEntirePathOptions];
                           newDrawEntirePathOptions[1] = e.target.checked;
                           console.log(e.target.checked);
                           setDrawEntirePathOptions(newDrawEntirePathOptions);
                       }}></input><br/>
                <label htmlFor={"toggleLocationNames"}>Show Location Names</label><br/>
                <input type={"checkbox"} name={"toggleLocationNames"} id={"toggleLocationNames"}
                       checked={drawEntirePathOptions[2]}
                       onChange={(e) => {
                           const newDrawEntirePathOptions = [...drawEntirePathOptions];
                           newDrawEntirePathOptions[2] = e.target.checked;
                           console.log(e.target.checked);
                           setDrawEntirePathOptions(newDrawEntirePathOptions);
                       }}></input>

            </div>

            <button
                id={"optionTime"}
                title={"Options"}
                className={`bg-ivoryWhite flex self-end rounded-md p-2 mb-4 w-10 ${
                    isButtonActive ? "bg-navStart" : "bg-ivoryWhite"
                } drop-shadow-lg`}
                onClick={handleAllEdgesToggle}
            >
                <img
                    src={LayersIcon}
                    alt={"See All Locations and Paths"}
                    style={{filter: isButtonActive ? "invert(1)" : "invert(0)"}}
                    className={"hover:invert"}
                />
            </button>

            <button className="flex self-end bg-ivoryWhite rounded-md p-2 mb-4 drop-shadow-lg w-10 "
                    title={"Refresh Zoom"}
                    onClick={() => {
                        setViewBoxForLevel(selectedFloorIndex,setViewbox);
                    }}>
                <img src={RefreshIcon} alt={"Refresh"} />
            </button>

            {/*PLACE HOLDER*/}


            <div className="flex flex-col self-end ">
                <button className="flex bg-ivoryWhite p-2 drop-shadow-lg rounded-t-md w-10 "
                        onClick={() => {
                            zoomMap(1);
                        }}
                        title={"Zoom In"}
                >
                    <img src={ZoomInIcon} alt={"Zoom In"} />
                </button>
                <hr/>
                <button className="flex bg-ivoryWhite p-2 drop-shadow-lg rounded-b-md w-10 "
                        onClick={() => {
                            zoomMap(-1);
                        }}
                        title={"Zoom Out"}
                >
                    <img src={ZoomOutIcon} alt={"Zoom Out"} />
                </button>
            </div>
        </div>
    );
}
