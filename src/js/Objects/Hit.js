import Chou from './Target.js'
import Game from './Game.js'
import * as PIXI from 'pixi.js'
import { timelineY } from '../settings.js'

export default class Hit extends Chou {
    constructor(container, direction, index, initXPos, playerId, arrowType) {
        super(container, direction, index, initXPos, playerId)
        this.type = 'hit'
        this.direction = this.playerID === 1 ? -1 : 1
        this.game = new Game()
        this.app = this.game.app
        this.drawChou()
    }

    showFeedback() {
        if (this.isHitCorrect()) {
            const texture = PIXI.Texture.from('./assets/icons/prout.svg');
            const prout = new PIXI.Sprite(texture);
            prout.anchor.set(0.5);
            prout.x = window.innerWidth / 2;
            prout.y = timelineY;
            this.app.stage.addChild(prout);

            setTimeout(() => {
                this.app.stage.removeChild(prout);
            }, 500);
        }
    }

    drawChou() {
        this.background.x = this.circlePos
    }

    remove() {
        this.container.removeChild(this.background);
        this.container.removeChild(this.fleche);
    }

    move() {
        this.circlePos += (-this.direction) * this.game.speed;
        this.drawChou();
    }
}
