import { player1 } from '../BorneManager/borneManager.js';
import { radius, hitRange, timelineY, startSpeed } from '../settings.js'
import Game from './Game.js'

import * as PIXI from 'pixi.js'


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

        //init joystick 
        this.joystickPosition = {
            x: 0,
            y: 0
        }
        this.joystickOrientation = 'center'
        this.initJoystick()

        this.loadBackground(`/assets/icons/chou-${this.playerID}.svg`);
    }
  
// TODO : move it outside and run it one time per player. Make values of controller accessible in each target
    initJoystick() {
        player1.joysticks[0].addEventListener('joystick:move', (e) => {
            this.joystickPosition = e.position
            if (Math.abs(e.position.x) > Math.abs(e.position.y)) {
                if (Math.abs(e.position.x) < 0.6) {
                    this.joystickOrientation = 'center'
                } else {
                    this.joystickOrientation = e.position.x < 0 ? 'left' : 'right'
                }
            } else {
                if (Math.abs(e.position.y) < 0.6) {
                    this.joystickOrientation = 'center'
                } else {
                    this.joystickOrientation = e.position.y < 0 ? 'bottom' : 'top'
                }
            }
        })
    }

    loadBackground() {
        this.background = new PIXI.Sprite(this.playerID === 1 ? this.game.bgTextureP1 : this.game.bgTextureP2);
        this.background.anchor.set(0.5, 0.5);
        this.background.scale.set(2, 2)
        this.background.x = this.circlePos;
        this.background.y = timelineY;
        this.container.addChild(this.background);
    }

    // Get random color
    getColor() {
        return this.playerID === 1 ? 0x0000FF : 0x00FFFF;
    }


    remove() {
        this.container.removeChild(this.background);
    }

  
  
    isHitCorrect() {
        return this.isInHitRange()
    }

    isInHitRange() {
        return this.circlePos > hitRange[0] && this.circlePos < hitRange[1] ? true : false
    }

    isMissed() {
        if (this.playerID === 1) return this.circlePos > hitRange[1]
        if (this.playerID === 2) return this.circlePos < hitRange[0]
        // if direction 
    }
}