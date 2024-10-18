import Chou from './Target.js'
import { precision, holdBarHeight, timelineY, speed } from '../settings.js'
import * as PIXI from 'pixi.js'
export default class Hold extends Chou {
    constructor(length, container, direction, index,initXPos, playerId, arrowType) {
        super(container, direction, index, initXPos, playerId)
        this.length = length;
        this.timer = length;
        this.type = 'hold'
        this.rectLength = length;
        this.barGraphics = new PIXI.Graphics();
        this.container.addChild(this.barGraphics);
        this.direction = this.playerID === 1 ? 1 : -1
        this.loadFleche('/assets/icons/fleche.svg', arrowType);
    }

    loadFleche(svgPath, arrowType) {
        const texture = PIXI.Texture.from(svgPath);
        this.fleche = new PIXI.Sprite(texture);
        this.fleche.anchor.set(0.5)

        switch (arrowType) {
            case 'left':
                this.fleche.rotation = Math.PI
                break;
            case 'right':
                this.fleche.rotation = 0
                break;
            case 'up':
                this.fleche.rotation = - Math.PI / 2
                break;
            case 'down':
                this.fleche.rotation = Math.PI / 2
                break;
            default:
                break;
        }

        this.fleche.x = this.circlePos;
        this.fleche.y = timelineY;

        this.container.addChild(this.fleche);
    }

    move() {
        this.circlePos += this.direction*speed
    }
    
    // Move the bar
    moveBar() {
        this.drawChou();
        this.barPos += this.direction*speed
    }


    drawChou() {
        // Draw the bar
        this.barGraphics.clear();
        this.barGraphics.beginFill(this.color);  // Black color for bar
        // draw according to direction
        if(this.direction === 1) {
            this.barGraphics.drawRect(this.barPos  - this.rectLength, timelineY - holdBarHeight / 2, this.rectLength, holdBarHeight);
        } else {
            this.barGraphics.drawRect(this.barPos, timelineY - holdBarHeight / 2, this.rectLength, holdBarHeight);
        }
        this.barGraphics.endFill();

        this.background.x = this.circlePos
        this.fleche.x = this.circlePos

    }

    // Update the timer (for holding action)
    updateTimer() {
        this.timer -= speed;
    }

    updateBar() {
        this.barPos += 0.75;
        this.rectLength -= speed;
    }

    isHoldCorrect() {
        return this.timer < precision && this.timer > - precision
    }

    showFeedback() {
        //this.color = this.isHoldCorrect() ? 0x00FF00 : 0xFF0000;
    }

    timeIsUp() {
        return this.timer < - precision ? true : false
    }

    remove() {
        this.container.removeChild(this.barGraphics);
        this.container.removeChild(this.background);
        this.container.removeChild(this.fleche);
    }
}