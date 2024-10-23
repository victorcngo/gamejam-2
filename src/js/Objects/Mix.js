import Chou from './Chou.js'
import * as PIXI from 'pixi.js'
import {precision, holdBarHeight} from '../settings.js'

export default class Mix extends Chou {
    constructor(length, container, direction, index,initXPos) {
        super(container, direction, index, initXPos)
        this.length = length;
        this.timer = length;
        this.type = 'mix'
        this.rectLength = length;
        this.barGraphics = new PIXI.Graphics();
        this.container.addChild(this.barGraphics);
    }

    updateTimer() {
        this.timer -= this.game.speed;
    }

    isMixCorrect() {

    }

    remove() {
    }


}
