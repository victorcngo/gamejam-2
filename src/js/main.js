import * as PIXI from 'pixi.js'
import { precision} from './settings.js'
import {setUpButtons, player1, player2} from './BorneManager/borneManager.js'
import Game from './Objects/Game.js'

const createApp = async() => {
    // Create a new PixiJS application
    const app = new PIXI.Application({
        width: window.innerWidth,   
        height: window.innerHeight,
        resolution: window.devicePixelRatio || 1, // Set resolution to match device pixel ratio
        antialias: true, // Enable antialiasing for smoother graphics
        transparent: true
    });
    document.body.appendChild(app.view); // Append canvas to the document
    await setUpButtons()
    const game = new Game(app)
    game.init()

    // player 1 -> button A

    const handleButtonADown = (playerID) => {
        let target = game.targets[playerID][0];
        target.showFeedback()
        if (target.isHitCorrect() && target.type === 'hold') {
            game.userIsHolding = true;
        }
    }

    const handleButtonAUp = (playerID) => {
        const target = game.targets[playerID][0]
        game.userIsHolding = false;
        target.showFeedback()
        // let success = false;
        // const success = target.timer < precision && target.timer > - precision
        // console.log("success", success, target.timer)
    }

    player1.buttons[0].addEventListener('keydown',() => handleButtonADown(1))
    player1.buttons[0].addEventListener('keyup',() => handleButtonAUp(1))
    player2.buttons[0].addEventListener('keydown',() => handleButtonADown(2))
    player2.buttons[0].addEventListener('keyup', () => handleButtonAUp(2))

    const update = () => {
        game.updateAll()
    }
  
    app.ticker.maxFPS = 60
    app.ticker.add(update);

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        game.bgLine.clear();
        game.bgLine.lineStyle(2, 0x000000).moveTo(0, 200).lineTo(window.innerWidth, 200); // Redraw line
    });
}

createApp()


