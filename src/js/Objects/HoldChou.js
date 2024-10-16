import Chou from './Chou.js'
import {precision, holdBarHeight} from '../settings.js'
import * as PIXI from 'pixi.js'

export default class HoldChou extends Chou {
    constructor(length, container, direction, index, type, initXPos) {
        super(container, direction, index, type, initXPos)
        this.length = length;
        this.timer = length;
        this.type = 'hold'
        this.rectLength = length;
        this.barGraphics = new PIXI.Graphics();
        this.container.addChild(this.barGraphics);
    }

    move() {
        this.circlePos += 1;
    }

    // Move the bar
    moveBar() {
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
        this.timer -= 1;
    }

    isHoldCorrect() {
        // return this.timer > - precision && this.timer < precision
        return this.timer < precision && this.timer > - precision
    }

    showFeedback() {
        this.color =  this.isHoldCorrect() ? 0x00FF00 : 0xFF0000;
    }

    timeIsUp() {
        return this.timer < - precision ? true : false
    }

    remove() {
        this.container.removeChild(this.circleGraphics);
        this.container.removeChild(this.barGraphics);
   
    }
}