import {setUpButtons, player1, player2} from './BorneManager/borneManager.js'
import Game from './Objects/Game.js'
import * as PIXI from 'pixi.js'
import { arrowTypes, timelineY } from './settings.js'

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
    const game = new Game(app, )
    game.init()

    const handleButtonADown = (playerID) => {
        let target = game.targets[playerID][0];
        if(!target) return
        target.showFeedback()
        if(target.isHitCorrect() && target.type === 'hit')  showProut()
        if (target.isHitCorrect() && target.type === 'hold') {
            game.userIsHolding = true;
        }
    }

    // Static line
    const timelineTexture = PIXI.Texture.from('./assets/icons/timeline.svg');
    const timeline = new PIXI.Sprite(timelineTexture);
    timeline.anchor.set(0.5, 0.5);
    
    timeline.x = window.innerWidth / 2;
    timeline.y = timelineY;
    
    app.stage.addChild(timeline);
    


    const handleButtonAUp = (playerID) => {
        const target = game.targets[playerID][0]
        game.userIsHolding = false;
        target.showFeedback()
        if(target.isHoldCorrect()) showProut()
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
