import { setUpButtons } from './InputManager'
import Game from './objects/Game1.js'
import * as PIXI from 'pixi.js'
import { debounce } from './utils/async/debounce'
import Splashscreen from './ui/Splashscreen.js'
import { wait } from './utils/async/wait.js'
import Signal from './utils/signal'

const $$video = document.querySelector('.page-background video')

const createApp = async () => {
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: 1,
        antialias: true,
        transparent: true
    });

    $$video.play()

    document.body.appendChild(app.view)
    await setUpButtons()
    const game = new Game(app)
    game.init()

    const $$overlay = document.querySelector('.overlay')

    Signal.on(":showOverlay", () => {
        $$overlay.classList.add('is-active')
    })

    Signal.on(":hideOverlay", () => {
        $$overlay.classList.remove('is-active')
    })

    const splashscreen = new Splashscreen({ element: document.querySelector('.js-splashscreen')})
    splashscreen.init()

    const handleButtonADown = (playerID) => {
        if(!game.targets[playerID]) return
        let target = game.targets[playerID][game.idxTarget[playerID]-1];
        if (!target) return
        target.showFeedback(playerID)
    }

    const handleBigButtonDown = (playerID) =>
    {
        if(!game.fartTarget[playerID]) return
        if(!game.hasStarted) return

        let target = game.fartTarget[playerID][0];

        if (!target) return
        target.showFeedback(playerID)

        wait(100)
        target.game.checkFartSuccess()
    }

    game.player1.instance.buttons[0].addEventListener('keydown', () => handleButtonADown(1))
    game.player2.instance.buttons[0].addEventListener('keydown', () => handleButtonADown(2))

    game.player1.instance.buttons[4].addEventListener('keydown', () => handleBigButtonDown(1))
    game.player2.instance.buttons[4].addEventListener('keydown', () => handleBigButtonDown(2))

    const update = (delta) => {
        game.updateAll(delta)
    }

    app.ticker.maxFPS = 60
    app.ticker.add(update);

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });
}
createApp()
