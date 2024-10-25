import Target from './Target1.js';
import * as PIXI from 'pixi.js'
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
import Game from './Game1.js';
import Feedback from './Feedback1.js';
import { wait } from '../utils/async/wait.js';

const BASE_TARGET_SIZE = .3;

export default class FartTarget extends Target {
    constructor(index, initXPos, playerId) {
        super(index, initXPos, playerId)
    }

    loadBackground(svgPath) {
        const texture = PIXI.Texture.from(`/assets/icons/fart-target.png`);
        this.background = new PIXI.Sprite(texture);
        this.background.anchor.set(0.5, 0.5);
        this.background.scale.set(BASE_TARGET_SIZE * SCREEN_RATIO);
        this.background.x = window.innerWidth / 2;
        this.background.y = TIMELINE_Y;
        this.app.stage.addChild(this.background);
    }

    draw() {
        this.background.x = this.circlePos;
    }

    move() {
        this.background.x += (-this.direction) * this.game.speed;
    }

    remove() {
        this.app.stage.removeChild(this.background);
    }

    hasExpired() {
        if (this.playerID === 1) return this.background.x > HIT_RANGE[1];
        if (this.playerID === 2) return this.background.x < HIT_RANGE[0];
    }

    isHitCorrect() {
        return this.checkHitAccuracy() !== "missed";
    }

    checkHitAccuracy() {
        const width = this.background.texture.frame.width * this.background.scale.x;
        const distance = Math.abs(this.background.x - HIT_ZONE_POSITION);
        const distanceMax = (width / 2) * hitRangeMaxInPercentage * 0.01;

        if (distance < distanceMax) {
            const successInPercentage = 100 - (distance / distanceMax) * 100;
            if (successInPercentage > ACCURACY.bof) {
                return "success";
            }
            return "missed";
        }
        else {
            return "missed";
        }
    }

    async showFeedback(playerID) {
        if (this.isHitCorrect()) {
            this.game['player' + playerID].triggerAnimation("fart")
            this.game['player' + playerID].hasFart = true
        } else {
            this.game['player' + playerID].triggerAnimation("missed")
            this.game['player' + playerID].hasFart = false
        }
    }
}
