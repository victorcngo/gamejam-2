import Axis from 'axis-api'
import Game from './Game'
import * as PIXI from 'pixi.js'
import { AnimatedSprite, Assets } from 'pixi.js';
import { wait } from './../utils/async/wait'

const BASE_SPRITE_SIZE = 0.6
const SCREEN_RATIO = (window.innerWidth / 2880)

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

        this.text = new PIXI.Text(
            'x0',
            {
                fontFamily: 'Arial',
                fontSize: 32,
                fill: 0xffffff,
                align: 'center'
            }
        );

        this.text.x = this.playerID === 1
            ? window.innerWidth * 0.5 - 100
            : window.innerWidth * 0.5 + 100
        this.app.stage.addChild(this.text)
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
            ? (window.innerWidth * 0.5) - ((frameWidth) * SCREEN_RATIO)
            : (window.innerWidth * 0.5) + ((frameWidth) * SCREEN_RATIO);
            this.sprite.y = (window.innerHeight * 0.5) + (SCREEN_RATIO * 100);
            this.sprite.scale.set(BASE_SPRITE_SIZE * SCREEN_RATIO);
            this.sprite.zIndex = 1;

            this.app.stage.addChild(this.sprite);
        });
    }

    increaseCombo(amount = 1) {
        this.combo += amount
        this.maxCombo = Math.max(this.maxCombo, this.combo)
        this.text.text = 'x' + this.combo
    }

    resetCombo() {
        this.combo = 0
        this.text.text = 'x' + this.combo
    }

    incrementScore(amount) {
        // TODO - Handle the display of the score
        this.game.score += amount * this.combo
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

        // Attendre 200ms avant de revenir à la frame initiale
        await wait(200);
        this.sprite.gotoAndStop(0);
    }
}
