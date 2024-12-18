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
import Game from './Game1.js'
import { wait } from '../utils/async/wait.js'
import Feedback from './Feedback1.js';
import {gsap} from "gsap"

import * as PIXI from "pixi.js";

const BASE_TARGET_SIZE = 0.6

export default class Target {
    constructor(index, initXPos, playerId,indexTargetBeat,intervalBetweenBeats,objectBeat) {
        this.game = new Game()
        this.app = this.game.app;
        this.index = index;
        this.circlePos = initXPos;
        this.playerID = playerId;
        this.radius = RADIUS;
        this.direction = this.playerID === 1 ? -1 : 1
        this.player1 = this.game.player1.instance
        this.loadBackground(`/assets/icons/target-${this.playerID}.png`);
        this.draw()

        this._indexTargetBeat = indexTargetBeat;
        this._intervalBetweenBeats = intervalBetweenBeats;
        this._objectBeat = objectBeat
        this._iBeat = 0
        this._inDestroy = false
        this._alreadyCheck = false
        this._isHit = false
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
        this.background.visible = false;
        this.app.stage.addChild(this.background);
    }

    isHitCorrect(accuracy) {
        return accuracy !== "missed";
    }

    checkHitAccuracy() {
        const width = this.background.texture.frame.width * this.background.scale.x;
        const distance = Math.abs(this.circlePos - HIT_ZONE_POSITION);
        const distanceMax = (width / 2) * hitRangeMaxInPercentage * 0.01;


        const currentBeatTime = this._currentTime - this._lastBeatTime
        const percent = currentBeatTime/this._intervalBetweenBeats * 100

        console.log(percent)
        if (distance < distanceMax) {
            const successInPercentage = 100 - (distance / distanceMax) * 100;

            if (successInPercentage > ACCURACY.bof && percent > ACCURACY.bof) {
                if (successInPercentage > ACCURACY.cool && percent > ACCURACY.cool) {
                    if (successInPercentage > ACCURACY.perfect && percent > ACCURACY.perfect) {
                        return "perfect";
                    }
                    return "cool";
                }
                return "bof";
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
        if(!this._alreadyCheck && !this._inDestroy){
            this._alreadyCheck = true

            const accuracy = this.checkHitAccuracy()
            const feedback = new Feedback(accuracy, playerID)
            feedback.init()

            if (this.isHitCorrect(accuracy)) {
                this._inDestroy = true
                this._isHit = true
                this.animHit()

                if (accuracy === "perfect") {
                    this.game['player' + playerID].triggerAnimation("success")
                    this.game['player' + playerID].increaseCombo(1)
                    this.game['player' + playerID].incrementScore(10)
                    this.game.audioManager.sounds["perfect"].volume = 0.3
                    this.game.audioManager.play("perfect")
                }

                if (accuracy === "cool") {
                    this.game['player' + playerID].incrementScore(5)
                    this.game.audioManager.sounds["cool"].volume = 0.075
                    this.game.audioManager.play("cool")
                }

                if (accuracy === "bof") {
                    this.game['player' + playerID].incrementScore(1)
                    this.game.audioManager.sounds["bof"].volume = 0.1
                    this.game.audioManager.play("bof")
                }
            } else {
                this.game['player' + playerID].resetCombo()
                this.game['player' + playerID].triggerAnimation("missed")
                this.game.audioManager.sounds["missed"].volume = 0.1
                this.game.audioManager.play("missed")
            }

        }
    }

    animHit(){
        gsap.timeline().to(this.background.scale,{
            x: this.background.scale.x * 1.25,
            y: this.background.scale.y * 1.25,
            duration: (this._intervalBetweenBeats/1000)*.5,
            ease: "elastic.out(1, 0.3)",
        }).to(this.background,{
            alpha:0,
            duration:this._intervalBetweenBeats/1000*.75,
            ease: "power2.out",
            onComplete: () => {
                this.app.stage.removeChild(this.background)
            }
        })
    }

    draw() {
        this.background.x = this.circlePos
    }

    remove() {
        if(!this._isHit){
            this._inDestroy = true
            gsap.timeline()
                .to(this.background,{
                    y: this.background.y + 200*SCREEN_RATIO,
                    duration: (this._intervalBetweenBeats/1000),
                    ease: "power2.out",
                })
                .to(this.background,{
                    alpha:0,
                    duration:this._intervalBetweenBeats/1000,
                    ease: "power2.out",

                },"<")
                .to(this.background.scale,{
                    x: this.background.scale.x *.75,
                    y: this.background.scale.y *.75,
                    duration: (this._intervalBetweenBeats/1000),
                    ease: "back.out(2)",
                    onComplete: () => {
                        this.app.stage.removeChild(this.background)
                    }
                },"<")
        }

    }

    _lerp(start, end, t) {
        return start + (end - start) * t;
    }

    move() {
        if(!this._inDestroy && !this._isHit){
            if(!this._startTime){
                this._startTime = Date.now()
                this._lastBeatTime = Date.now()
            }

            this._currentTime = Date.now()
            let targetPos = window.innerWidth*.5;


            if(this._currentTime - this._lastBeatTime >= this._intervalBetweenBeats  ) {
                this._lastBeatTime = this._currentTime;
                if(this.game.melodyPlayer.player.isPlaying()){
                    this._iBeat += 1
                    if(this._iBeat === this._indexTargetBeat-1){
                        this.game.idxTarget[this.playerID] = this._indexTargetBeat
                        gsap.fromTo(this.background.scale,{x:BASE_TARGET_SIZE * SCREEN_RATIO * 0.75,y:BASE_TARGET_SIZE * SCREEN_RATIO *.75}, {
                            x:BASE_TARGET_SIZE * SCREEN_RATIO,
                            y:BASE_TARGET_SIZE * SCREEN_RATIO,
                            duration: this._indexTargetBeat/4,
                            ease: "power2.out",
                        })
                    }
                }
                if(this._iBeat > this._indexTargetBeat-1){
                    this.remove()
                }
            }
            this._timeSinceLastBeat = this._currentTime - this._lastBeatTime

            if(this._iBeat === this._indexTargetBeat-1 && this._objectBeat[this._iBeat] && this._objectBeat[this._iBeat].length > 0){
                this.background.visible = true
                this._moveSpeed = Math.min(.25, this._timeSinceLastBeat / this._intervalBetweenBeats)
                this.circlePos = this._lerp(this.circlePos, targetPos, this._moveSpeed )
                this.draw();
            }
        }
    }
}

