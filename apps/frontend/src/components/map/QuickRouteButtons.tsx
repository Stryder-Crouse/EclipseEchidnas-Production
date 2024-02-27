import {Dispatch, SetStateAction} from "react";
import {Buildings, Node, NodeType, NULLNODE} from "common/src/algorithms/Graph/Node.ts";
import ExitIcon from "../../images/MapFunctions/exit.png";
import ElevatorIcon from "../../images/MapFunctions/elevator.png";
import BathroomIcon from "../../images/MapFunctions/bathRoom.png";
import ErIcon from "../../images/MapFunctions/ER.png";

import axios from "axios";

export type QuickRouteButtonsProps = {
    startNode: Node;

    setEndNode: Dispatch<SetStateAction<Node>>;
    setErrorNoStartLocation: Dispatch<SetStateAction<boolean>>;
}

const iconConatnerCss = " w-[25%] bg-[#024c96] p-2 hover:bg-[#024281] transition-all cursor-pointer rounded-md";


export function QuickRouteButtons({startNode,setEndNode,setErrorNoStartLocation}:QuickRouteButtonsProps){







    return (
        <div className="flex flex-row justify-content-center w-60  p-2 rounded-3xl border-gray-500
        border-2  drop-shadow-lg mt-1  bg-[#024c96] overflow-hidden">

            <div title={"Bathroom"} className={iconConatnerCss} onClick={()=>{onQuickBoxClick(NodeType.REST);}}>
                <img src={BathroomIcon} className={'w-full scale-90'} alt={"Go to closest bathroom"}/>
            </div>

            <div title={"Elevator"} className={iconConatnerCss} onClick={()=>{onQuickBoxClick(NodeType.ELEV);}}>
                <img src={ElevatorIcon} className="w-full scale-90 " alt={"Go to closest elevator"}/>
            </div>

            <div title={"Closest Exit"} className={iconConatnerCss} onClick={()=>{onQuickBoxClick(NodeType.EXIT);}}>
                <img src={ExitIcon} className={'w-full scale-90'} alt={"Go to closest exit"}/>
            </div>

            <div title={"ER"} className={iconConatnerCss} onClick={()=>{onQuickBoxClick("ER");}}>
                <img src={ErIcon} className={'w-full scale-90 '} alt={"Go to ER"}/>
            </div>

        </div>
    );

    async function onQuickBoxClick(type:string){

        console.log(type);
        if(startNode!=NULLNODE){

            if(type == "ER"){
                const emergncyNode:Node = {
                    building: Buildings.Tower,
                    coordinate: {x:2128,y:1300},
                    edges: [],
                    floor: "1",
                    heuristic: 0,
                    id: "FDEPT00501",
                    longName: "Emergency Department",
                    nodeType: NodeType.DEPT,
                    shortName: "Emergency"

                };
                setEndNode(emergncyNode);
                return;
            }

            //todo replace with dystra algo
            const closest = await getClosest(type as NodeType);

            console.log(closest);

            if(closest == null){
                console.error("closest node does not exist");
                return;
            }

            setEndNode(closest);

        }
        else{
            setErrorNoStartLocation(true);
        }



    }


    async function getClosest(type: NodeType) {

        const result = await axios.get<Node|null>("/api/Graph/ClosestType",
            {params: {startNodeID: startNode.id, targetType:type}});

        return result.data;


    }











}



