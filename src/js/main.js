import { setUpButtons } from './BorneManager/borneManager.js'
import Game from './Objects/Game.js'
import * as PIXI from 'pixi.js'
import { debounce } from './utils/async/debounce'
import { longFarts, smallFarts, timelineY } from './settings.js'
import Splashscreen from './ui/Splashscreen.js'

const createApp = async () => {
    // Create a new PixiJS application to handle canvas rendering
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio || 1, // Set resolution to match device pixel ratio
        antialias: true, // Enable antialiasing for smoother graphics
        transparent: true
    });
    document.body.appendChild(app.view); // Append canvas to the document
    await setUpButtons() // map game to arcade controls
    const game = new Game(app) // singleton that handles global logic
    game.init()

    //ui
    const splashscreen = new Splashscreen({ element: document.querySelector('.js-splashscreen')})
    splashscreen.init()

    // each character is controlled by one player
    // this function make the background sprite change on user button press
    const animateChar = (playerID) => {


        document.querySelector(`div.char${playerID}`).classList.toggle(('active'))
        document.querySelector(`div.char${playerID}Fart`).classList.toggle(('active'))
    }

    // debounce is used to prevent lagging when user spams the button
    const debouncedAnimateChar1 = debounce(() => animateChar(1), 500);
    const debouncedAnimateChar2 = debounce(() => animateChar(2), 500);

    const handleButtonADown = (playerID) => {
        let target = game.targets[playerID][0];
        if (!target) return

        target.showFeedback(playerID)

        if (playerID === 1) {
            debouncedAnimateChar1()
        }
        if (playerID === 2) {
            debouncedAnimateChar2()
        }
    }

    game.player1.instance.buttons[0].addEventListener('keydown', () => handleButtonADown(1))
    game.player2.instance.buttons[0].addEventListener('keydown', () => handleButtonADown(2))

    const update = () => {
        // update targets and score for both player
        game.updateAll()
    }

    app.ticker.maxFPS = 60
    app.ticker.add(update);

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });
}
createApp()
