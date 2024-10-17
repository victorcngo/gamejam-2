import * as PIXI from 'pixi.js'
import {radius,  hitZone,numOfTargets, hitRange, timelineY} from '../settings.js'
import Hit from './Hit.js'
import Hold from './Hold.js'

export default class Game {
    constructor (app){ 
        this.hasStarted = false;
        this.isDone = false;
        this.playersHaveLost = false; 
        this.targetsContainer = new PIXI.Container();
        this.targets = {}
        this.app = app
        this.userIsHolding = false;
        this.bgLine = new PIXI.Graphics();
        this.speed = 1;
    }

    init() {
        this.setStaticObjects()
        this.createTargets()
        this.app.stage.addChild(this.targetsContainer);
    }

    setStaticObjects() {
        // Static line
        this.bgLine.lineStyle(2, 0x000000)  // Line style (black)
            .moveTo(0, 200)          // Start point
            .lineTo(this.app.screen.width, 200); // End point (full screen width)
        this.app.stage.addChild(this.bgLine);
        // Static ellipse at the hit zone
        const hitZoneCircle = new PIXI.Graphics();
        hitZoneCircle.lineStyle(2, 0x000000)   // Outline color (black)
            .beginFill(0xffffff)               // Fill color (white)
            .drawCircle(hitZone, 200, radius / 2) // Circle at (375, 200) with half-radius
            .endFill();
        this.app.stage.addChild(hitZoneCircle);
    }

    createTargets () {
        let length = 0
        let type = 1
        let targetsPlayer1 = []
        let targetsPlayer2 = []
        let xPos1 = 0
        let xPos2 =  window.innerWidth

        // player one
        for (let i = 0; i < numOfTargets; i++) {
            //type = Math.random() < 0.5 ? 1 : 0;
            length = Math.random() * (100) + 100;
           
            if(type === 0) {
                // for hit target
                xPos1 -= radius*2
                xPos2 += radius*2
                targetsPlayer1[i] = new Hit(this.targetsContainer, 'left', i, xPos1, 1);
                targetsPlayer2[i] = new Hit(this.targetsContainer, 'left', i, xPos2, 2);
            } else if(type === 1) {
                // for hold target
                xPos1 -= radius*2 + length
                xPos2 += radius*2 + length
                targetsPlayer1[i] = new Hold(100, this.targetsContainer, 'left', i, xPos1, 1);
                targetsPlayer2[i] = new Hold(100, this.targetsContainer, 'left', i, xPos2, 2);
            }
        }
        this.targets[1] = targetsPlayer1
        this.targets[2] = targetsPlayer2

    }

    update(playerID) {
        if(this.targets[playerID].length === 0) return
        if( !this.targets[playerID]) return
        for (let i = 0; i < this.targets[playerID].length; i++) {
            const target = this.targets[playerID][i]
            if (! target) return;
            if( target.type === 'hold') {
                target.moveBar()
                if (!this.userIsHolding || i !== 0) {
                    target.move();
                }
            } else if(  target.type === 'hit') {
                target.move()
            }
        }
        const currTarget =this.targets[playerID][0]
        if(currTarget.isMissed()) {
            currTarget.remove();
            this.targets[playerID].splice(0, 1);
        }
      
        
        if (this.userIsHolding && currTarget.type === 'hold') {
            currTarget.updateTimer()
            currTarget.updateBar()
            // reduce bar width
            currTarget.bar
            if(currTarget.timeIsUp()) {
                currTarget.remove() 
                this.targets[playerID].splice(0, 1)
                this.userIsHolding = false
            }
        }
    }

    updateAll() {
       this.update(1)
       this.update(2)
    }

    checkResults () {

    }

    end() {
        
    }
}