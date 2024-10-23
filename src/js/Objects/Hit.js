import Chou from './Target.js'
import Game from './Game.js'
import * as PIXI from 'pixi.js'
import { timelineY } from '../settings.js'
import { wait } from './../utils/async/wait.js'

export default class Hit extends Chou {
    timeout = null

    constructor(container, direction, index, initXPos, playerId) {
        super(container, direction, index, initXPos, playerId)
        this.type = 'hit'
        this.direction = this.playerID === 1 ? -1 : 1
        this.game = new Game()
        this.app = this.game.app
        this.drawChou()
    }

    async showFeedback(playerID) {
        if (this.isHitCorrect()) {
            const texture = PIXI.Texture.from('./assets/icons/prout.svg')
            const prout = new PIXI.Sprite(texture)
            prout.anchor.set(0.5)
            prout.x = window.innerWidth / 2
            prout.y = timelineY
            this.app.stage.addChild(prout)

            this.game['player' + playerID].increaseCombo(1)

            await wait(500)
            this.app.stage.removeChild(prout)

        } else {
            this.game['player' + playerID].resetCombo()
        }
    }

    drawChou() {
        this.background.x = this.circlePos
    }

    remove() {
        this.container.removeChild(this.background);
        clearTimeout(this.timeout);
    }

    move() {
        this.circlePos += (-this.direction) * this.game.speed;
        this.drawChou();
    }
}
