import * as PIXI from 'pixi.js';
import Game from './Game';
import { gsap } from 'gsap';
import { SCREEN_RATIO, TIMELINE_Y } from '../settings';

export default class Feedback {
    constructor(type, playerID) {
        this.game = new Game();
        this.app = this.game.app;
        this.type = type;
        this.playerID = playerID;
    }

    init() {
        const basePath = 'assets/sprites/feedbacks/';
        const atlasPath = `${basePath}${this.type}.json`;

        if (PIXI.Loader.shared.resources[atlasPath]) {
            this.setupSprite(PIXI.Loader.shared.resources[atlasPath].spritesheet);
        } else {
            PIXI.Loader.shared.add(atlasPath).load((loader, resources) => {
                this.setupSprite(resources[atlasPath].spritesheet);
            });
        }
    }

    setupSprite(sheet) {
        this.sprite = new PIXI.AnimatedSprite(sheet.animations[this.type]);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.playerID === 1
            ? window.innerWidth / 2 - (SCREEN_RATIO * 500)
            : window.innerWidth / 2 + (SCREEN_RATIO * 500);
        this.sprite.y = TIMELINE_Y - (SCREEN_RATIO * 100);
        // add a slight random rotation
        this.sprite.rotation = (Math.random() * 0.2) - 0.1;
        this.app.stage.addChild(this.sprite);

        gsap.to(this.sprite, {
            y: this.sprite.y - (SCREEN_RATIO * 100),
            alpha: 0,
            duration: 1,
            onComplete: () => {
                this.remove();
            }
        });
    }

    remove() {
        this.app.stage.removeChild(this.sprite);
        console.log("remove the feedback!");
    }
}
