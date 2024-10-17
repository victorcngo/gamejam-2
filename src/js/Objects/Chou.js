import {radius, holdBarHeight, hitZone, precision} from '../settings.js'
import * as PIXI from 'pixi.js'

export default class Chou {
    constructor(container, direction, index,initXPos) {
        this.direction = direction;
        this.speed = 1;
        this.index = index;
        this.radius = radius;
        this.circlePos = initXPos;
        this.barPos = initXPos;
        this.color = this.getRandomColor();
        this.container = container;

        // Create the circle and bar graphics
        this.circleGraphics = new PIXI.Graphics();
        this.container.addChild(this.circleGraphics);

    }

    // Get random color
    getRandomColor() {
        return Math.random() * 0xFFFFFF;
    }


    remove() {
        this.container.removeChild(this.circleGraphics);
    }

    isHitCorrect() {
        return this.circlePos > hitZone - precision && this.circlePos < hitZone + precision;

    }

}