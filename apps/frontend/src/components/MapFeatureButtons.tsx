import EyeIcon from "../images/MapFunctions/eye.png";
import RefreshIcon from "../images/MapFunctions/refresh-cw.png";
import ZoomInIcon from "../images/MapFunctions/plus.png";
import ZoomOutIcon from "../images/MapFunctions/minus.png";
import {Dispatch, SetStateAction} from "react";
import {Node, NULLNODE} from "../../../backend/src/algorithms/Graph/Node.ts";
import {Viewbox} from "./map/Map.tsx";

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
}
export default function MapFeatureButtons({
                                              drawEntirePath: drawEntirePath,
                                              setDrawEntirePath: setDrawEntirePath,
                                              viewbox: viewbox,
                                              setViewbox: setViewbox,
                                              setZoomScale: setZoomScale, setStartNode, setEndNode
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

    /* what you see is what you get */
    return (
        <div className="grid z-10 fixed bottom-5 right-5">
            <button className="bg-ivoryWhite rounded-md p-2 mb-4 drop-shadow-lg" onClick={handleAllEdgesToggle}>
                <img src={EyeIcon} alt={"See All Locations and Paths"}/>
            </button>
            <button className="bg-ivoryWhite rounded-md p-2 mb-4 drop-shadow-lg"
                    onClick={() => {
                        setStartNode(NULLNODE);
                        setEndNode(NULLNODE);
                    }}>
                <img src={RefreshIcon} alt={"Refresh"}/>
            </button>
            <div className="grid ">
                <button className="bg-ivoryWhite p-2 drop-shadow-lg rounded-t-md"
                        onClick={() => {
                            zoomMap(1);
                        }}
                >
                    <img src={ZoomInIcon} alt={"Zoom In"}/>
                </button>
                <button className="bg-ivoryWhite p-2 drop-shadow-lg rounded-b-md "
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
