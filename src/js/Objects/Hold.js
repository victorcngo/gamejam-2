import Chou from './Chou.js'
import {precision, holdBarHeight} from '../settings.js'
import * as PIXI from 'pixi.js'

export default class Hold extends Chou {
    constructor(length, container, direction, index,initXPos, playerId) {
        super(container, direction, index, initXPos, playerId)
        this.length = length;
        this.timer = length;
        this.type = 'hold'
        this.rectLength = length;
        this.barGraphics = new PIXI.Graphics();
        this.container.addChild(this.barGraphics);
        this.direction = this.playerID === 1 ? 1 : -1
    }

    move() {
        this.circlePos += this.direction
    }

    // Move the bar
    moveBar() {
        this.barPos += this.direction
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
        // draw according to direction
        if(this.direction === 1) {
            this.barGraphics.drawRect(this.barPos  - this.rectLength, 200 - holdBarHeight / 2, this.rectLength, holdBarHeight);
        } else {
            this.barGraphics.drawRect(this.barPos, 200 - holdBarHeight / 2, this.rectLength, holdBarHeight);
        }
        this.barGraphics.endFill();
    }

     // Update the timer (for holding action)
    updateTimer() {
        this.timer -= 1;
    }

    updateBar() {
        this.barPos += 0.75;
        this.rectLength -= 1;
    }

    isHoldCorrect() {
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