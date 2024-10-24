import * as PIXI from 'pixi.js'
import { radius, hitZonePosition, numOfTargets, hitRange, timelineY, arrowTypes, startSpeed } from '../settings.js'
import Target from './Target.js'
import MelodyPlayer from './MelodyPlayer.js';
import Player from './Player.js'
import { AudioManager } from '../AudioManager.js'

export default class Game {
    static instance

    score = 0
    userIsHolding = false
    hasStarted = false

    constructor(app) {
        if (Game.instance) {
            return Game.instance; // Return existing instance if already created
        }

        Game.instance = this;

        this.targetsContainer = new PIXI.Container();
        this.targets = {}
        this.app = app
        this.speed = startSpeed;
        this.audioManager = new AudioManager()
        this.setMelodyPlayer = this.setMelodyPlayer.bind(this);
        this.melodyPlayer = null
    }

    init() {
        // Create the players
        this.player1 = new Player(1)
        this.player2 = new Player(2)

        this.setStaticObjects()
        this.createTargets()
        this.app.stage.addChild(this.targetsContainer);

        // TODO - set the melody player on the splash screen

        // HACK - Need click to allow audioContext, remove when starting page completed
        this.player1.instance.buttons[0].addEventListener('keydown', this.setMelodyPlayer)
    }

    setMelodyPlayer() {
        if (!this.melodyPlayer) {
            this.melodyPlayer = new MelodyPlayer(90)
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
        let targetsPlayer1 = []
        let targetsPlayer2 = []
        let xPos1 = 0
        let xPos2 = window.innerWidth

        for (let i = 0; i < numOfTargets; i++) {
            xPos1 -= radius * 2
            xPos2 += radius * 2

            targetsPlayer1[i] = new Target(
                i,
                xPos1,
                1,
            );

            targetsPlayer2[i] = new Target(
                i,
                xPos2,
                2,
            );
        }

        this.targets[1] = targetsPlayer1
        this.targets[2] = targetsPlayer2
    }

    // TODO! - Do this inside the player class
    update(playerID) {
        if (this.targets[playerID].length === 0) return
        if (!this.targets[playerID]) return

        for (let i = 0; i < this.targets[playerID].length; i++) {
            const target = this.targets[playerID][i]
            if (!target) return;
            target.move()
        }

        const currTarget = this.targets[playerID][0]

        if (currTarget.hasExpired()) {
            currTarget.remove();
            this.targets[playerID].splice(0, 1);
        }
    }

    // TODO! - Remove this function
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
