import Axis from 'axis-api'
import Game from './Game'
import * as PIXI from 'pixi.js'
import { AnimatedSprite, Assets } from 'pixi.js';
import { wait } from '../utils/async/wait'
import { SCREEN_RATIO } from '../settings';

const BASE_SPRITE_SIZE = 0.6

const $$score = document.querySelector('.score')
const $$player1Combo = document.querySelector('.combo.player-1 p')
const $$player2Combo = document.querySelector('.combo.player-2 p')

export default class Player {
    combo = 0
    maxCombo = 0
    sprite = null

    constructor(playerID) {
        this.game = new Game()
        this.app = this.game.app
        this.playerID = playerID

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
            this.sprite.zIndex = 1;

            this.app.stage.addChild(this.sprite);
        });
    }

    increaseCombo(amount = 1) {
        this.combo += amount
        this.maxCombo = Math.max(this.maxCombo, this.combo)

        $$player1Combo.innerHTML = this.combo
        $$player2Combo.innerHTML = this.combo
    }

    resetCombo() {
        this.combo = 0

        $$player1Combo.innerHTML = this.combo
        $$player2Combo.innerHTML = this.combo
    }

    incrementScore(amount) {
        this.game.score += amount * this.combo
        $$score.innerHTML = this.game.score
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
