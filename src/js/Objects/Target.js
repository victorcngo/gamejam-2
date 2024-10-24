import { radius, hitRange, timelineY, startSpeed, hitZonePosition, hitRangeMaxInPercentage, accuracy } from '../settings.js'
import Game from './Game.js'
import { wait } from './../utils/async/wait.js'

import * as PIXI from "pixi.js";

// All targets type extend this base class. Put all logic common to all targets here
export default class Target {
    constructor(container, direction, index, initXPos, playerId) {
        this.direction = direction;
        this.game = new Game()
        this.index = index;
        this.radius = radius;
        this.circlePos = initXPos;
        this.barPos = initXPos;
        this.playerID = playerId;
        this.color = this.playerID === 1 ? '0xE63C49' : '0xFFA541';
        this.container = container;
        this.app = this.game.app;

        this.type = 'hit'
        this.direction = this.playerID === 1 ? -1 : 1

        this.player1 = this.game.player1.instance

        this.loadBackground(`/assets/icons/chou-${this.playerID}.svg`);

        this.drawChou()
    }

  // TODO : move it outside and run it one time per player. Make values of controller accessible in each target

    loadBackground(svgPath) {
        const texture = PIXI.Texture.from(svgPath);
        this.background = new PIXI.Sprite(texture);
        this.background.anchor.set(0.5, 0.5);
        this.background.scale.set(2, 2);
        this.background.x = this.circlePos;
        this.background.y = timelineY;
        this.container.addChild(this.background);
    }

    getColor() {
        return this.playerID === 1 ? 0x0000ff : 0x00ffff;
    }

    remove() {
        this.container.removeChild(this.background);
    }

    isHitCorrect() {
        const checkHitAccuracy = this.checkHitAccuracy();
        return checkHitAccuracy !== "missed";
    }

    checkHitAccuracy() {
        const width = this.background.texture.frame.width * this.background.scale.x;
        const distance = Math.abs(this.circlePos - hitZonePosition);
        const distanceMax = (width / 2) * hitRangeMaxInPercentage * 0.01;

        // show hit zone in this container avec la hitRangeMaxInPercentage
        // if (!this.hitZoneGraphics) {
        //   this.hitZoneGraphics = new PIXI.Graphics()
        //     .beginFill(0xff0000, 0.2) // Set the fill color and transparency
        //     .drawRect(
        //       hitZonePosition - distanceMax,
        //       timelineY - 50,
        //       distanceMax * 2,
        //       100
        //     )
        //     .endFill();
        //   this.container.addChild(this.hitZoneGraphics);
        // }

        if (distance < distanceMax) {
        const successInPercentage = 100 - (distance / distanceMax) * 100;

        if (successInPercentage > accuracy.bad) {
            if (successInPercentage > accuracy.good) {
            if (successInPercentage > accuracy.perfect) {
                return "perfect";
            }
            return "good";
            }
            return "bad";
        }
        return "missed";
        } else {
        return "missed";
        }
    }

    isMissed() {
    if (this.playerID === 1) return this.circlePos > hitRange[1];
    if (this.playerID === 2) return this.circlePos < hitRange[0];
    // if direction
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
    }

    move() {
        this.circlePos += (-this.direction) * this.game.speed;
        this.drawChou();
    }
}

