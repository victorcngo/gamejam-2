import * as PIXI from 'pixi.js'

import HoldChou from './Objects/HoldChou.js'
import {radius, precision, hitZone} from './settings.js'


// Create a new PixiJS application
const app = new PIXI.Application({
  width: window.innerWidth,   // Set canvas width
  height: window.innerHeight,  // Set canvas height
  resolution: window.devicePixelRatio || 1, // Set resolution to match device pixel ratio
  antialias: true, // Enable antialiasing for smoother graphics
  transparent: true
});
document.body.appendChild(app.view); // Append canvas to the document

// Variables
let choux = [];
let directions = ["left", "right", "up", "down"];
// let precision = 15;
// let hitZone = 375;
let userIsHolding = false;


// Static line
const line = new PIXI.Graphics();
line.lineStyle(2, 0x000000)  // Line style (black)
    .moveTo(0, 200)          // Start point
    .lineTo(app.screen.width, 200); // End point (full screen width)
app.stage.addChild(line);
// Static ellipse at the hit zone
const hitZoneCircle = new PIXI.Graphics();
hitZoneCircle.lineStyle(2, 0x000000)   // Outline color (black)
    .beginFill(0xffffff)               // Fill color (white)
    .drawCircle(hitZone, 200, radius / 2) // Circle at (375, 200) with half-radius
    .endFill();
app.stage.addChild(hitZoneCircle);

// Create a container for all choux objects
const chouxContainer = new PIXI.Container();
app.stage.addChild(chouxContainer);

// Create choux
function createChoux() {
    let prevX = radius;
    for (let i = 0; i < 5; i++) {
        const length = Math.random() * (200 - 100) + 100;
        const initXPos = Math.random() * (prevX + 100 - prevX) + prevX;
        choux[i] = new HoldChou(length,chouxContainer, 'left', i, 'hold', initXPos);
        prevX = -(radius + choux[i].rectLength - prevX);
    }
}


// Mouse press event listener (equivalent to mousePressed)
app.view.addEventListener('mousedown', () => {
    let target = choux[0];
    target.showFeedback()

    if (target.isHitCorrect() && target.type === 'hold') {
        userIsHolding = true;
    }
});

// Mouse release event listener (equivalent to mouseReleased)
app.view.addEventListener('mouseup', () => {
    userIsHolding = false;
});

// Main update loop -> equivalzent of draw
function update() {
    for (let i = 0; i < choux.length; i++) {
        if (choux[i].circlePos > hitZone + 5) {
            choux[i].remove(); // Remove the choux from the rendering
            choux.splice(i, 1);  // Remove choux that passed hitZone
        }

        if (!choux[i]) return;

        // Move only if not holding or not the first Chou
        if (!userIsHolding || i !== 0) {
            choux[i].move();
        }
        

        if (userIsHolding) {
            choux[0].updateTimer();
            console.log(choux[0].timer);
        }
    }
}

// equivalent of setup
createChoux();
app.ticker.add(update);

// Resize handler for window resize
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    line.clear();
    line.lineStyle(2, 0x000000).moveTo(0, 200).lineTo(window.innerWidth, 200); // Redraw line
});