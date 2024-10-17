import Chou from './Chou.js'

export default class Hit extends Chou {
    constructor(container, direction, index, initXPos) {
        super(container, direction, index, initXPos)
        this.type = 'hit'
        this.drawChou()
    }

    isSuccessful() {
        this.isHitCorrect()
    }

    showFeedback() {
        this.color =  this.isHitCorrect() ? 0x00FF00 : 0xFF0000;
        this.drawChou()
    }

    drawChou() {
        this.circleGraphics.clear();
        this.circleGraphics.beginFill(this.color);
        this.circleGraphics.drawCircle(this.circlePos, 200, this.radius / 2);
        this.circleGraphics.endFill();

    }

    remove() {
        this.container.removeChild(this.circleGraphics);
    }

    move() {
        this.circlePos += 1;
        this.drawChou();
    }

    
       
}