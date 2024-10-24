import Chou from './Target.js'
import * as PIXI from 'pixi.js'
import { timelineY } from '../settings.js'

export default class Hit extends Chou {
    constructor(container, direction, index, initXPos, playerId,tempo,tick) {
        super(container, direction, index, initXPos, playerId)
        this.type = 'hit'
        this.direction = this.playerID === 1 ? -1 : 1
        this._lastBeatTime = Date.now()
        this._bpm = tempo;
        this._intervalBetweenBeats = (60 / this._bpm) * 1000;
        this._currentTime = Date.now()
        this._startTime = null
        this._timeSinceLastBeat = 0
        this._tick = tick
        this._isDestroy = false
        this._timeLaunch = this._tick - this._intervalBetweenBeats;


        this.drawChou()
    }

    showFeedback() {
        this.color = this.isHitCorrect() ? 0x00FF00 : 0xFF0000;
        this.drawChou()
        if (currTarget.isHitCorrect()) {
            this.showProut(this.targetsContainer)
        }
    }

    showFeedback() {
        console.log("success hit", this.isHitCorrect())
    }

    drawChou() {
        this.background.x = this.circlePos
    }

    remove() {
        this.container.removeChild(this.background);
        this.container.removeChild(this.fleche);
    }

    move(dt) {
        if(this.speed !== null){
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
                this.drawChou();
            }
        }
    }

    _lerp(start, end, t) {
        return start + (end - start) * t;
    }
}