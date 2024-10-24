import { setUpButtons } from './InputManager'
import Game from './objects/Game.js'
import * as PIXI from 'pixi.js'
import { debounce } from './utils/async/debounce'
import { longFarts, smallFarts, timelineY } from './settings.js'

const createApp = async () => {
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: 1,
        antialias: true,
        transparent: true
    });

    document.body.appendChild(app.view)
    await setUpButtons()
    const game = new Game(app)
    game.init()

    const handleButtonADown = (playerID) => {
        let target = game.targets[playerID][0];
        if (!target) return
        target.showFeedback(playerID)
    }

    game.player1.instance.buttons[0].addEventListener('keydown', () => handleButtonADown(1))
    game.player2.instance.buttons[0].addEventListener('keydown', () => handleButtonADown(2))



    app.ticker.maxFPS = 60

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });
}
createApp()
