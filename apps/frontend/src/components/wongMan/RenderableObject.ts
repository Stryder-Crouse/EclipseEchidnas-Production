import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";


export abstract class RenderableObject{
    _width:number;
    _height:number;
    _coords:Coordinate;

    constructor(coords:Coordinate,width:number,height:number) {
        this._coords = coords;
        this._width =width;
        this._height = height;
    }

    abstract render(renderer:CanvasRenderingContext2D, renderCount:number):void;


}
