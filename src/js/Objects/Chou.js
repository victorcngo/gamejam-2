import {radius, holdBarHeight, hitZone, precision} from '../settings.js'
import * as PIXI from 'pixi.js'

export default class Chou {
    constructor(container, direction, index, type, initXPos) {
        this.direction = direction;
        // this.length = length;
        this.speed = 1;
        this.type = type;
        this.index = index;
        this.radius = radius;
        // this.timer = length;
        
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


    remove() {
        this.container.removeChild(this.circleGraphics);
        this.container.removeChild(this.barGraphics);
    }

    isHitCorrect() {
        return this.circlePos > hitZone - precision && this.circlePos < hitZone + precision;

    }
}