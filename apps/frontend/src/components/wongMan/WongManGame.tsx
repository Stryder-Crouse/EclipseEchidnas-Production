import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {Directions_Game, Echidna} from "./Echidna.ts";
import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";
import {Node} from "common/src/algorithms/Graph/Node.ts";
import {Edible} from "./Edible.ts";
import {
    Level0, level0AddtionalEdibleCoordinates,
    Level1, level1AddtionalEdibleCoordinates,
    Level2, level2AddtionalEdibleCoordinates,
    Level3, level3AddtionalEdibleCoordinates,
    Level4, level4AddtionalEdibleCoordinates, Level5, level5AddtionalEdibleCoordinates,
} from "./LevelNodesLocationList.ts";
import EdibleBlue from "../../images/WongMan/Edible/EdibleBlue.png";
import EdibleRed from "../../images/WongMan/Edible/EdibleRed.png";
import EdibleGreen from "../../images/WongMan/Edible/EdibleGreen.png";
import EdibleYellow from "../../images/WongMan/Edible/EdibleYellow.png";
import EdibleBlack from "../../images/WongMan/Edible/EdibleBlack.png";
import WongBot from "../../images/WongMan/Wong/Wong_Bottom.png";
import WongTop from "../../images/WongMan/Wong/Wong_Top_Eyebrows.png";
import WongTopLaser from "../../images/WongMan/Wong/Wong_Top_Laser.png";
import GameEndSound from "../../images/WongMan/Distorted_Team_E.mp3";
// @ts-expect-error happy-dom is based
import {HTMLImageElement, KeyboardEvent} from "happy-dom";
import {WongLevel} from "./WongLevel.ts";
import {multipleNodeDataBaseToNode, NodeDataBase} from "common/src/algorithms/DataBaseClasses/NodeDataBase.ts";
import axios from "axios";
import {RenderableObject} from "./RenderableObject.ts";
import {Wong} from "./Wong.ts";
import {GameSound} from "./GameSound.ts";

/* structures */
export type WongManProps = {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
}

/** global variables 🤖 */
let IMG_WIDTH: number = 2560;
let IMG_HEIGHT: number = 1279;
const playerSpeed: number = 6;
const EDIBLESIZE =15;

export default function WongManGame({visible, setVisible}: WongManProps) {
    const [showGame, setShowGame] = useState(false);
    const [showStart, setShowStart] = useState(true);
    const [levels, setLevels] =
        useState<WongLevel[]>([]);

    const canvasArea = useRef<HTMLCanvasElement>(null);
    const canvasContext = useRef<CanvasRenderingContext2D | null>(null);

    const echidna = useRef<Echidna | null>(null);
    const wong = useRef<Wong | null>(null);
    const keysDown = useRef<number[]>([0, 0, 0, 0]);
    const renderCount = useRef(0);

    const currentLevel = useRef(0);

    const currentLevelEdibles = useRef([] as Edible[]);
    const ediblesLeft = useRef(0);

    const mainThread = useRef< NodeJS.Timeout | null>(null);

    const gameEndSound = useRef<GameSound|null>(null);

    /* grabbing rodes */
    useEffect(() => {
        grabSomeNodes().then((myFulfilledPromise: Array<Array<Node>>) => {
            const newLevels:WongLevel[] = [];
            for(let i =0;i<myFulfilledPromise.length;i++){
                const nodesCoordnates:Coordinate[] =[];
                for(const node of myFulfilledPromise[i]){
                    nodesCoordnates.push(node.coordinate);
                }

                newLevels.push(generateLevel(i,nodesCoordnates));
            }
            setLevels(newLevels);
        });
    }, []);

    return (
        <div
            className={styleWongMan(visible)}>
            <button
                className={"absolute transition-all hover:bg-navy w-16 text-white p-3 ml-2 mt-2 bg-navStart rounded-full" +
                    " h-min font-semibold drop-shadow-lg z-[103]"}
                onClick={() => {
                    setVisible(false);
                    clearInterval(mainThread.current!);
                    resetGame();
                    gameEndSound.current?.stopSound();
                    location.reload();
                }}
            >
                Exit
            </button>

            <div
                className={"flex m-auto w-32"}>
                <button className={styleStartButton(showStart)}
                        onClick={() => {
                            setShowGame(true);
                            setShowStart(false);
                            startGame();

                        }}
                >Start
                </button>
            </div>

            <div className={styleGameMap(showGame)}>
                <canvas id="stryderSaysHello" className={"bg-gray-300"} ref={canvasArea}>

                </canvas>

            </div>


        </div>
    );

    /**
     * Initialise the game engine.
     */
    function startGame(): void {


        /* handle user input */
        window.addEventListener("keydown", (e) => {
            handleKeyDown(e);
        });
        window.addEventListener("keyup", (e) => {
            handleKeyUp(e);
        });

        //add the sound
        gameEndSound.current = new GameSound(GameEndSound);
        document.body.append(gameEndSound.current?.soundElement);
        /* change the level to 0 */
        changeLevel(levels[0]);
        currentLevel.current=0;


        /* start the main loop */
        mainThread.current = setInterval(mainLoop, 20);
    }

    function changeLevel(level: WongLevel): void {
        /* make the new player */
        echidna.current = new Echidna(level.startLocation, 50, 50, Directions_Game.RIGHT);
        if(level.level>=4) {
            wong.current = new Wong(level.wongStartLocation, 0, 0, WongTopLaser
                , WongBot, level.wongAnger, window.innerHeight, level.wongRightSpeed);
        }
        else{
            wong.current = new Wong(level.wongStartLocation, 0, 0, WongTop
                , WongBot, level.wongAnger, window.innerHeight, level.wongRightSpeed);
        }
        //set context
        canvasContext.current = canvasArea.current!.getContext("2d");

        //set how large the rendering area is
        canvasContext.current!.canvas.width = window.innerWidth;
        canvasContext.current!.canvas.height = window.innerHeight;

        //set new image width and height
        IMG_WIDTH= level.width;
        IMG_HEIGHT=level.height;

        //set eitbles left
        ediblesLeft.current = level.edibleLocations.length;
        console.log("level editbles: "+ediblesLeft.current);

        //setup first levels nodes

        currentLevelEdibles.current = setCurrentLevelNodes(level, level.edibleLocations);


    }

    function handleKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            // left arrow
            case "ArrowLeft":
                keysDown.current[0] = 1;
                break;
            // right arrow
            case "ArrowRight":
                keysDown.current[1] = 1;
                break;
            // up arrow
            case "ArrowUp":
                keysDown.current[2] = 1;
                break;
            // down arrow
            case "ArrowDown":
                keysDown.current[3] = 1;
                break;
        }
    }

    function handleKeyUp(event: KeyboardEvent) {
        switch (event.code) {
            // left arrow
            case "ArrowLeft":
                keysDown.current[0] = 0;
                break;
            // right arrow
            case "ArrowRight":
                keysDown.current[1] = 0;
                break;
            // up arrow
            case "ArrowUp":
                keysDown.current[2] = 0;
                break;
            // down arrow
            case "ArrowDown":
                keysDown.current[3] = 0;
                break;
        }
    }

    function mainLoop(): void {
        // clear cavus
        clear();

        //if a level has been finished then go to next level
        changeLevelWhenDone();

        //draw the level
        drawLevelImg(currentLevel.current); // should be done at the start of every level instead

        //check for edible collisions
        checkEdibleCollisions();

        //check if you hit wong
        checkWongCollisions();

        //draw Edibles
        drawEdibles();


        handlePlayerMovement();
        echidna.current?.render(canvasContext.current!, renderCount.current);
        wong.current?.render(canvasContext.current!);


        renderCount.current++;
    }

    function clear() {
        canvasContext.current?.clearRect(0, 0, canvasArea.current!.width, canvasArea.current!.height);
    }

    async function changeLevelWhenDone() {
        if (ediblesLeft.current == 0 && currentLevel.current != 5) {
            currentLevel.current++;
            changeLevel(levels[currentLevel.current]);
        }

        if (ediblesLeft.current == 0 && currentLevel.current == 5) {
            gameEndSound.current?.startSound();

        }
    }

    /**
     * Draw the map picture of the corresponding level.
     * @param level the number of the map to draw
     */
    function drawLevelImg(level: number): void {
        /* make */
        const levelSRC = levels[level].imageSRC;
        /* set */
        const img: HTMLImageElement = document.createElement("img");
        img.src = levelSRC;
        canvasContext.current!.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
    }

    /**
     * draw the dots 🌺
     */
    function drawEdibles(): void {
        for (const edible of currentLevelEdibles.current) {
            edible.render(canvasContext.current!);
        }

    }

    /**
     * Read the player input from the keyboard.
     */
    function handlePlayerMovement(): void {
        let playerMovementThisFrame: Coordinate = {x: 0, y: 0};

        // left arrow pressed
        if (keysDown.current[0]) {
            playerMovementThisFrame.x = -playerSpeed;
        }
        // right arrow pressed
        if (keysDown.current[1]) {
            playerMovementThisFrame.x = playerSpeed;
        }
        // up arrow pressed
        if (keysDown.current[2]) {
            playerMovementThisFrame.y = -playerSpeed;
        }
        // down arrow pressed
        if (keysDown.current[3]) {
            playerMovementThisFrame.y = playerSpeed;
        }

        //checkbounds for movement if not on last level
        if(currentLevel.current!=5) {
            console.log("before");
            console.log(playerMovementThisFrame);
            playerMovementThisFrame = maintainBounds(playerMovementThisFrame);
            console.log("afther");
            console.log(playerMovementThisFrame);
        }

        //if player is not moving or not tell it (for animation)
        if (playerMovementThisFrame.x == 0 && playerMovementThisFrame.y == 0) {
            echidna.current?.setIsMoving(false);
        } else {
            echidna.current?.setIsMoving(true);
        }


        const newCoordinates = echidna.current!.getCoords()!;
        newCoordinates.x = newCoordinates.x + playerMovementThisFrame.x;
        newCoordinates.y = newCoordinates.y + playerMovementThisFrame.y;
        console.log("newCoordinate");
        console.log(newCoordinates);

        //handle rotation
        handleRotation(playerMovementThisFrame);

        echidna.current?.setCoords(newCoordinates);
    }

    function maintainBounds(playerMovementThisFrame:Coordinate){
        const newCoordinates:Coordinate = {
            x: echidna.current!.getCoords()!.x,
            y:echidna.current!.getCoords()!.y
        };
        newCoordinates.x = newCoordinates.x + playerMovementThisFrame.x;
        newCoordinates.y = newCoordinates.y + playerMovementThisFrame.y;

        const properMovement:Coordinate = {
            x:playerMovementThisFrame.x, y:playerMovementThisFrame.y
        };

        if(newCoordinates.x < 0){
            properMovement.x=0;
        }
        if(newCoordinates.x + echidna.current!._width > window.innerWidth){
            properMovement.x=0;
        }

        if(newCoordinates.y < 0){
            properMovement.y=0;
        }
        if(newCoordinates.y + echidna.current!._height > window.innerHeight){
            properMovement.y=0;
        }

        return properMovement;
    }

    function handleRotation(playerMovementThisFrame: Coordinate) {

        let newDirection = echidna.current!.getDirection()!;

        //diagonal cases
        if (playerMovementThisFrame.x != 0 && playerMovementThisFrame.y != 0) {

            if (playerMovementThisFrame.x > 0 && playerMovementThisFrame.y < 0) {
                newDirection = Directions_Game.UPRIGHT;
            } else if (playerMovementThisFrame.x < 0 && playerMovementThisFrame.y < 0) {
                newDirection = Directions_Game.UPLEFT;
            } else if (playerMovementThisFrame.x < 0 && playerMovementThisFrame.y > 0) {
                newDirection = Directions_Game.DOWNLEFT;
            } else {
                newDirection = Directions_Game.DOWNRIGHT;
            }

        }
        //right or left only
        else if (playerMovementThisFrame.x != 0) {

            if (playerMovementThisFrame.x < 0) {
                newDirection = Directions_Game.LEFT;
            } else {
                newDirection = Directions_Game.RIGHT;
            }

        }
        //up or down only
        else if (playerMovementThisFrame.y != 0) {

            if (playerMovementThisFrame.y < 0) {
                newDirection = Directions_Game.UP;
            } else {
                newDirection = Directions_Game.DOWN;
            }

        }

        //console.log(newDirection);
        echidna.current?.setDirection(newDirection);

    }

    /**
     * Set the nodes on this level.
     * @param level the level to draw
     * @param coordinates where the nodes are
     * @return a new array of Edibles
     */
    function setCurrentLevelNodes(level: WongLevel, coordinates: Coordinate[]): Array<Edible> {
        /* make the array */
        const newEdibles: Array<Edible> = new Array<Edible>();



        // console.log("before");
        // console.log(coordinates);
        // console.log(level);
        // console.log(level.offset);
        /* for every provided coordinate */
        for (const coordinate of coordinates) {

            if(!level.firstGeneration) {
                /* scale it */
                coordinate.x = scaleWidth(coordinate.x);
                coordinate.y = scaleHeight(coordinate.y);

                //apply offset of the level
                coordinate.x = coordinate.x - scaleWidth(level.offset.x);
                coordinate.y = coordinate.y - scaleHeight(level.offset.y);

                //make the cordnate the center of the node
                coordinate.x = coordinate.x - EDIBLESIZE / 2;
                coordinate.y = coordinate.y - EDIBLESIZE / 2;
            }


            /* change the color based on level */
            switch (level.level) {
                case 0:
                    newEdibles.push(new Edible(coordinate, EDIBLESIZE, EDIBLESIZE, EdibleBlue));
                    break;
                case 1:
                    newEdibles.push(new Edible(coordinate, EDIBLESIZE, EDIBLESIZE, EdibleRed));
                    break;
                case 2:
                    newEdibles.push(new Edible(coordinate, EDIBLESIZE, EDIBLESIZE, EdibleGreen));
                    break;
                case 3:
                    newEdibles.push(new Edible(coordinate, EDIBLESIZE, EDIBLESIZE, EdibleYellow));
                    break;
                case 4:
                    newEdibles.push(new Edible(coordinate, EDIBLESIZE, EDIBLESIZE, EdibleBlack));
                    break;
                case 5:
                    newEdibles.push(new Edible(coordinate, EDIBLESIZE, EDIBLESIZE, EdibleBlue));
                    break;
            }
        }
        // console.log("afther");
        // console.log(coordinates);
        level.firstGeneration=true;
        /* real */
        return newEdibles;
    }



    function checkEdibleCollisions(){
        for(const edible of currentLevelEdibles.current){
            if(isCollision(edible,echidna.current!) && !edible.getEatean()){
                ediblesLeft.current--;
                edible.setEatean(true);
                console.log(ediblesLeft.current);
            }
        }
    }

    function checkWongCollisions(){
        if(
            isCollision(wong.current!.getTopFace(),echidna.current!) ||
            isCollision(wong.current!.getBopFace(),echidna.current!) ||
            isCollision(wong.current!.getBlackBar(),echidna.current!)
        ){
            resetGame();
        }
    }

    function resetGame(){
        //set all edibles back to not eaten
        currentLevel.current=0;
        changeLevel(levels[currentLevel.current]);

        console.log("reset");

    }


}

function styleWongMan(visible: boolean) {
    if (visible) {
        return "z-[100] bg-amber-200 w-screen h-screen";
    }
    return "z-[-1] hidden bg-amber-200 w-0 h-0";
}

function styleGameMap(visible: boolean) {
    if (visible) {
        return "absolute w-screen h-screen bg-white z-[101]";
    }
    return "w-0 h-0 hidden";
}

function styleStartButton(visible: boolean) {
    if (visible) {
        return "transition-all hover:bg-navy w-32 text-white p-3 ml-8 bg-navStart rounded-full" +
            " h-min font-semibold drop-shadow-lg";
    }
    return "w-0 h-0 hidden";
}


function scaleWidth(desired: number): number {
    return desired * (window.innerWidth / IMG_WIDTH);
}

function scaleHeight(desired: number): number {
    return desired * (window.innerHeight / IMG_HEIGHT);
}

function generateLevel(level:number,edibleCoordsForLevel:Coordinate[]){
    let newLevel:WongLevel;
    switch (level) {
        //LL2
        case 0:
            newLevel = Level0;
            newLevel.edibleLocations=[];
            newLevel.edibleLocations = appendCoordArrays(edibleCoordsForLevel, level0AddtionalEdibleCoordinates);
           // newLevel.edibleLocations = applyLevelOffset(newLevel);
            break;
        //LL1
        case 1:

            newLevel = Level1;
            newLevel.edibleLocations=[];
            newLevel.edibleLocations = appendCoordArrays(edibleCoordsForLevel, level1AddtionalEdibleCoordinates);
            console.log("before offset");
            console.log(newLevel.edibleLocations);
            //newLevel.edibleLocations = applyLevelOffset(newLevel);
            console.log("ather offset");
            console.log(newLevel.edibleLocations);
            break;
        //g
        case 2:
            newLevel = Level2;
            newLevel.edibleLocations=[];
            newLevel.edibleLocations = appendCoordArrays(edibleCoordsForLevel, level2AddtionalEdibleCoordinates);
            //newLevel.edibleLocations = applyLevelOffset(newLevel);
            break;
        //L1
        case 3:
            newLevel = Level3;
            newLevel.edibleLocations=[];
            newLevel.edibleLocations = appendCoordArrays(edibleCoordsForLevel, level3AddtionalEdibleCoordinates);
            //newLevel.edibleLocations = applyLevelOffset(newLevel);
            break;
        //L2
        case 4:
            newLevel = Level4;
            newLevel.edibleLocations=[];
            newLevel.edibleLocations = appendCoordArrays(edibleCoordsForLevel, level4AddtionalEdibleCoordinates);
            //newLevel.edibleLocations = applyLevelOffset(newLevel);
            break;
        //L3
        case 5:
            newLevel = Level5;
            newLevel.edibleLocations=[];
            newLevel.edibleLocations = appendCoordArrays(edibleCoordsForLevel, level5AddtionalEdibleCoordinates);
            //newLevel.edibleLocations = applyLevelOffset(newLevel);
            break;

        default:
            newLevel = Level1;
            newLevel.edibleLocations=[];
            newLevel.edibleLocations = appendCoordArrays(edibleCoordsForLevel, level1AddtionalEdibleCoordinates);
            //newLevel.edibleLocations = applyLevelOffset(newLevel);
            break;


    }

    return newLevel;
}




function isCollision(obj1:RenderableObject,obj2:RenderableObject){

    if(
        obj1._coords.x + obj1._width >= obj2._coords.x &&
        obj1._coords.x <=  obj2._coords.x + obj2._width &&
        obj1._coords.y + obj1._height >= obj2._coords.y &&
        obj1._coords.y <=  obj2._coords.y + obj2._height

    ){

        return true;
    }
    return false;

}


function appendCoordArrays(coords1:Coordinate[],coords2:Coordinate[]){
    const newArray = [];

    for(const cord of coords1){
        newArray.push(cord);
    }
    for(const cord of coords2){
        newArray.push(cord);
    }
    return newArray;
}

/**
 * Grab some nodes from the backend
 * @return ALL nodes from the backend
 */
async function grabSomeNodes(): Promise<Array<Array<Node>>> {
    const theNodes: Array<Array<Node>> = new Array<Array<Node>>;
    for (let i: number = 0; i < 6; i++) {
        theNodes[i] = multipleNodeDataBaseToNode((await axios.get<NodeDataBase[]>
        ("/api/load-nodes/floorWithHalls", {params: {floor: i}})).data);
    }
    return theNodes;
}
