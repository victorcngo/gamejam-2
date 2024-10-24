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

        this.leaderboard = Axis.createLeaderboard({
            id: "la-soupe-aux-choux-24",
        });

        this.text = new PIXI.Text(
            'x0',
            {
                fontFamily: 'Arial',
                fontSize: 32,
                fill: 0xffffff,
                align: 'center'
            }
        );

        this.text.x = this.playerID === 1
            ? window.innerWidth * 0.5 - 100
            : window.innerWidth * 0.5 + 100
        this.app.stage.addChild(this.text)
    }

    increaseCombo(amount = 1) {
        this.combo += amount
        this.maxCombo = Math.max(this.maxCombo, this.combo)
        this.text.text = 'x' + this.combo
    }

    resetCombo() {
        this.combo = 0
        this.text.text = 'x' + this.combo
    }
}
