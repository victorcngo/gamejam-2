import * as PIXI from 'pixi.js'
import Axis from 'axis-api'
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
import LeaderboardPopup from '../ui/LeaderboardPopup.js';
import FartTarget from './FartTarget.js';

const BASE_TIMELINE_SIZE = 0.5
const BASE_HIT_ZONE_SIZE = 4

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
        this.fartTargetTimes = [1000, 17000, 33000, 49000, 65000]
    
        this.fartTarget = {
            1: [],
            2: []
        }

        const distToTraverse = window.innerWidth*.5
        const offset = window.innerWidth * .5
        this.distP1 = offset - distToTraverse
        this.distP2 = offset + distToTraverse
        this.idxTarget = {
            1: 1,
            2: 1
        }
    }

    init() {
        // Create the players
        this.player1 = new Player(1)
        this.player2 = new Player(2)

        this.setStaticObjects()

        // HACK - Need click to allow audioContext, remove when starting page completed
        this.player1.instance.buttons[0].addEventListener('keydown', this.setMelodyPlayer)
    }

    scheduleFartTargets() {
        this.fartTargetTimes.forEach(time => {
            setTimeout(() => {
                this.createFartTarget();
            }, time);
        });
    }

    createFartTarget() {
        const xPos1 = 0;
        const xPos2 = window.innerWidth;

        const fartTarget1 = new FartTarget(this.targets[1].length, xPos1, 1);
        const fartTarget2 = new FartTarget(this.targets[2].length, xPos2, 2);

        this.fartTarget[1].push(fartTarget1);
        this.fartTarget[2].push(fartTarget2);

        console.log(this.fartTarget)
    }

    moveFartTargets() {
        for (let playerID in this.fartTarget) {
            this.fartTarget[playerID].forEach((fartTarget, index) => {
                fartTarget.move();
            });
        }
    }


    showTutorial() {
        const tutorial = document.querySelector('.js-tutorial');
        tutorial.setAttribute('data-state', 'visible');

        gsap.set(tutorial, { opacity: 0 });

        gsap.to(tutorial, {
            duration: 1,
            opacity: 1,
            delay: 1,
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(tutorial, {
                        duration: 1,
                        opacity: 0,
                        onComplete: () => {
                            tutorial.setAttribute('data-state', 'hidden');
                        }
                    });
                }, 2000)
            }
        });
    }

    showCountdown() {
        const countdown = document.querySelector('.js-countdown');
        const images = countdown.querySelectorAll('img');

        countdown.setAttribute('data-state', 'hidden');
        this.hasStarted = true;
        this.melodyPlayer.startNewWave(120);
        this.scheduleFartTargets();

        const tl = gsap.timeline({
            delay: 2,
            onStart: () => {
                countdown.setAttribute('data-state', 'visible');
                this.showTutorial();
            },
            onComplete: () => {
                // countdown.setAttribute('data-state', 'hidden');
                // this.hasStarted = true;
                // this.melodyPlayer.startNewWave(120);
                // this.scheduleFartTargets();
                // tl.kill();
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
        }

        // // HACK - Fast start
        // this.hasStarted = true;
        // this.melodyPlayer.start();
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
    }

    checkFartSuccess() {
        if(this.player1.hasFart && this.player2.hasFart) {
            this.fartSuccess = true
            console.log('Both players farted')
        }else {
            this.fartSuccess = false
            console.log('One or both players did not fart')
        }
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
        this.updateFartTargets(1)
        this.updateFartTargets(2)
    }

    updateFartTargets(playerID) {
        if (this.fartTarget[playerID].length === 0) return
        if (!this.fartTarget[playerID]) return

        for (let i = 0; i < this.fartTarget[playerID].length; i++) {
            const fartTarget = this.fartTarget[playerID][i]
            if (!fartTarget) return;
            fartTarget.move()
        }

        const currFartTarget = this.fartTarget[playerID][0];

        if (currFartTarget.hasExpired()) {
            currFartTarget.remove();
            this.fartTarget[playerID].splice(0, 1);
        }
    }



    // TODO: logic for checkResults & end condition
    checkResults() {

    }

    end() {
        // const scorespopup = document.querySelector('.js-scorespopup');
        // const leaderboardpopup = document.querySelector('.js-leaderboardpopup');
        // scorespopup.setAttribute('data-state', 'visible');

        // const buttons = [
        //     this.player1.instance.buttons[0],
        //     this.player2.instance.buttons[0]
        // ]

        // const keydownHandler = (event) => {
        //     scorespopup.setAttribute('data-state', 'hidden');

        //     buttons.forEach(button => {
        //         button.removeEventListener('keydown', keydownHandler);
        //     });

        //     this.player1.leaderboard.postScore({
        //     username: "Team test",
        //     value: Math.random() * 100
        //     }).then(() => {
        //     this.player1.leaderboard.getScores().then((response) => {
        //         new LeaderboardPopup({
        //         element: leaderboardpopup,
        //         response: response
        //         }).show();
        //     });
        //     });
        // };

        // buttons.forEach(button => {
        //     button.addEventListener('keydown', keydownHandler);
        // });

        // this.hasStarted = false
        // this.targets = {}
    }

    restart(){
        console.log('restart')
    }

    increaseSpeed(num) {
        this.speed += num
    }
}
