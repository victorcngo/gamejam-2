import { radius, holdBarHeight, hitZone, precision, timelineY } from '../settings.js'
import * as PIXI from 'pixi.js'

export default class Chou {
    constructor(container, joystickDirection, index, initXPos) {
        this.playerId = 2
        this.joystickDirection = joystickDirection;
        this.speed = 1;
        this.index = index;
        this.radius = radius;
        this.circlePos = initXPos;
        this.barPos = initXPos;
        this.color = this.playerId === 1 ? '0xE63C49' : '0xFFA541';
        this.container = container;

        // Create the circle and bar graphics
        this.circleGraphics = new PIXI.Graphics();
        this.container.addChild(this.circleGraphics);

        this.loadBackground(`/assets/icons/chou-${this.playerId}.svg`);
    }

    loadBackground(svgPath) {
        const texture = PIXI.Texture.from(svgPath);
        this.background = new PIXI.Sprite(texture);
        this.background.anchor.set(0.5);
        this.background.x = this.circlePos;
        this.background.y = timelineY;
        this.container.addChild(this.background);
    }

    // Get random color
    getRandomColor() {
        return Math.random() * 0xFFFFFF;
    }


    remove() {
        this.container.removeChild(this.circleGraphics);
        this.container.removeChild(this.background);
    }

    isHitCorrect() {
        return this.circlePos > hitZone - precision && this.circlePos < hitZone + precision;

    }
}