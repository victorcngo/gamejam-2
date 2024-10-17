import * as PIXI from 'pixi.js'

import { precision} from './settings.js'
import {setUpButtons, player1} from './BorneManager/borneManager.js'
import Game from './Objects/Game.js'

const createApp = async() => {
    // Create a new PixiJS application
    const app = new PIXI.Application({
        width: window.innerWidth,   // Set canvas width
        height: window.innerHeight,  // Set canvas height
        resolution: window.devicePixelRatio || 1, // Set resolution to match device pixel ratio
        antialias: true, // Enable antialiasing for smoother graphics
        transparent: true
    });
    document.body.appendChild(app.view); // Append canvas to the document

    await setUpButtons()
    const game = new Game(app)
    game.init()

  
  const handleButtonADown = () => {
    let target = game.targets[0];
      target.showFeedback()
  
      if (target.isHitCorrect() && target.type === 'hold') {
          game.userIsHolding = true;
      }
  }

  const handleButtonAUp = () => {
    game.userIsHolding = false;
    game.targets[0].showFeedback()
    const success = game.targets[0].timer < precision && game.targets[0].timer > - precision
    console.log("success", success, game.targets[0].timer)
  }

  
  player1.buttons[0].addEventListener('keydown',handleButtonADown)
  player1.buttons[0].addEventListener('keyup',handleButtonAUp)

    function update() {
        game.update()
    }
  
    app.ticker.maxFPS = 60
    app.ticker.add(update);

    // Resize handler for window resize
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        line.clear();
        line.lineStyle(2, 0x000000).moveTo(0, 200).lineTo(window.innerWidth, 200); // Redraw line
    });

}

createApp()


