export class GameSound{

    public soundElement:HTMLAudioElement;

    constructor(soundSRC:string) {
        this.soundElement = document.createElement("audio");
        this.soundElement.src = soundSRC;
        this.soundElement.setAttribute("preload", "auto");
        this.soundElement.setAttribute("controls", "none");
        this.soundElement.style.display = "none";
    }

    public async startSound() {
        await this.soundElement.play();
    }

    public async stopSound() {
        await this.soundElement.play();
    }

}
