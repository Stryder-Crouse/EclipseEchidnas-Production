import {Dispatch, SetStateAction, useRef, useState} from "react";
import {Directions_Game, Echidna} from "./Echidna.ts";
import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";
import {Edible} from "./Edible.ts";
import {Level1} from "./LevelNodesLocationList.ts";
import LowerLevel1Game from "../../images/WongMan/Maps/LowerLevel1.png";
import EdibleBlue from "../../images/WongMan/Edible/EdibleBlue.png";
// @ts-expect-error happy-dom is based
import {HTMLImageElement, KeyboardEvent} from "happy-dom";
import {WongLevel} from "./WongLevel.ts";

/* structures */
export type WongManProps = {
    visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
}

/** global variables 🤖 */
let IMG_WIDTH: number = 2560;
let IMG_HEIGHT: number = 1279;
const playerSpeed: number = 3;

export default function WongManGame({visible, setVisible}: WongManProps) {
    const [showGame, setShowGame] = useState(false);
    const [showStart, setShowStart] = useState(true);

    const canvasArea = useRef<HTMLCanvasElement>(null);
    const canvasContext = useRef<CanvasRenderingContext2D | null>(null);

    const echidna = useRef<Echidna | null>(null);
    const keysDown = useRef<number[]>([0, 0, 0, 0]);
    const renderCount = useRef(0);

    const currentLevel = useRef(0);
    const finishedLevel = useRef(false);
    const currentLevelEdibles = useRef([] as Edible[]);

    return (
        <div
            className={styleWongMan(visible)}>
            <button
                className={"absolute transition-all hover:bg-navy w-16 text-white p-3 ml-2 mt-2 bg-navStart rounded-full" +
                    " h-min font-semibold drop-shadow-lg z-[103]"}
                onClick={() => {
                    setVisible(false);
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

        /* change the level to 1 */
        changeLevel(Level1);

        /* start the main loop */
        setInterval(mainLoop, 20);
    }

    function changeLevel(level: WongLevel): void {
        /* make the new player */
        echidna.current = new Echidna(level.startLocation, 50, 50, Directions_Game.RIGHT);

        //set context
        canvasContext.current = canvasArea.current!.getContext("2d");

        //set how large the rendering area is
        canvasContext.current!.canvas.width = window.innerWidth;
        canvasContext.current!.canvas.height = window.innerHeight;

        //setup first levels nodes
        currentLevelEdibles.current = setLevelNodes(level.level, level.edibleLocations);
    }

    function handleKeyDown(event: KeyboardEvent) {
        console.log(event.code);
        switch (event.code) {
            //left arrow
            case "ArrowLeft":
                keysDown.current[0] = 1;
                break;
            //right arrow
            case "ArrowRight":
                keysDown.current[1] = 1;
                break;

            //up arrow
            case "ArrowUp":
                keysDown.current[2] = 1;
                break;
            //down arrow
            case "ArrowDown":
                keysDown.current[3] = 1;
                break;
        }
    }

    function handleKeyUp(event: KeyboardEvent) {
        switch (event.code) {
            //left arrow
            case "ArrowLeft":
                keysDown.current[0] = 0;
                break;
            //right arrow
            case "ArrowRight":
                keysDown.current[1] = 0;
                break;
            //up arrow
            case "ArrowUp":
                keysDown.current[2] = 0;
                break;
            //down arrow
            case "ArrowDown":
                keysDown.current[3] = 0;
                break;
        }
    }

    function mainLoop(): void {
        // clear cavus
        clear();

        //if a level has been finished then go to next level
        if (finishedLevel) {
            finishedLevel.current = false;
        }

        //draw the level
        drawLevelImg(currentLevel.current); // should be done at the start of every level instead

        //draw Edibles
        drawEdibles();

        handlePlayerMovement();
        echidna.current?.render(canvasContext.current!, renderCount.current);


        renderCount.current++;
    }

    function clear() {
        canvasContext.current?.clearRect(0, 0, canvasArea.current!.width, canvasArea.current!.height);
    }

    /**
     * Draw the map picture of the corresponding level.
     * @param level the number of the map to draw
     */
    function drawLevelImg(level: number): void {
        /* make */
        let levelSRC;

        /* switch */
        switch (level) {
            case 0:
                levelSRC = LowerLevel1Game;
                break;
            default:
                levelSRC = LowerLevel1Game;
        }

        /* set */
        const img: HTMLImageElement = document.createElement("img");
        img.src = levelSRC;
        IMG_WIDTH = img.x;
        IMG_HEIGHT = img.y;
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
        const playerMovementThisFrame: Coordinate = {x: 0, y: 0};

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
        //if player is not moving or not tell it (for animation)
        if (playerMovementThisFrame.x == 0 && playerMovementThisFrame.y == 0) {
            echidna.current?.setIsMoving(false);
        } else {
            echidna.current?.setIsMoving(true);
        }


        const newCoordinates = echidna.current!.getCoords()!;
        newCoordinates.x = newCoordinates.x + playerMovementThisFrame.x;
        newCoordinates.y = newCoordinates.y + playerMovementThisFrame.y;

        //handle rotation
        handleRotation(playerMovementThisFrame);

        echidna.current?.setCoords(newCoordinates);
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

/**
 * Set the nodes on this level.
 * @param level the level to draw
 * @param coordinates where the nodes are
 * @return a new array of Edibles
 */
function setLevelNodes(level: number, coordinates: Coordinate[]): Array<Edible> {
    /* make the array */
    const newEdibles: Array<Edible> = new Array<Edible>();

    /* for every provided coordinate */
    for (const coordinate of coordinates) {
        /* scale it */
        coordinate.x = scaleWidth(coordinate.x);
        coordinate.y = scaleHeight(coordinate.y);

        /* change the color based on level */
        switch (level) {
            case 0:
                newEdibles.push(new Edible(coordinate, 15, 15, EdibleBlue));
                break;
        }
    }

    /* real */
    return newEdibles;
}

function scaleWidth(desired: number): number {
    return desired * (window.innerWidth / IMG_WIDTH);
}

function scaleHeight(desired: number): number {
    return desired * (window.innerHeight / IMG_HEIGHT);
}
