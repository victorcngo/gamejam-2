import Chou from './Chou.js'
import {precision, holdBarHeight} from '../settings.js'

export default class HoldChou extends Chou {
    constructor(length, ...args) {
        super(...args);
        this.length = length;
        this.timer = length;
        console.log("timer at init", length)
        this.type = 'hold'
        this.rectLength = length;
 

    }

    move() {
        this.circlePos += 1;
        // this.moveBar();
    }

    // Move the bar
    moveBar() {
        console.log("move bar")
        this.barPos += 1;
        this.drawChou();
    }


    drawChou() {
        this.circleGraphics.clear();
        this.circleGraphics.beginFill(this.color);
        this.circleGraphics.drawCircle(this.circlePos, 200, this.radius / 2);
        this.circleGraphics.endFill();

        // Draw the bar
        this.barGraphics.clear();
        this.barGraphics.beginFill(this.color);  // Black color for bar
        this.barGraphics.drawRect(this.barPos - this.rectLength, 200 - holdBarHeight / 2, this.rectLength, holdBarHeight);
        this.barGraphics.endFill();
    }

     // Update the timer (for holding action)
    updateTimer() {
        console.log("timer", this.timer)
        this.timer -= 1;
    }

    isSuccessful() {
        this.isHitCorrect() && this.isHoldCorrect()
    }

    isHoldCorrect() {
        // return this.timer > - precision && this.timer < precision
        return this.timer < - precision ? false : true
    }

    showFeedback() {
        this.color =  this.isSuccessful() ? 0x00FF00 : 0xFF0000;
    }

    timeIsUp() {
        return this.timer < - precision ? false : true
    }
}