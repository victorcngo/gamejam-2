import Chou from './Chou.js'
import { precision, holdBarHeight, timelineY } from '../settings.js'
import * as PIXI from 'pixi.js'
import { showProut } from '../main.js'

export default class Hold extends Chou {
    constructor(length, container, joystickDirection, index, initXPos) {
        super(container, joystickDirection, index, initXPos)
        this.length = length;
        this.timer = length;
        this.type = 'hold'
        this.rectLength = length;
        this.barGraphics = new PIXI.Graphics();
        this.container.addChild(this.barGraphics);

        this.loadFleche('/assets/icons/fleche.svg', joystickDirection);
    }

    loadFleche(svgPath, joystickDirection) {
        const texture = PIXI.Texture.from(svgPath);

        this.fleche = new PIXI.Sprite(texture);
        this.fleche.anchor.set(0.5)

        switch (joystickDirection) {
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
        this.circlePos += 1;
    }

    // Move the bar
    moveBar() {
        this.barPos += 1;
        this.drawChou();
    }


    drawChou() {
        this.background.x = this.circlePos
        this.fleche.x = this.circlePos

        // Draw the bar
        this.barGraphics.clear();
        this.barGraphics.beginFill(this.color);  // Black color for bar
        this.barGraphics.drawRect(this.barPos - this.rectLength, timelineY - holdBarHeight / 2, this.rectLength, holdBarHeight);
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

    showFeedback(container) {
        this.color = this.isHoldCorrect() ? 0x00FF00 : 0xFF0000;
        if (this.isHoldCorrect()) showProut(container);
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