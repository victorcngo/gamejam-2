import { smallFarts, longFarts } from "./settings";
import{ debounce} from './utils/debounce.js'

export class AudioManager {
    constructor() {
        this.sounds = {};
        this.loaded = {};
        this.preloadSounds(smallFarts)
        this.preloadSounds(longFarts)
        this.debouncedPlay = debounce(this.play.bind(this), 1000);
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
        console.log(name, this.sounds[name]);
        if (this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play();
        }
    }

    stop(name) {
        if (this.sounds[name]) {
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0;
        }
    }
}