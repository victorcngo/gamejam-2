import {
    radius,
    HIT_RANGE,
    timelineY,
    START_SPEED,
    hitZonePosition,
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
    constructor(index, initXPos, playerId,tick,intervalBetweenBeats) {
        this.game = new Game()
        this.app = this.game.app;
        this.index = index;
        this.circlePos = initXPos;
        this.playerID = playerId;
        this.radius = radius;
        this.direction = this.playerID === 1 ? -1 : 1
        this.player1 = this.game.player1.instance
        this.loadBackground(`/assets/icons/target-${this.playerID}.svg`);
        this.draw()

        this._tick = tick;
        this._intervalBetweenBeats = intervalBetweenBeats;
        this._timeLaunch = Date.now()

    }

    // TODO!! - Move it outside and run it one time per player. Make values of controller accessible in each target
    loadBackground(svgPath) {
        const texture = PIXI.Texture.from(svgPath);
        this.background = new PIXI.Sprite(texture);
        this.background.zIndex = 2;
        this.background.anchor.set(0.5, 0.5);
        this.background.scale.set(BASE_TARGET_SIZE * SCREEN_RATIO);
        this.background.x = this.circlePos;
        this.background.y = timelineY;
        this.app.stage.addChild(this.background);
    }

    // TODO - Plug this with the feedback range & sprites
    isHitCorrect() {
        // console.log(this.checkHitAccuracy());
        return this.checkHitAccuracy() !== "missed";
    }

    checkHitAccuracy() {
        const width = this.background.texture.frame.width * this.background.scale.x;
        const distance = Math.abs(this.circlePos - hitZonePosition);
        const distanceMax = (width / 2) * hitRangeMaxInPercentage * 0.01;

        // show hit zone in this container avec la HIT_RANGEMaxInPercentage
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

            // TODO - Replace the prout by a visual and audio feedback
            const texture = PIXI.Texture.from('./assets/icons/prout.svg')
            const prout = new PIXI.Sprite(texture)
            prout.anchor.set(0.5)
            prout.x = window.innerWidth / 2
            prout.y = timelineY
            this.app.stage.addChild(prout)

            this.game['player' + playerID].increaseCombo(1)

            await wait(200)
            this.app.stage.removeChild(prout)

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
        if(!this._startTime){
            this._startTime = Date.now()
            this._lastBeatTime = Date.now()
        }

        this._timeSinceStart = Date.now() - this._startTime
        if(this._timeSinceStart >= this._timeLaunch && !this._isDestroy){
            this._currentTime = Date.now()

            if(this._currentTime - this._lastBeatTime >= this._intervalBetweenBeats) {
                this._lastBeatTime = this._currentTime;
                if(this._timeSinceStart >= this._tick){
                    this._isDestroy = true
                    this.remove()
                }
            }

            this._timeSinceLastBeat = this._currentTime - this._lastBeatTime
            this._moveSpeed = Math.min(1, this._timeSinceLastBeat / this._intervalBetweenBeats)
            const targetPos = window.innerWidth * .5;
            this.circlePos = this._lerp(this.circlePos, targetPos, this._moveSpeed )
            this.draw();
        }

    }
}

