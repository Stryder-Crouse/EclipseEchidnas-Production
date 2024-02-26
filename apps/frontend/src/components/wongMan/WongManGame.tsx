import {Dispatch, SetStateAction, useRef, useState} from "react";
import {Directions_Game, Echidna} from "./Echidna.ts";


import LowerLevel1Game from "../../images/WongMan/Maps/LowerLevel1.png";
// @ts-expect-error idk why its fine
import {KeyboardEvent} from "happy-dom";
import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";

export type WongManProps={
    visable:boolean
    setVisable:Dispatch<SetStateAction<boolean>>
}


const playerSpeed =3;

export default function WongManGame({visable,setVisable}:WongManProps) {

    const [showGame, setShowGame] =
        useState(false);

    const [showStart, setShowStart] =
        useState(true);



    const canvasArea = useRef<HTMLCanvasElement>(null);
    const canvasContext = useRef< CanvasRenderingContext2D | null>(null);

    const echidna = useRef< Echidna| null>(null);
    const keysDown = useRef< number[]>([0,0,0,0]);
    const renderCount = useRef(0);

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
                <canvas id="hi" className={"bg-gray-300"}  ref={canvasArea}>

                </canvas>

            </div>


        </div>
    );



    function startGame(){
        //create peaces
        echidna.current = new Echidna({x:200, y:200},50,50,Directions_Game.RIGHT);


        //set context
        canvasContext.current = canvasArea.current!.getContext("2d");

        //set how large the rendering area is
        canvasContext.current!.canvas.width = window.innerWidth;
        canvasContext.current!.canvas.height = window.innerHeight;
        //disable AA for better look
        //canvasContext.current!.imageSmoothingEnabled=false;
        //add eventliseners 
        window.addEventListener("keydown",(e)=>{

            handleKeyDown(e);});
        window.addEventListener("keyup",(e)=>{handleKeyUp(e);});


        setInterval(mainLoop,20);
        //console.log("exited");
    }
    
    function handleKeyDown(event:KeyboardEvent){
        console.log(event.code);
        switch (event.code) {
            //left arrow
            case "ArrowLeft":
                keysDown.current[0]=1;
                break;
            //right arrow
            case "ArrowRight":
                keysDown.current[1]=1;
                break;
            
            //up arrow
            case "ArrowUp":
                keysDown.current[2]=1;
                break;
            //down arrow
            case "ArrowDown":
                keysDown.current[3]=1;
                break;
        }
    }

    function handleKeyUp(event:KeyboardEvent){
        switch (event.code) {
            //left arrow
            case "ArrowLeft":
                keysDown.current[0]=0;
                break;
            //right arrow
            case "ArrowRight":
                keysDown.current[1]=0;
                break;

            //up arrow
            case "ArrowUp":
                keysDown.current[2]=0;
                break;
            //down arrow
            case "ArrowDown":
                keysDown.current[3]=0;
                break;
        }
    }

    function mainLoop(){

        clear();

        //draw the level
        drawLevel(0);

        handlePlayerMovment();
        echidna.current?.render(canvasContext.current!,renderCount.current);


        renderCount.current++;
    }
    function clear(){
        canvasContext.current?.clearRect(0,0,canvasArea.current!.width,canvasArea.current!.height);
    }

    function drawLevel(level:number) {

        let levelSRC = "";
        switch (level) {

            case 0:
                levelSRC = LowerLevel1Game; break;
            default:
                return "/src/images/maps/00_thelowerlevel1.png";
        }

        const img = document.createElement("img");
        img.src=levelSRC;
        canvasContext.current!.drawImage(img,0,0,window.innerWidth,window.innerHeight);

    }
    
    function handlePlayerMovment(){
        const playerMovementThisFrame:Coordinate = {x:0,y:0};
        
        //left arrow down
        if(keysDown.current[0]){
            playerMovementThisFrame.x = -playerSpeed;
        }
        //right arrow down
        if(keysDown.current[1]){
            playerMovementThisFrame.x = playerSpeed;
        }
        //up arrow down
        if(keysDown.current[2]){
            playerMovementThisFrame.y = -playerSpeed;
        }
        //down arrow down
        if(keysDown.current[3]){
            playerMovementThisFrame.y = playerSpeed;
        }

        //if player is not moving or not tell it (for animation)
        if(playerMovementThisFrame.x == 0 && playerMovementThisFrame.y == 0){
            echidna.current?.setIsMoving(false);
        }
        else{
            echidna.current?.setIsMoving(true);
        }

        
        const newCordnates = echidna.current!.getCoords()!;
        newCordnates.x = newCordnates.x + playerMovementThisFrame.x;
        newCordnates.y = newCordnates.y + playerMovementThisFrame.y;

        //handle rotation
        handleRotation(playerMovementThisFrame);
        
        echidna.current?.setCoords(newCordnates);
    }

    function handleRotation(playerMovementThisFrame:Coordinate){

        let newDirection = echidna.current!.getDirection()!;

        //diagonal cases
        if(playerMovementThisFrame.x!=0 && playerMovementThisFrame.y!=0){

            if(playerMovementThisFrame.x > 0 && playerMovementThisFrame.y < 0){
                newDirection = Directions_Game.UPRIGHT;
            }
            else if (playerMovementThisFrame.x < 0 && playerMovementThisFrame.y < 0){
                newDirection = Directions_Game.UPLEFT;
            }
            else if (playerMovementThisFrame.x < 0 && playerMovementThisFrame.y > 0){
                newDirection = Directions_Game.DOWNLEFT;
            }
            else{
                newDirection = Directions_Game.DOWNRIGHT;
            }

        }
        //right or left only
        else if(playerMovementThisFrame.x!=0){

            if(playerMovementThisFrame.x < 0){ newDirection = Directions_Game.LEFT;}
            else{newDirection = Directions_Game.RIGHT;}

        }
        //up or down only
        else if(playerMovementThisFrame.y!=0){

            if(playerMovementThisFrame.y < 0){ newDirection = Directions_Game.UP;}
            else{newDirection = Directions_Game.DOWN;}

        }

        //console.log(newDirection);
        echidna.current?.setDirection(newDirection);

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
