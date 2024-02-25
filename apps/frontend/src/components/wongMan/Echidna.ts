import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";
import EchidnaImg from "../../images/WongMan/echidna.png";

export class Echidna{

    private _coords:Coordinate;
    private _width:number;
    private _height:number;
    private _direction:Directions_Game;


    constructor(coords:Coordinate,width:number,height:number,direction:Directions_Game) {
        this._coords = coords;
        this._width =width;
        this._height = height;
        this._direction = direction;
    }

    public render(renderer:CanvasRenderingContext2D){
        const img = document.createElement("img");
        img.src = EchidnaImg;
        renderer.drawImage(img,this._coords.x,this._coords.y,this._width,this._height);


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




}

export enum Directions_Game{
    LEFT,
    RIGHT,
    DOWN ,
    UP,


}
