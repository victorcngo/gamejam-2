import { player1 } from '../BorneManager/borneManager.js';
import {radius, holdBarHeight, hitZone, precision} from '../settings.js'
import * as PIXI from 'pixi.js'

export default class Chou {
    constructor(container, direction, index,initXPos) {
        this.direction = direction;
        this.speed = 1;
        this.index = index;
        this.radius = radius;
        this.circlePos = initXPos;
        this.barPos = initXPos;
        this.color = this.getRandomColor();
        this.container = container;

        //init joystick
        this.joystickPosition = {
            x:0,
            y:0
        }
        this.joystickOrientation = 'center'
        this.initJoystick()
        

        // Create the circle and bar graphics
        this.circleGraphics = new PIXI.Graphics();
        this.container.addChild(this.circleGraphics);

    }

    initJoystick(){
        player1.joysticks[0].addEventListener('joystick:move',(e)=>{
            this.joystickPosition = e.position
            if(Math.abs(e.position.x)>Math.abs(e.position.y)){
                if(Math.abs(e.position.x) < 0.6){
                    this.joystickOrientation = 'center'
                }else{
                    this.joystickOrientation = e.position.x < 0 ? 'left' : 'right'
                }
            }else{
                if(Math.abs(e.position.y) < 0.6){
                    this.joystickOrientation = 'center'
                }else{
                    this.joystickOrientation = e.position.y < 0 ? 'bottom' : 'top'
                }
            }
        })
    }

    // Get random color
    getRandomColor() {
        return Math.random() * 0xFFFFFF;
    }


    remove() {
        this.container.removeChild(this.circleGraphics);
    }

    isHitCorrect() {
        return this.circlePos > hitZone - precision && this.circlePos < hitZone + precision;

    }

}