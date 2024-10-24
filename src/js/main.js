import { setUpButtons, player1, player2 } from './BorneManager/borneManager.js'
import Game from './Objects/Game.js'
import * as PIXI from 'pixi.js'
import { debounce } from './utils/debounce.js'
import { longFarts, smallFarts, timelineY } from './settings.js'

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

    // each character is controlled by one player
    // this function make the background sprite change on user button press



    const update = () => {
        // update targets and score for both player
        game.updateAll()
    }

    app.ticker.maxFPS = 60
    app.ticker.add(update);

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });


    // green shape that appears on hit === success
    const showProut = () => {
        const texture = PIXI.Texture.from('./assets/icons/prout.svg');
        const prout = new PIXI.Sprite(texture);
        prout.anchor.set(0.5);
        prout.x = window.innerWidth / 2;
        prout.y = timelineY;
        app.stage.addChild(prout);

        setTimeout(() => {
            app.stage.removeChild(prout);
        }, 500);
    }
}
createApp()
