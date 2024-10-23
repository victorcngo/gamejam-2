import * as PIXI from 'pixi.js'
import {
    RADIUS,
    HIT_ZONE_POSITION,
    numOfTargets,
    HIT_RANGE,
    START_SPEED,
    SCREEN_RATIO,
    TIMELINE_Y
} from '../settings.js'
import Target from './Target.js'
import MelodyPlayer from './MelodyPlayer.js';
import Player from './Player.js'
import { AudioManager } from '../AudioManager.js'
import gsap from 'gsap'

const BASE_TIMELINE_SIZE = 2
const BASE_HIT_ZONE_SIZE = 3.5

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

        this.targets = {1:[],2:[]}
        this.app = app
        this.speed = START_SPEED;
        this.audioManager = new AudioManager()
        this.setMelodyPlayer = this.setMelodyPlayer.bind(this);
        this.melodyPlayer = null

        const distToTraverse = window.innerWidth*.5
        const offset = window.innerWidth * .5
        this.distP1 = offset - distToTraverse
        this.distP2 = offset + distToTraverse
    }

    init() {
        // Create the players
        this.player1 = new Player(1)
        this.player2 = new Player(2)

        this.setStaticObjects()

        // TODO - set the melody player on the splash screen

        // HACK - Need click to allow audioContext, remove when starting page completed
        this.player1.instance.buttons[0].addEventListener('keydown', this.setMelodyPlayer)
    }

    showCountdown() {
        const countdown = document.querySelector('.js-countdown');
        const images = countdown.querySelectorAll('img');

        const tl = gsap.timeline({
            delay: 2,
            onStart: () => {
                countdown.setAttribute('data-state', 'visible');
            },
            onComplete: () => {
                countdown.setAttribute('data-state', 'hidden');
                this.hasStarted = true;
                this.melodyPlayer.start();
                tl.kill();
            }
        });

        for (let i = 0; i < images.length; i++) {
            tl.to(images[i], {
                duration: 0.5,
                opacity: 1,
                scale: 1.2
            });
            tl.to(images[i], {
                duration: 0.5,
                opacity: 0,
                scale: 1
            });
        }
    }

    setMelodyPlayer() {
        if (!this.melodyPlayer) {
            this.melodyPlayer = new MelodyPlayer(120)
            this.player1.instance.buttons[0].removeEventListener('keydown', this.setMelodyPlayer)
            this.showCountdown()
        }
    }

    setStaticObjects() {
        // Hit zone
        const hitZoneTexture = PIXI.Texture.from('./assets/hit-zone.svg');
        const hitZone = new PIXI.Sprite(hitZoneTexture);
        hitZone.anchor.set(0.5, 0.5);
        hitZone.x = HIT_ZONE_POSITION;
        hitZone.y = TIMELINE_Y;
        hitZone.scale.set(BASE_HIT_ZONE_SIZE * SCREEN_RATIO);
        this.app.stage.addChild(hitZone);

        // Timeline
        const timelineTexture = PIXI.Texture.from('./assets/timeline-background.svg');
        const timeline = new PIXI.Sprite(timelineTexture);
        timeline.anchor.set(0.5, 0.5);
        timeline.x = HIT_ZONE_POSITION;
        timeline.y = TIMELINE_Y;
        timeline.scale.set(BASE_TIMELINE_SIZE * SCREEN_RATIO);
        this.app.stage.addChild(timeline);
    }

    // TODO! - Do this inside the player class
    update(playerID) {
        if(this.targets.length >= 0) return
        if (!this.targets[playerID]) return
        if (this.targets[playerID].length === 0) return

        for (let i = 0; i < this.targets[playerID].length; i++) {
            const target = this.targets[playerID][i]
            if (!target) return;
            target.move()
        }

        const currTarget = this.targets[playerID][0]

        // if (currTarget.hasExpired()) {
        //     currTarget.remove();
        //     this.targets[playerID].splice(0, 1);
        // }
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
