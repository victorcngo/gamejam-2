import * as PIXI from 'pixi.js'


// Create a new PixiJS application
const app = new PIXI.Application({
  width: window.innerWidth,   // Set canvas width
  height: window.innerHeight,  // Set canvas height
  backgroundColor: 0xffffff, // Background color (white)
});
document.body.appendChild(app.view); // Append canvas to the document

// Variables
let choux = [];
let directions = ["left", "right", "up", "down"];
let precision = 15;
let hitZone = 375;
let userIsHolding = false;
const holdBarHeight = 10;
const radius = 50;
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
        choux[i] = new Chou('left', length, i, 'hold', initXPos);
        prevX = -(radius + choux[i].rectLength - prevX);
    }
}

// Chou class definition
class Chou {
    constructor(direction, length, index, type, initXPos) {
        this.direction = direction;
        this.length = length;
        this.speed = 1;
        this.type = type;
        this.index = index;
        this.radius = radius;
        this.timer = length;
        this.rectLength = length;
        this.circlePos = initXPos;
        this.barPos = initXPos;
        this.color = this.getRandomColor();

        // Create the circle and bar graphics
        this.circleGraphics = new PIXI.Graphics();
        this.barGraphics = new PIXI.Graphics();

        this.drawChou();
        chouxContainer.addChild(this.circleGraphics);
        chouxContainer.addChild(this.barGraphics);
    }

    // Get random color
    getRandomColor() {
        return Math.random() * 0xFFFFFF;
    }

    // Draw the Chou (circle and bar)
    drawChou() {
        this.circleGraphics.clear();
        this.circleGraphics.beginFill(this.color);
        this.circleGraphics.drawCircle(this.circlePos, 200, this.radius / 2);
        this.circleGraphics.endFill();

        // Draw the bar
        this.barGraphics.clear();
        this.barGraphics.beginFill(this.color);  // Black color for bar
        this.barGraphics.drawRect(this.barPos - this.rectLength, 200 - holdBarHeight / 2, this.rectLength, holdBarHeight);
        this.barGraphics.endFill();
    }

    // Move the circle (for animation)
    move() {
        this.circlePos += this.speed;
        this.drawChou();
    }

    // Move the bar
    moveBar() {
        this.barPos += this.speed;
        this.drawChou();
    }

    // Update the timer (for holding action)
    updateTimer() {
        this.timer--;
    }

    remove() {
        chouxContainer.removeChild(this.circleGraphics);
        chouxContainer.removeChild(this.barGraphics);
    }
}

// Check if the hit is correct
function isHitCorrect(target) {
    return target.circlePos > hitZone - precision && target.circlePos < hitZone + precision;
}

// Show feedback by changing color on hit
function showFeedback(target) {
    target.color = isHitCorrect(target) ? 0x00FF00 : 0xFF0000;  // Green for correct hit, Red for incorrect
    target.drawChou();
}

// Mouse press event listener (equivalent to mousePressed)
app.view.addEventListener('mousedown', () => {
    let target = choux[0];
    showFeedback(target);

    if (isHitCorrect(target) && target.type === 'hold') {
        userIsHolding = true;
    }
});

// Mouse release event listener (equivalent to mouseReleased)
app.view.addEventListener('mouseup', () => {
    userIsHolding = false;
});

// Main update loop
function update() {
    for (let i = 0; i < choux.length; i++) {
        if (choux[i].circlePos > hitZone + 5) {
            // Remove the choux from the rendering
            choux[i].remove();
            choux.splice(i, 1);  // Remove choux that passed hitZone
        }

        if (!choux[i]) return;

        // Move only if not holding or not the first Chou
        if (!userIsHolding || i !== 0) {
            choux[i].move();
        }
        choux[i].moveBar();

        if (userIsHolding) {
            choux[0].updateTimer();
            console.log(choux[0].timer);
        }
    }
}

// Initialize setup and game loop
createChoux();
app.ticker.add(update);

// Resize handler for window resize
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    line.clear();
    line.lineStyle(2, 0x000000).moveTo(0, 200).lineTo(window.innerWidth, 200); // Redraw line
});