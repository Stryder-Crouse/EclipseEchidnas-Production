import EyeIcon from "../images/MapFunctions/eye.png";
import RefreshIcon from "../images/MapFunctions/refresh-cw.png";
import ZoomInIcon from "../images/MapFunctions/plus.png";
import ZoomOutIcon from "../images/MapFunctions/minus.png";
import {Dispatch, SetStateAction} from "react";
import {Node, NULLNODE} from "../../../backend/src/algorithms/Graph/Node.ts";
import {Viewbox} from "./map/HospitalMap.tsx";

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
}
export default function MapFeatureButtons({
                                              drawEntirePath: drawEntirePath,
                                              setDrawEntirePath: setDrawEntirePath,
                                              viewbox: viewbox,
                                              setViewbox: setViewbox,
                                              setZoomScale: setZoomScale, setStartNode, setEndNode,
                                              drawEntirePathOptions,
                                              setDrawEntirePathOptions
                                          }: zoomAndMapStates) {
    /**
     * Handle when the all edges toggle is pressed.
     */
    function handleAllEdgesToggle() {
        if (!drawEntirePath) {
            setDrawEntirePath(true);
        } else {
            setDrawEntirePath(false);
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

        /* update the scale */
        setZoomScale(svgSize.width / viewbox.width);

        /* update the viewbox*/
        setViewbox({
            x: newX, y: newY,
            width: viewbox.width - changeInWidth, height: viewbox.height - changeInHeight
        });
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
        <div className="grid z-10 fixed bottom-5 right-5">
            <button id={"optionTime"} className="bg-ivoryWhite rounded-md p-2 mb-4 drop-shadow-lg w-10" onClick={handleAllEdgesToggle}>
                <img src={EyeIcon} alt={"See All Locations and Paths"}/>
            </button>
            <button className="bg-ivoryWhite rounded-md p-2 mb-4 drop-shadow-lg w-10"
                    onClick={() => {
                        setStartNode(NULLNODE);
                        setEndNode(NULLNODE);
                    }}>
                <img src={RefreshIcon} alt={"Refresh"}/>
            </button>

            {/*PLACE HOLDER*/}
            <div className={"bg-ivoryWhite rounded-md drop-shadow-lg p-2"}>
                <b>Place Holder</b><br/>
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
                <input type={"checkbox"} name={"toggleEdges"}  id={"toggleEdges"}
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

            <div className="grid ">
                <button className="bg-ivoryWhite p-2 drop-shadow-lg rounded-t-md w-10"
                        onClick={() => {
                            zoomMap(1);
                        }}
                >
                    <img src={ZoomInIcon} alt={"Zoom In"}/>
                </button>
                <button className="bg-ivoryWhite p-2 drop-shadow-lg rounded-b-md w-10"
                        onClick={() => {
                            zoomMap(-1);
                        }}
                >
                    <img src={ZoomOutIcon} alt={"Zoom Out"}/>
                </button>
            </div>
        </div>
    );
}
