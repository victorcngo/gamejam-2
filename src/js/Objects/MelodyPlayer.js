import MidiPlayer from 'midi-player-js';
import { Soundfont } from "smplr";
import Game from './Game'

//Onjectif de cette class : Analyser le fichier midi pour timer l'apparition des choux

export default class MelodyPlayer {

    constructor(tempo) {
        this.tempo = tempo;
        this.currentTick = 0;
        this.game = new Game(); // singleton

        this.player = new MidiPlayer.Player(() => {
            this.player.setTempo(this.tempo);
        });

        this.context = new AudioContext();

        this.instrument = new Soundfont(
            this.context,
            {
                instrument: "kalimba"
            }
        );

        this.setPlayerEvents();
    }

    /**
     * Récupération du fichier MID
     */
    fetchMelody() {
        return fetch('../../assets/soupeWithTimings.MID')
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                this.player.loadArrayBuffer(arrayBuffer);
            })
            .catch(error => {
                console.error('Error loading the MIDI file:', error);
            });
    }

    setPlayerEvents() {
        this.player.on('playing', () => {
            this.currentTick = this.player.tick;
        });

        this.player.on('endOfFile', () => {
            this.game.end();
        });

        this.player.on('midiEvent', (note) => {
            if (note.noteName) {
                if (note.name === 'Note on' && note.track === 2) {
                    this.instrument.start({
                        note: note.noteNumber,
                        velocity: 80,
                        duration: 0.1
                    });
                }
            }
        });
    }

    /**
     * Cette fonction sera à call a chaque fois qu'on veut accélérer la musique. Elle va changer le tempo, et
     * regénérer des choux
     */
    startNewWave(tempo) {
        this.tempo = tempo;
        this.createRandomChoux();
        this.player.play();
    }

    /**
     * Logique de création des choux
     */
    createRandomChoux() {
        const choux = [];
        const rythmTrack = this.player.tracks[2];
        const rythmNotes = [];

        for (const note of rythmTrack.events) {
            if (note.name === 'Note on') {
                rythmNotes.push(note);
            }
        }

        let lastChouStartTime = 0;
        let lastChouDuration = 0;

        for (const note of rythmNotes) {
            if (note.tick > lastChouStartTime + lastChouDuration + 1000) {
                if (Math.random() > 1 / 3) {
                    const chouTypeIndice = Math.floor(Math.random() * 2.99);
                    if (chouTypeIndice === 0) {
                        choux.push({
                            type: 'hit',
                            tick: note.tick,
                            duration: 0
                        });

                        lastChouStartTime = note.tick;
                        lastChouDuration = 0;
                    }
                }
            }
        }
    }

    /**
     * Start function to initialize and start the melody player
     */
    start() {
        this.fetchMelody().then(() => {
            this.startNewWave(this.tempo);
        });
    }
}
