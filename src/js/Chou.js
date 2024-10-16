import {radius, holdBarHeight} from './settings.js'
import * as PIXI from 'pixi.js'

export default class Chou {
    constructor(container, direction, length, index, type, initXPos) {
        this.direction = direction;
        this.length = length;
        this.speed = 1;
        this.type = type;
        this.index = index;
        this.radius = radius;
        this.timer = length;
        this.rectLength = length;
        this.circlePos = initXPos;
        this.barPos = initXPos;
        this.color = this.getRandomColor();
        this.container = container;

        // Create the circle and bar graphics
        this.circleGraphics = new PIXI.Graphics();
        this.barGraphics = new PIXI.Graphics();

        this.drawChou();
        this.container.addChild(this.circleGraphics);
        this.container.addChild(this.barGraphics);
    }

    // Get random color
    getRandomColor() {
        return Math.random() * 0xFFFFFF;
    }

    // Draw the Chou (circle and bar)
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

    // Move the circle (for animation)
    move() {
        this.circlePos += this.speed;
        this.drawChou();
    }

    // Move the bar
    moveBar() {
        this.barPos += this.speed;
        this.drawChou();
    }

    // Update the timer (for holding action)
    updateTimer() {
        this.timer--;
    }

    remove() {
        this.container.removeChild(this.circleGraphics);
        this.container.removeChild(this.barGraphics);
    }
}