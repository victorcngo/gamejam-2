import * as PIXI from 'pixi.js'
import { radius, hitZonePosition, numOfTargets, hitRange, timelineY, arrowTypes, startSpeed } from '../settings.js'
import Hit from './Hit.js'
import Hold from './Hold.js'
import MelodyPlayer from './MelodyPlayer.js';
import Player from './Player.js'
import { AudioManager } from '../AudioManager.js'

export default class Game {
    static instance
    constructor(app) {
        if (Game.instance) {
            return Game.instance; // Return existing instance if already created
        }
        this.hasStarted = false;
        this.isDone = false;
        this.playersHaveLost = false;
        this.targetsContainer = new PIXI.Container();
        this.targets = {}
        //TODO: keep two arrays, one per player and keep track for each target of success.
        // Example : if player1 has hit the two first targets correctly and misses the third score should be score {1: [1, 1, 0] }
        // At the end of a sequence compute points by looping through both arrays and check both player have a score of 1 at index i to grant a point.
        // defeat condition should be if 90% of targets have been hit correctly by both players
        this.score = {}
        this.app = app
        this.userIsHolding = false;
        this.speed = startSpeed;
        this.audioManager = new AudioManager()
        this.setMelodyPlayer = this.setMelodyPlayer.bind(this);
        this.melodyPlayer = null
        Game.instance = this;
    }

    init() {
        // Create the players
        this.player1 = new Player(1)
        this.player2 = new Player(2)

        this.setStaticObjects()
        this.createTargets()
        this.app.stage.addChild(this.targetsContainer);

        // TODO - set the melody player on the splash screen

        // HACK - Need click to allow audioContext, remove when startingpage completed
        this.player1.instance.buttons[0].addEventListener('keydown', this.setMelodyPlayer)
    }

    setMelodyPlayer() {
        if (!this.melodyPlayer) {
            this.melodyPlayer = new MelodyPlayer(90)
            document.querySelector('.start').style.display = "none";
            this.player1.instance.buttons[0].removeEventListener('keydown', this.setMelodyPlayer)
        }
        this.hasStarted = true
    }

    setStaticObjects() {
        // Hit zone
        const hitZoneTexture = PIXI.Texture.from('./assets/hit-zone.svg');
        const hitZone = new PIXI.Sprite(hitZoneTexture);
        hitZone.anchor.set(0.5, 0.5);
        hitZone.x = hitZonePosition;
        hitZone.y = timelineY;
        this.app.stage.addChild(hitZone);

        // Timeline
        const timelineTexture = PIXI.Texture.from('./assets/timeline-background.svg');
        const timeline = new PIXI.Sprite(timelineTexture);
        timeline.anchor.set(0.5, 0.5);
        timeline.x = hitZonePosition;
        timeline.y = timelineY;
        this.app.stage.addChild(timeline);
    }

    createTargets() {
        let length = 0
        let type = 1
        let targetsPlayer1 = []
        let targetsPlayer2 = []
        let xPos1 = 0
        let xPos2 = window.innerWidth

        // player one
        for (let i = 0; i < numOfTargets; i++) {
            type = Math.random() < 0.5 ? 1 : 0;
            length = Math.random() * (100) + 100;

            if (type === 0) {
                // for hit target
                xPos1 -= radius * 2
                xPos2 += radius * 2
                targetsPlayer1[i] = new Hit(this.targetsContainer, 'left', i, xPos1, 1, arrowTypes[Math.floor(Math.random() * 4)]);
                targetsPlayer2[i] = new Hit(this.targetsContainer, 'left', i, xPos2, 2, arrowTypes[Math.floor(Math.random() * 4)]);
            } else if (type === 1) {
                // for hold target
                xPos1 -= radius * 2 + length
                xPos2 += radius * 2 + length
                targetsPlayer1[i] = new Hold(100, this.targetsContainer, 'left', i, xPos1, 1, arrowTypes[Math.floor(Math.random() * 4)]);
                targetsPlayer2[i] = new Hold(100, this.targetsContainer, 'left', i, xPos2, 2, arrowTypes[Math.floor(Math.random() * 4)]);
            }
        }
        this.targets[1] = targetsPlayer1
        this.targets[2] = targetsPlayer2

    }

    update(playerID) {
        if (this.targets[playerID].length === 0) return
        if (!this.targets[playerID]) return
        for (let i = 0; i < this.targets[playerID].length; i++) {
            const target = this.targets[playerID][i]
            if (!target) return;
            if (target.type === 'hold') {
                target.moveBar()
                if (!this.userIsHolding || i !== 0) {
                    target.move();
                }
            } else if (target.type === 'hit') {
                target.move()
            }
        }
        const currTarget = this.targets[playerID][0]
        if (currTarget.isMissed()) {
            currTarget.remove();
            this.targets[playerID].splice(0, 1);
        }


        if (this.userIsHolding && currTarget.type === 'hold') {
            currTarget.updateTimer()
            currTarget.updateBar()
            // reduce bar width
            currTarget.bar
            if (currTarget.timeIsUp()) {
                currTarget.remove()
                this.targets[playerID].splice(0, 1)
                this.userIsHolding = false
            }
        }
    }

    updateAll() {
        if (!this.hasStarted) return
        this.update(1)
        this.update(2)
    }

    // TODO: logic for checkResults & end condition
    checkResults() {

    }

    end() {

    }

    increaseSpeed(num) {
        this.speed += num
    }
}
