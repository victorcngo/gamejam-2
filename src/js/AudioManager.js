import { music, perfect, failedFart, perfectFart } from "./settings";
import { debounce } from './utils/async/debounce'

export class AudioManager {
    constructor() {
        this.sounds = {};
        this.loaded = {};
        this.preloadSounds(music)
        this.preloadSounds(perfect)
        this.preloadSounds(failedFart)
        this.preloadSounds(perfectFart)
        this.debouncedPlay = debounce(this.play.bind(this), 1000);
        this.activeSounds = [];
    }

    loadSound(name, src) {
        const audio = new Audio(src);
        audio.loop = false;
        this.sounds[name] = audio;
        this.loaded[name] = false;
    }

    preloadSounds(soundList) {
        soundList.forEach(sound => {
            this.loadSound(sound.name, sound.src);
            this.sounds[sound.name].load();
            this.loaded[sound.name] = true;
        });
    }

    play(name) {
        if (this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play();
            this.activeSounds.push(this.sounds[name]);
        }
    }

    stop() {
        this.activeSounds.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.activeSounds = [];
    }

    clearDebouncedPlay() {
        if (this.debouncedPlay.cancel) {
            this.debouncedPlay.cancel();
        }
    }
}
