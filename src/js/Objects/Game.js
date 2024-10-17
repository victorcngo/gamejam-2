import * as PIXI from 'pixi.js'
import {radius,  hitZone} from '../settings.js'
import Hit from './Hit.js'
import Hold from './Hold.js'

export default class Game {
    constructor (app){ 
        this.hasStarted = false;
        this.isDone = false;
        this.playersHaveLost = false; 
        this.targetsContainer = new PIXI.Container();
        this.targets = []
        this.app = app
        this.userIsHolding = false;
    }

    init() {
        this.setStaticObjects()
        this.createTargets()
        this.app.stage.addChild(this.targetsContainer);
    }

    setStaticObjects() {
        // Static line
        const line = new PIXI.Graphics();
        line.lineStyle(2, 0x000000)  // Line style (black)
            .moveTo(0, 200)          // Start point
            .lineTo(this.app.screen.width, 200); // End point (full screen width)
        this.app.stage.addChild(line);
        // Static ellipse at the hit zone
        const hitZoneCircle = new PIXI.Graphics();
        hitZoneCircle.lineStyle(2, 0x000000)   // Outline color (black)
            .beginFill(0xffffff)               // Fill color (white)
            .drawCircle(hitZone, 200, radius / 2) // Circle at (375, 200) with half-radius
            .endFill();
        this.app.stage.addChild(hitZoneCircle);

    }

    createTargets () {
        let prevX = radius;
        let type;
        for (let i = 0; i < 5; i++) {
        type = Math.random() < 0.5 ? 1 : 0;
        const length = Math.random() * (100) + 100;
        const initXPos = Math.random() * (prevX + 100 ) + prevX;
        if(type === 1) {
                this.targets[i] = new Hold(length,this.targetsContainer, 'left', i, initXPos);
                prevX = -(radius + this.targets[i].rectLength - prevX);
            } else {
            this.targets[i] = new Hit(this.targetsContainer, 'left', i, initXPos);
            prevX = -(radius - prevX);

            }
        }
    }

    update() {
        for (let i = 0; i < this.targets.length; i++) {
            if (this.targets[i].circlePos > hitZone + 5) {
                this.targets[i].remove(); // Remove the this.targets from the rendering
                this.targets.splice(i, 1);  // Remove this.targets that passed hitZone
            }
    
            if (!this.targets[i]) return;
    
            if(this.targets[i].type === 'hold') {
                this.targets[i].moveBar()
                if (!this.userIsHolding || i !== 0) {
                    this.targets[i].move();
                }
            } else if( this.targets[i].type === 'hit') {
                this.targets[i].move()
            }
        }
        if (this.userIsHolding && this.targets[0].type === 'hold') {
            this.targets[0].updateTimer();
            if(this.targets[0].timeIsUp()) {
                this.targets[0].remove() 
                this.targets.splice(0, 1)
                this.userIsHolding = false
            }
        }

    }

    checkResults () {

    }
}