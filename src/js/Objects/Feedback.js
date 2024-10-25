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

        const randomOffset = (Math.random() - 0.5) * 100;
        this.sprite.x = this.playerID === 1
            ? window.innerWidth / 2 - (SCREEN_RATIO * 500) + randomOffset
            : window.innerWidth / 2 + (SCREEN_RATIO * 500) + randomOffset;
        this.sprite.y = TIMELINE_Y - (SCREEN_RATIO);
        this.sprite.rotation = (Math.random() * 0.4) - 0.2;
        this.app.stage.addChild(this.sprite);

        const timeline = gsap.timeline();

        timeline.to(this.sprite, {
            y: this.sprite.y - (SCREEN_RATIO * 150),
            duration: 1,
            ease: 'power4.out'
        }).to(this.sprite, {
            alpha: 0,
            duration: 1,
            ease: 'power4.out',
            onComplete: () => {
                this.remove();
            }
        });
    }

    remove() {
        this.app.stage.removeChild(this.sprite);
    }
}
