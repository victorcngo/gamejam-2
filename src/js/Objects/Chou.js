import {radius, holdBarHeight, hitZone, precision, hitRange} from '../settings.js'
import * as PIXI from 'pixi.js'

export default class Chou {
    constructor(container, direction, index,initXPos, playerId) {
        this.direction = direction;
        this.speed = 1;
        this.index = index;
        this.radius = radius;
        this.circlePos = initXPos;
        this.barPos = initXPos;
        this.color = Math.random() * 0xFFFFFF*this.getColor();
        this.container = container;
        this.playerID = playerId;

        // Create the circle and bar graphics
        this.circleGraphics = new PIXI.Graphics();
        this.container.addChild(this.circleGraphics);
    }

    // Get random color
    getColor() {
       return this.playerID === 1 ? 0x0000FF :  0x00FFFF;
    }


    remove() {
        this.container.removeChild(this.circleGraphics);
    }

    isHitCorrect() {
        return this.isInHitRange()
    }

    isInHitRange() {
        return this.circlePos > hitRange[0] && this.circlePos < hitRange[1] ? true : false
     }

    isMissed() {
        if(this.playerID === 1) return this.circlePos > hitRange[1]
        if(this.playerID === 2) return this.circlePos < hitRange[0]
        // if direction 
    }

}