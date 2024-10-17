import * as PIXI from 'pixi.js'
import {radius,  hitZone,numOfTargets, hitRange} from '../settings.js'
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
    }

    init() {
        this.setStaticObjects()
        this.createTargets(1)
        this.createTargets(2)
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

    createTargets (playerID) {
        let targets = []
        let prevX = 0
        let direction = playerID === 1 ? -1 : 1
        let type = 0

        for (let i = 0; i < numOfTargets; i++) {
            type = Math.random() < 0.5 ? 1 : 0;
            let initXPos = i*radius*2 * direction;
     
            if(playerID === 2) {
                initXPos +=  window.innerWidth;
            }
            
            // for hit target only

            targets[i] = new Hit(this.targetsContainer, 'left', i, initXPos, playerID);
            prevX += initXPos 
        }
        this.targets[playerID] = targets

        // let prevX = playerID === 1 ? radius : radius + window.innerWidth;
        // let type = 0
        // for (let i = 0; i < numOfTargets; i++) {
        //     //type = Math.random() < 0.5 ? 1 : 0;
        //     const length = Math.random() * (100) + 100;
        //     const initXPos = Math.random() * (prevX + 100 ) + prevX;
        //     if(type === 1) {
        //         // create Targets playerID
        //         targets[i] = new Hold(length,this.targetsContainer, 'left', i, initXPos, playerID);
        //         prevX = (radius + this.targets[i].rectLength - prevX)
        //         // create Targets for player 2
        //     } else {
        //         targets[i] = new Hit(this.targetsContainer, 'left', i, initXPos, playerID);
        //         //prevX = (radius - prevX) * this.direction
        //     }
        // }

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
      
        // if (currTarget.isInHitRange()) {
        // this works
        //     currTarget.color = 0x0000FF
        // }
        if (this.userIsHolding && currTarget.type === 'hold') {
            currTarget.updateTimer()
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