import * as PIXI from 'pixi.js';
import Game from './Game';
import { gsap } from 'gsap';
import { SCREEN_RATIO, TIMELINE_Y } from '../settings';

export default class Feedback {
    text = ""

    constructor(type, playerID) {
        this.game = new Game();
        this.app = this.game.app;
        this.type = type;
        this.playerID = playerID;
    }

    init() {
        console.log(`display ${this.type}`);

        this.text = new PIXI.Text(
            'x0',
            {
                fontFamily: 'Arial',
                fontSize: 32,
                fill: 0xffffff,
                align: 'center'
            }
        );

        this.text.anchor.set(0.5);
        this.text.x = window.innerWidth / 2;
        this.text.y = TIMELINE_Y;
        this.app.stage.addChild(this.text);

        gsap.to(this.text, {
            y: this.text.y - (SCREEN_RATIO * 100),
            alpha: 0,
            duration: 1,
            onComplete: () => {
                this.remove();
            }
        })
    }

    draw() {

    }

    remove() {
        console.log("remove the feedback!");
    }
}
