import {
    RADIUS,
    HIT_RANGE,
    TIMELINE_Y,
    START_SPEED,
    HIT_ZONE_POSITION,
    hitRangeMaxInPercentage,
    ACCURACY,
    SCREEN_RATIO
} from '../settings.js'
import Game from './Game.js'
import { wait } from '../utils/async/wait.js'
import Feedback from './Feedback.js';

import * as PIXI from "pixi.js";

const BASE_TARGET_SIZE = 3.5

export default class Target {
    constructor(index, initXPos, playerId) {
        this.game = new Game()
        this.app = this.game.app;
        this.index = index;
        this.circlePos = initXPos;
        this.playerID = playerId;
        this.radius = RADIUS;
        this.direction = this.playerID === 1 ? -1 : 1
        this.player1 = this.game.player1.instance
        this.loadBackground(`/assets/icons/target-${this.playerID}.svg`);
        this.draw()
    }

    // TODO!! - Move it outside and run it one time per player. Make values of controller accessible in each target
    loadBackground(svgPath) {
        const texture = PIXI.Texture.from(svgPath);
        this.background = new PIXI.Sprite(texture);
        this.background.zIndex = 2;
        this.background.anchor.set(0.5, 0.5);
        this.background.scale.set(BASE_TARGET_SIZE * SCREEN_RATIO);
        this.background.x = this.circlePos;
        this.background.y = TIMELINE_Y;
        this.background.zIndex = 2;
        this.app.stage.addChild(this.background);
    }

    // TODO - Plug this with the feedback range & sprites
    isHitCorrect() {
        return this.checkHitAccuracy() !== "missed";
    }

    checkHitAccuracy() {
        const width = this.background.texture.frame.width * this.background.scale.x;
        const distance = Math.abs(this.circlePos - HIT_ZONE_POSITION);
        const distanceMax = (width / 2) * hitRangeMaxInPercentage * 0.01;

        if (distance < distanceMax) {
            const successInPercentage = 100 - (distance / distanceMax) * 100;

            if (successInPercentage > ACCURACY.bad) {
                if (successInPercentage > ACCURACY.good) {

                    if (successInPercentage > ACCURACY.perfect) {
                        return "perfect";
                    }

                    return "good";
                }
                return "bad";
            }
            return "missed";
        }
        else {
            return "missed";
        }
    }

    hasExpired() {
        if (this.playerID === 1) return this.circlePos > HIT_RANGE[1];
        if (this.playerID === 2) return this.circlePos < HIT_RANGE[0];
    }

    async showFeedback(playerID) {
        const feedback = new Feedback(this.checkHitAccuracy(), playerID)
        feedback.init()

        if (this.isHitCorrect()) {
            this.game['player' + playerID].triggerAnimation("success")

            this.game['player' + playerID].increaseCombo(1)

            await wait(200)
            this.app.stage.removeChild(feedback)
        } else {
            this.game['player' + playerID].resetCombo()
            this.game['player' + playerID].triggerAnimation("missed")
        }
    }

    draw() {
        this.background.x = this.circlePos
    }

    remove() {
        this.app.stage.removeChild(this.background);
    }

    move() {
        this.circlePos += (-this.direction) * this.game.speed;
        this.draw();
    }
}

