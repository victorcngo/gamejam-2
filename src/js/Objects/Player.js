import Axis from 'axis-api'
import Game from './Game'
import * as PIXI from 'pixi.js'
import { AnimatedSprite, Assets } from 'pixi.js';
import { wait } from '../utils/async/wait'
import { SCREEN_RATIO } from '../settings';
import {gsap} from "gsap"

const BASE_SPRITE_SIZE = 0.6

export default class Player {
    combo = 0
    maxCombo = 0
    sprite = null

    constructor(playerID, scoreNode, comboNode) {
        this.game = new Game()
        this.app = this.game.app
        this.playerID = playerID
        this.$$score = scoreNode
        this.$$playerCombo = comboNode
        this._tlScore = null

        this.init()
    }

    async init() {
        this.instance = Axis.createPlayer({
            id: this.playerID,
            joysticks: Axis['joystick' + this.playerID],
            buttons: Axis.buttonManager.getButtonsById(this.playerID)
        })

        this.leaderboard = Axis.createLeaderboard({
            id: "la-soupe-aux-choux-24",
        });

        if (PIXI.Loader.shared.loading) {
            await new Promise((resolve, reject) => {
                PIXI.Loader.shared.onComplete.add(() => {
                    resolve();
                });
            });
            this.setupSprite();
        } else {
            this.setupSprite();
        }
    }

    setupSprite() {
        const basePath = 'assets/sprites/';
        const baseFileName = this.playerID === 1 ? 'rose' : 'orange';

        const spritePath = `${basePath}${baseFileName}.png`;
        const atlasPath = `${basePath}${baseFileName}.json`;

        PIXI.Loader.shared.add(atlasPath).load((loader, resources) => {
            const sheet = resources[atlasPath].spritesheet;
            this.sprite = new PIXI.AnimatedSprite(sheet.animations[baseFileName]);

            const frameWidth = this.sprite.width / this.sprite.totalFrames;
            this.sprite.anchor.set(0.5);
            this.sprite.x = this.playerID === 1
            ? (window.innerWidth * 0.5) - ((frameWidth * 0.5) * SCREEN_RATIO)
            : (window.innerWidth * 0.5) + ((frameWidth * 0.5) * SCREEN_RATIO);
            this.sprite.y = (window.innerHeight * 0.5) + (SCREEN_RATIO * 100);
            this.sprite.scale.set(BASE_SPRITE_SIZE * SCREEN_RATIO);

            this.app.stage.addChild(this.sprite);
        });
    }

    increaseCombo(amount = 1) {
        this.combo += amount
        this.maxCombo = Math.max(this.maxCombo, this.combo)
        console.log(this.$$playerCombo.parentElement.parentElement)
        const elt = this.$$playerCombo.parentElement.parentElement
        this._tlScore?.kill()
        this._tlScore = gsap.timeline()
            .to(elt,{
                scale:1.1,
                duration: this.game.melodyPlayer.intervalBetweenBeats/1000,
                ease: "elastic.out(1, 0.3)",

            })
            .to(this.$$playerCombo,{
                scale:1.25,
                duration: this.game.melodyPlayer.intervalBetweenBeats/1000,
                ease: "elastic.out(1, 0.3)",
                onComplete: () => {
                    this.$$playerCombo.innerHTML = this.combo
                }
            },"<")
            .to(elt,{
                scale:1,
                duration: (this.game.melodyPlayer.intervalBetweenBeats/1000) *.5,
                ease: "power2.out"})
            .to(this.$$playerCombo,{
                scale:1,
                duration: (this.game.melodyPlayer.intervalBetweenBeats/1000) *.5,
                ease: "power2.out"},"<")
    }

    resetCombo() {
        this.combo = 0
        this.$$playerCombo.innerHTML = this.combo
    }

    incrementScore(amount) {
        this.game.score += amount * this.combo
        this.$$score.innerHTML = this.game.score
    }

    async triggerAnimation(animationName) {
        switch (animationName) {
            case "success":
                this.sprite.gotoAndStop(1);
                break;
            case "fart":
                this.sprite.gotoAndStop(2);
                break;
            case "missed":
                this.sprite.gotoAndStop(3);
                break;
            default:
                break;
        }

        await wait(200);
        this.sprite.gotoAndStop(0);
    }
}
