import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";
import EchidnaImg from "../../images/WongMan/echidna.png";
import EchidnaImgHalf from "../../images/WongMan/echidnaHalf.png";
import EchidnaImgOpen from "../../images/WongMan/echidnaOpen.png";
import EchidnaClosed from "../../images/WongMan/echidnaClosed.png";
import {RenderableObject} from "./RenderableObject.ts";

export class Echidna extends RenderableObject{


    private _direction:Directions_Game;
    private _currentIcon:number;
    private static readonly FRAMES_BETWEEN_ANIMATION_CHANGE = 8;
    private static readonly ANTIMATION_FRAMES = [EchidnaClosed,EchidnaImg,EchidnaImgHalf,EchidnaImgOpen,EchidnaImgHalf,EchidnaImg];

    private isMoving = false;

    constructor(coords:Coordinate,width:number,height:number,direction:Directions_Game) {
        super(coords,width,height);
        this._direction = direction;
        this._currentIcon = 0;
    }

    public render(renderer:CanvasRenderingContext2D, renderCount:number){
        const img = document.createElement("img");

        this.setIcon(renderCount);
        img.src = Echidna.ANTIMATION_FRAMES[this._currentIcon];



        //handle rotation
        //save current context
        renderer.save();
        //move icon center to 0,0
        renderer.translate(this._coords.x + this._width/2,this._coords.y+this._height/2);

        let roateAmount =this.setRotation(renderer);

        roateAmount = roateAmount* Math.PI / 180;

        //rotate the canvas
        renderer.rotate(roateAmount);

        //redraw the image with the roation (top left needs to be moved off the canvas for a proper drawing)
        renderer.drawImage(img,
            -this._width/2,
            -this._height/2,
            this._width,
            this._height
        );

        //reload the render to remake the cordnate system how it was
        renderer.restore();

        //change icon to continue animation


    }

    private setIcon(renderCount:number){

        if(renderCount % Echidna.FRAMES_BETWEEN_ANIMATION_CHANGE == 0 && this.isMoving ) {
            if(this._currentIcon==Echidna.ANTIMATION_FRAMES.length-1){
                this._currentIcon =0;
            }
            else{
                this._currentIcon++;
            }
        }
        else if (renderCount % Echidna.FRAMES_BETWEEN_ANIMATION_CHANGE == 0){


            if(this._currentIcon!=0){
                if(this._currentIcon == Echidna.ANTIMATION_FRAMES.length-1){
                    this._currentIcon =0;

                }
                else {
                    this._currentIcon++;
                }
            }

        }


    }

    private setRotation(renderer:CanvasRenderingContext2D){

        switch (this._direction) {

            // for left rotations also flip the image
            case Directions_Game.LEFT:
                renderer.scale(-1,1);
                return 0;
            case Directions_Game.UPLEFT:
                renderer.scale(-1,1);
                return -45;
            case Directions_Game.DOWNLEFT:
                renderer.scale(-1,1);
                return 45;

            case Directions_Game.RIGHT: return 0;
            case Directions_Game.UP: return 270;
            case Directions_Game.DOWN: return 90;
            case Directions_Game.UPRIGHT: return -45;
            case Directions_Game.DOWNRIGHT: return 45;

        }


    }

    public getDirection(): Directions_Game {
        return this._direction;
    }

    public setDirection(value: Directions_Game) {
        this._direction = value;
    }
    public getHeight(): number {
        return this._height;
    }

    public setHeight(value: number) {
        this._height = value;
    }
    public getWidth(): number {
        return this._width;
    }

    public setWidth(value: number) {
        this._width = value;
    }
    public getCoords(): Coordinate {
        return this._coords;
    }

    public setCoords(value: Coordinate) {
        this._coords = value;
    }

    public setXCoord(value: number) {
        this._coords.x=value;
    }

    public setYCoord(value: number) {
        this._coords.y=value;
    }

    public setIsMoving(value: boolean) {
        this.isMoving = value;
    }

    public getIsMoving() {
        return this.isMoving;
    }




}

export enum Directions_Game{
    LEFT,
    RIGHT,
    DOWN ,
    UP,
    UPLEFT,
    UPRIGHT,
    DOWNLEFT,
    DOWNRIGHT


}


