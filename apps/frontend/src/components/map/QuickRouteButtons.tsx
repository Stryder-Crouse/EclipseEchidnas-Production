import {Dispatch, SetStateAction} from "react";
import {Buildings, Node, NodeType, NULLNODE} from "common/src/algorithms/Graph/Node.ts";
import ExitIcon from "../../images/MapFunctions/exit.png";
import ElevatorIcon from "../../images/MapFunctions/elevator.png";
import BathroomIcon from "../../images/MapFunctions/bathRoom.png";
import ErIcon from "../../images/MapFunctions/ER.png";

export type QuickRouteButtonsProps = {
    startNode: Node;
    setStartNode: Dispatch<SetStateAction<Node>>;
    setEndNode: Dispatch<SetStateAction<Node>>;
    setErrorNoStartLocation: Dispatch<SetStateAction<boolean>>;
}

const iconConatnerCss = " w-[25%] bg-[#024c96] p-2 hover:bg-[#024281] cursor-pointer ";

const iconCss = "w-full";

export function QuickRouteButtons({startNode,setStartNode,setEndNode,setErrorNoStartLocation}:QuickRouteButtonsProps){

    console.log(startNode,setStartNode,setEndNode);

    return (
        <div className="flex flex-row justify-content-center w-60 h-  rounded-3xl border-gray-500
        border-2  drop-shadow-lg mt-1  bg-[#024c96] overflow-hidden">

            <div className={iconConatnerCss} onClick={()=>{onQuickBoxClick(NodeType.REST);}}>
                <img src={BathroomIcon} className={iconCss} alt={"Go to closest bathroom"}/>
            </div>

            <div className={iconConatnerCss} onClick={()=>{onQuickBoxClick(NodeType.ELEV);}}>
                <img src={ElevatorIcon} className="w-full " alt={"Go to closest elevator"}/>
            </div>

            <div className={iconConatnerCss} onClick={()=>{onQuickBoxClick(NodeType.EXIT);}}>
                <img src={ExitIcon} className={iconCss} alt={"Go to closest exit"}/>
            </div>

            <div className={iconConatnerCss} onClick={()=>{onQuickBoxClick("ER");}}>
                <img src={ErIcon} className={iconCss} alt={"Go to ER"}/>
            </div>

        </div>
    );

    function onQuickBoxClick(type:string){

        console.log(type);
        if(startNode!=NULLNODE){

            //todo replace with dystra algo
            setEndNode(testLocations(type));

        }
        else{
            setErrorNoStartLocation(true);
        }



    }


    //todo remove
    function testLocations(type:string){

        let newNode:Node;
        switch (type) {
            case NodeType.EXIT:
                newNode= {
                    building: Buildings.UNDEFINED,
                    coordinate: {x:-1,y:-1},
                    edges: [],
                    floor: "",
                    heuristic: 0,
                    id: "CCONF003L1",
                    longName: "ab",
                    nodeType: NodeType.ELEV,
                    shortName: ""
                };
                return newNode;
            case NodeType.REST:
                newNode= {
                    building: Buildings.UNDEFINED,
                    coordinate: {x:-1,y:-1},
                    edges: [],
                    floor: "",
                    heuristic: 0,
                    id: "CDEPT002L1",
                    longName: "de",
                    nodeType: NodeType.ELEV,
                    shortName: ""
                };
                return newNode;
            case NodeType.ELEV:
                newNode= {
                    building: Buildings.UNDEFINED,
                    coordinate: {x:-1,y:-1},
                    edges: [],
                    floor: "",
                    heuristic: 0,
                    id: "WELEV00ML1",
                    longName: "pog",
                    nodeType: NodeType.ELEV,
                    shortName: ""
                };
                return newNode;
            case "ER":
                newNode= {
                    building: Buildings.UNDEFINED,
                    coordinate: {x:-1,y:-1},
                    edges: [],
                    floor: "",
                    heuristic: 0,
                    id: "CLABS005L1",
                    longName: "22",
                    nodeType: NodeType.ELEV,
                    shortName: ""
                };
                return newNode;

            default:
                newNode= {
                    building: Buildings.UNDEFINED,
                    coordinate: {x:-1,y:-1},
                    edges: [],
                    floor: "",
                    heuristic: 0,
                    id: "CLABS005L1",
                    longName: "11",
                    nodeType: NodeType.ELEV,
                    shortName: ""
                };
                return newNode;


        }



    }


}
