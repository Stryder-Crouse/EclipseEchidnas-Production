import {Coordinate} from "common/src/algorithms/Graph/Coordinate.ts";
import {RenderableObject} from "./RenderableObject.ts";


export class Wong extends RenderableObject{

    private topFace:TopFace;
    private botFace:BotFace;
    private backBar:BackBar;
    private speed:number;
    private speedRight:number;

    private wongStopY:number;

    constructor(coords:Coordinate,width:number,height:number
        , topFaceSrc:string, botFaceSrc:string,speed:number, screenHeight:number, speedRight:number) {
        super(coords,width,height);

       this.topFace = new TopFace({x:coords.x,y:screenHeight/8},440,220,topFaceSrc);

        this.botFace = new BotFace(
            {x:coords.x,y:screenHeight/8+225}
            ,440,220,botFaceSrc);
        this.backBar = new BackBar({x:coords.x,y:0}
            ,20,screenHeight);
        this.speed =speed;
        this.wongStopY = (screenHeight/8)*5;
        this.speedRight=speedRight;
    }

    public render(renderer:CanvasRenderingContext2D){

        if(this.botFace._coords.y  - this.topFace._coords.y <= 220){
            this.speed = -this.speed;
        }
        else if(this.botFace._coords.y  - this.topFace._coords.y  > this.wongStopY){
            this.speed = -this.speed;
        }

        this.botFace._coords.y-=this.speed;

        this.backBar._coords.x+=this.speedRight;
        this.botFace._coords.x+=this.speedRight;
        this.topFace._coords.x+=this.speedRight;


        this.backBar.render(renderer);
        this.botFace.render(renderer);
        this.topFace.render(renderer);


    }

    public getTopFace(){
        return this.topFace;
    }
    public getBopFace(){
        return this.botFace;
    }
    public getBlackBar(){
        return this.backBar;
    }



}

class TopFace extends RenderableObject{

    private topFaceSrc:string;

    constructor(coords:Coordinate,width:number,height:number
        , topFaceSrc:string) {
        super(coords,width,height);
        this.topFaceSrc=topFaceSrc;

    }
    render(renderer: CanvasRenderingContext2D): void {
        const img = document.createElement("img");
        img.src = this.topFaceSrc;
        renderer.drawImage(img,
            this._coords.x,
            this._coords.y,
            this._width,
            this._height
        );
    }


}

class BotFace extends RenderableObject{
    private botFaceSrc:string;
    constructor(coords:Coordinate,width:number,height:number
        , botFaceSrc:string) {
        super(coords,width,height);
        this.botFaceSrc=botFaceSrc;

    }
    render(renderer: CanvasRenderingContext2D): void {
        const img = document.createElement("img");
        img.src = this.botFaceSrc;
        renderer.drawImage(img,
            this._coords.x,
            this._coords.y,
            this._width,
            this._height
        );
    }

}

class BackBar extends RenderableObject{
    constructor(coords:Coordinate,width:number,height:number) {
        super(coords,width,height);

    }
    render(renderer: CanvasRenderingContext2D): void {
        renderer.fillStyle = "black";
        renderer.fillRect(
            this._coords.x,
            this._coords.y,
            this._width,
            this._height
        );

    }

}
