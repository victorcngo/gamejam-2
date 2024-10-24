import Target from './Target';
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
import Game from './Game';
import Feedback from './Feedback.js';
import { wait } from '../utils/async/wait.js';

const BASE_TARGET_SIZE = 1.5;

export default class FartTarget extends Target {
    constructor(index, initXPos, playerId) {
        super(index, initXPos, playerId)
        this.game = new Game()
        this.circlePos = initXPos;
        this.app = this.game.app;
        this.index = index;
        this.circlePos = initXPos;
        this.playerID = playerId;
        this.radius = RADIUS;
        this.direction = this.playerID === 1 ? -1 : 1;
        this.player1 = this.game.player1.instance;
        this.loadBackground(`/assets/icons/fart-target.svg`);
        this.draw();
    }

    loadBackground(svgPath) {
        const texture = PIXI.Texture.from(svgPath);
        this.background = new PIXI.Sprite(texture);
        this.background.anchor.set(0.5, 0.5);
        this.background.scale.set(BASE_TARGET_SIZE * SCREEN_RATIO);
        this.background.x = window.innerWidth / 2;
        // this.background.y = window.innerHeight / 2;
        // this.background.x = this.circlePos;
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

            if (successInPercentage > ACCURACY.bad) {
                return "success";
            }
            return "missed";
        }
        else {
            return "missed";
        }
    }

    async showFeedback(playerID) {
        const feedback = new Feedback(this.checkHitAccuracy(), playerID)
        feedback.init()


        if (this.isHitCorrect()) {
            this.game['player' + playerID].triggerAnimation("fart")

            this.game['player' + playerID].hasFart = true

            await wait(200)
            this.app.stage.removeChild(feedback)

        } else {
            this.game['player' + playerID].triggerAnimation("missed")

            this.game['player' + playerID].hasFart = false
        }
    }
}
