import * as PIXI from 'pixi.js'
import {
    radius,
    hitZonePosition,
    numOfTargets,
    hitRange,
    timelineY,
    arrowTypes,
    startSpeed,
    smallFarts
} from '../settings.js'
import Hit from './Hit.js'
import Hold from './Hold.js'
import MelodyPlayer from './MelodyPlayer.js';
import { AudioManager } from '../AudioManager.js'
import {player1, player2} from '../BorneManager/borneManager.js'
import {debounce} from "../utils/debounce";

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
        this.notes = []
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
        this.time = Date.now()
        this.bgTextureP1 = PIXI.Texture.from("/assets/icons/chou-1.svg");
        this.bgTextureP2 = PIXI.Texture.from("/assets/icons/chou-2.svg");


    }

    init() {
        //this.setMelodyPlayer();
        // Need click to allow audioContext, remove when startingpage completed
        player1.buttons[0].addEventListener('keydown', this.setMelodyPlayer)

        this.setStaticObjects()
        console.log(this.notes)
    }

    setMelodyPlayer() {
        if (!this.melodyPlayer) {
            this.melodyPlayer = new MelodyPlayer(90)
            document.querySelector('.start').style.display = "none";
            player1.buttons[0].removeEventListener('keydown', this.setMelodyPlayer)
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

    initInputs(){
        console.log("input init")
        const animateChar = (playerID) => {
            document.querySelector(`div.char${playerID}`).classList.toggle(('active'))
            document.querySelector(`div.char${playerID}Fart`).classList.toggle(('active'))
        }
        // debounce is used to prevent lagging when user spams the button
        const debouncedAnimateChar1 = debounce(() => animateChar(1), 500);
        const debouncedAnimateChar2 = debounce(() => animateChar(2), 500);

        const handleButtonADown = (playerID) => {
            let target = game.targets[playerID][0];
            if (!target) return

            if (target.type === 'hit') {
                const randomFart = smallFarts[Math.floor(Math.random() * smallFarts.length)]
                game.audioManager.debouncedPlay(randomFart.name);
            }

            target.showFeedback()
            // TODO: au lieu de showProut, faire une fonction pour stocker le résultat de chaque joueur. Puis on regarde si les 2 joueurs ont chacun réussi leur action. S'ils ont réussi tous les 2, on appelle showProut
            if (target.isHitCorrect() && target.type === 'hit') showProut()

            if (playerID === 1) {
                debouncedAnimateChar1()
            }
            if (playerID === 2) {
                debouncedAnimateChar2()
            }
        }

        player1.buttons[0].addEventListener('keydown', () => handleButtonADown(1))
        player2.buttons[0].addEventListener('keydown', () => handleButtonADown(2))

    }

    createTargets(notes,bpm) {
        const targetsPlayer1 = []
        const targetsPlayer2 = []

        const distToTraverse = window.innerWidth*.5
        const offset = window.innerWidth * .5
        console.log(notes)
        notes.forEach((note,i) => {
            const t = note.tick
            const offsetTime = 0
            const distP1 = offset - distToTraverse
            const distP2 = offset + distToTraverse

            targetsPlayer1.push(new Hit(this.targetsContainer, 'left', i, distP1, 1, bpm,t))
            targetsPlayer2.push(new Hit(this.targetsContainer, 'left', i, distP2, 2, bpm,t))

        })

        this.targets[1] = targetsPlayer1
        this.targets[2] = targetsPlayer2

        this.app.stage.addChild(this.targetsContainer);

        this.initInputs()

        setTimeout(() => {
            this.melodyPlayer.startNewWave(107)
            this.speed = 1
        })
    }

    update(playerID,dt) {
        if (this.targets && this.targets === 0) return
        if ( this.targets[playerID] && this.targets[playerID].length === 0) return
        if (!this.targets[playerID]) return
        for (let i = 0; i < this.targets[playerID].length; i++) {
            const target = this.targets[playerID][i]
            if (!target) return;
            if (target.type === 'hold') {
                target.moveBar()
                if (!this.userIsHolding || i !== 0) {
                    target.move(dt);
                }
            } else if (target.type === 'hit') {
                target.move(dt)
            }
        }
        const currTarget = this.targets[playerID][0]
        // if (currTarget.isMissed()) {
        //     currTarget.remove();
        //     this.targets[playerID].splice(0, 1);
        // }


    }

    updateAll() {
        if (!this.hasStarted) return
        const currentTime = Date.now()
        const deltaTime = currentTime - this.time
        this.time = currentTime
        this.update(1,deltaTime)
        this.update(2,deltaTime)
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