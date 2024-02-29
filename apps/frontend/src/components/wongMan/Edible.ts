import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";
import {RenderableObject} from "./RenderableObject.ts";

export class Edible extends RenderableObject{

    private _edibleImageSrc:string;
    private eatean:boolean;

    constructor(coords:Coordinate,width:number,height:number
                , edibleImageSrc:string) {
        super(coords,width,height);
        this._edibleImageSrc =edibleImageSrc;
        this.eatean=false;
    }

    public render(renderer:CanvasRenderingContext2D){
        if(!this.eatean) {
            const img = document.createElement("img");
            img.src = this._edibleImageSrc;
            renderer.drawImage(img,
                this._coords.x,
                this._coords.y,
                this._width,
                this._height
            );
        }
    }

    public setEatean(value: boolean) {
        this.eatean = value;
    }
    public getEatean(): boolean {
        return this.eatean;
    }

}
