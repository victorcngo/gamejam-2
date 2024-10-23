import Axis from 'axis-api'
import Game from './Game'
import * as PIXI from 'pixi.js'

export default class Player {
    constructor(playerID) {
        this.playerID = playerID
        this.combo = 0
        this.maxCombo = 0

        this.game = new Game()
        this.app = this.game.app

        this.init()
    }

    init() {
        this.instance = Axis.createPlayer({
            id: this.playerID,
            joysticks: Axis['joystick' + this.playerID],
            buttons: Axis.buttonManager.getButtonsById(this.playerID)
        })

        // Create PIXI.Text object for displaying combo
        this.text = new PIXI.Text(
            'x0',  // Initial combo text
            {
                fontFamily: 'Arial',
                fontSize: 32,
                fill: 0xff1010,  // Red color
                align: 'center'
            }
        );

        // Set the position of the text on the screen
        this.text.x = this.playerID === 1 ? window.innerWidth * 0.5 - 100 : window.innerWidth * 0.5 + 100
        this.app.stage.addChild(this.text);
    }

    // Function to increase combo and update the PIXI.Text
    increaseCombo() {
        // Increment combo
        this.combo++;

        // Check if the combo exceeds the max combo and update maxCombo
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }

        // Update the PIXI.Text with the new combo value
        this.text.text = 'x' + this.combo;
    }
}
