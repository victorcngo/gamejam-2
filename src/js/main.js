import * as PIXI from 'pixi.js'
import Hit from './Objects/Hit.js'
import Hold from './Objects/Hold.js'
import { radius, precision, hitZone, joystickDirections, timelineY } from './settings.js'
import { setUpButtons, player1 } from './BorneManager/borneManager.js'

export function showProut(container) {
    const texture = PIXI.Texture.from('./assets/icons/prout.svg');
    const prout = new PIXI.Sprite(texture);

    prout.anchor.set(0.5);

    prout.x = window.innerWidth / 2;
    prout.y = timelineY;

    container.addChild(prout);

    setTimeout(() => {
        container.removeChild(prout);
    }, 500);
}

const createApp = async () => {
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


    // Variables
    let choux = [];
    let userIsHolding = false;

    // Static line
    const timelineTexture = PIXI.Texture.from('./assets/icons/timeline.svg');
    const timeline = new PIXI.Sprite(timelineTexture);
    timeline.anchor.set(0.5, 0.5);

    timeline.x = window.innerWidth / 2;
    timeline.y = timelineY;

    app.stage.addChild(timeline);

    // Static ellipse at the hit zone
    const hitZoneCircle = new PIXI.Graphics();
    hitZoneCircle.lineStyle(2, 0x000000)   // Outline color (black)
        .beginFill(0xffffff)               // Fill color (white)
        .drawCircle(hitZone, timelineY, radius / 2) // Circle at (375, timelineY) with half-radius
        .endFill();
    app.stage.addChild(hitZoneCircle);


    // Create a container for all choux objects
    const chouxContainer = new PIXI.Container();
    app.stage.addChild(chouxContainer);

    // Create choux
    function createChoux() {
        let prevX = radius;
        let type;
        for (let i = 0; i < 5; i++) {
            type = Math.random() < 0.5 ? 1 : 0;
            const length = Math.random() * (100) + 100;
            const initXPos = Math.random() * (prevX + 100) + prevX;
            if (type === 1) {
                choux[i] = new Hold(length, chouxContainer, joystickDirections[Math.floor(Math.random() * 4)], i, initXPos);
                prevX = -(radius + choux[i].rectLength - prevX);
            } else {
                choux[i] = new Hit(chouxContainer, joystickDirections[Math.floor(Math.random() * 4)], i, initXPos);
                prevX = -(radius - prevX);

            }

        }
    }

    const handleButtonADown = () => {
        let target = choux[0];
        target.showFeedback(app.stage)

        if (target.isHitCorrect() && target.type === 'hold') {
            userIsHolding = true;
        }
    }

    const handleButtonAUp = () => {
        userIsHolding = false;
        choux[0].showFeedback(app.stage)
        const success = choux[0].timer < precision && choux[0].timer > - precision
        console.log("success", success, choux[0].timer)
    }


    player1.buttons[0].addEventListener('keydown', handleButtonADown)
    player1.buttons[0].addEventListener('keyup', handleButtonAUp)



    // Main update loop -> equivalzent of draw
    function update() {
        for (let i = 0; i < choux.length; i++) {
            if (choux[i].circlePos > hitZone + 5) {
                choux[i].remove(); // Remove the choux from the rendering
                choux.splice(i, 1);  // Remove choux that passed hitZone
            }

            if (!choux[i]) return;

            if (choux[i].type === 'hold') {
                choux[i].moveBar()
                if (!userIsHolding || i !== 0) {
                    choux[i].move();
                }
            } else if (choux[i].type === 'hit') {
                choux[i].move()
            }

            // Move only if not holding or not the first Chou

        }
        if (userIsHolding && choux[0].type === 'hold') {
            choux[0].updateTimer();
            if (choux[0].timeIsUp()) {
                choux[0].remove()
                choux.splice(0, 1)
                userIsHolding = false
            }
        }
    }

    // equivalent of setup
    createChoux();
    app.ticker.maxFPS = 60
    app.ticker.add(update);

    // Resize handler for window resize
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });

}

createApp()


