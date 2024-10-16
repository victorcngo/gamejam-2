export default class HitChou extends Chou {
    constructor(...args) {
        super(...args);
        this.type = 'hit'

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

        // Move the circle (for animation)
        move() {
            this.circlePos += this.speed;
        }
    
       
}