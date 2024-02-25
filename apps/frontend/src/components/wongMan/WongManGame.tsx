import {Dispatch, SetStateAction, useRef, useState} from "react";


export type WongManProps={
    visable:boolean
    setVisable:Dispatch<SetStateAction<boolean>>
}
export default function WongManGame({visable,setVisable}:WongManProps) {

    const [showGame, setShowGame] =
        useState(false);

    const [showStart, setShowStart] =
        useState(true);

    const canvasArea = useRef<HTMLCanvasElement>(null);
    const canvasContext = useRef< CanvasRenderingContext2D | null>(null);

    //let echidna = useRef< CanvasRenderingContext2D | null>(null);

    return (
        <div
            className={showWongMan(visable)}>

            <button
                className={"absolute transition-all hover:bg-navy w-16 text-white p-3 ml-2 mt-2 bg-navStart rounded-full" +
                    " h-min font-semibold drop-shadow-lg z-[103]"}
                onClick={()=>{setVisable(false);}}
            >
                Exit
            </button>

            <div
                className={"flex m-auto w-32"}>
                <button className={showStartButton(showStart)}
                        onClick={()=>{
                            setShowGame(true);
                            setShowStart(false);
                            startGame();
                        }}
                >Start</button>
            </div>

            <div className={showGameMap(showGame)}>
                <canvas className={"w-screen h-screen bg-gray-300"} ref={canvasArea}>

                </canvas>

            </div>


        </div>
    );



    function startGame(){
        //create peaces

        //set context
        canvasContext.current = canvasArea.current!.getContext("2d");

        setInterval(mainLoop,20);
    }

    function mainLoop(){
        clear();

    }

    function clear(){
        canvasContext.current?.clearRect(0,0,canvasArea.current!.width,canvasArea.current!.height);
    }

    function showWongMan(visable:boolean){
        if(visable){
            return "z-[100] bg-amber-200 w-screen h-screen";
        }
        return "z-[-1] hidden bg-amber-200 w-0 h-0";
    }

    function showGameMap(visable:boolean){
        if(visable){
            return "absolute w-screen h-screen bg-white z-[101]";
        }
        return "w-0 h-0 hidden";
    }

    function showStartButton(visable:boolean){
        if(visable){
            return "transition-all hover:bg-navy w-32 text-white p-3 ml-8 bg-navStart rounded-full" +
                " h-min font-semibold drop-shadow-lg";
        }
        return "w-0 h-0 hidden";
    }



}
