import * as PIXI from 'pixi.js';
import Game from './Game';

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
    }

    draw() {

    }

    remove() {
        console.log("remove the feedback!");
    }
}
