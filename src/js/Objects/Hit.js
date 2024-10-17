import Chou from './Chou.js'
import * as PIXI from 'pixi.js'
import { timelineY } from '../settings.js'
import { showProut } from '../main.js'

export default class Hit extends Chou {
    constructor(container, joystickDirection, index, initXPos) {
        super(container, joystickDirection, index, initXPos)
        this.type = 'hit'

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

    isSuccessful() {
        this.isHitCorrect()
    }

    showFeedback(container) {
        this.color = this.isHitCorrect() ? 0x00FF00 : 0xFF0000;
        if (this.isHitCorrect()) showProut(container);
    }

    drawChou() {
        this.background.x = this.circlePos
        this.fleche.x = this.circlePos
    }

    remove() {
        this.container.removeChild(this.background);
        this.container.removeChild(this.fleche);
    }

    move() {
        this.circlePos += 1;
        this.drawChou();
    }
}