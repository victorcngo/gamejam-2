import { setUpButtons } from './InputManager'
import Game from './objects/Game.js'
import * as PIXI from 'pixi.js'
import { debounce } from './utils/async/debounce'
import Splashscreen from './ui/Splashscreen.js'

const $$video = document.querySelector('.background video')

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

    const splashscreen = new Splashscreen({ element: document.querySelector('.js-splashscreen')})
    splashscreen.init()

    const handleButtonADown = (playerID) => {
        if(!game.targets[playerID]) return

        let target = game.targets[playerID][0];
        if (!target) return
        target.showFeedback(playerID)
    }

    // TODO!! - Move this code when players are farting simultaneously
    // const $$overlay = document.querySelector('.overlay')
    // $$overlay.classList.add('is-active')
    // setTimeout(() => {
    //     $$overlay.classList.remove('is-active')
    // }, 2000)

    game.player1.instance.buttons[0].addEventListener('keydown', () => handleButtonADown(1))
    game.player2.instance.buttons[0].addEventListener('keydown', () => handleButtonADown(2))

    const update = () => {
        // TODO - This will be removed later
        game.updateAll()
    }

    app.ticker.maxFPS = 60
    app.ticker.add(update);

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });
}
createApp()
