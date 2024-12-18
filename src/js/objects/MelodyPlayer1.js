import MidiPlayer from 'midi-player-js';
import { Soundfont } from "smplr";
import Game from './Game1.js'
import Target from "./Target1.js";

//Onjectif de cette class : Analyser le fichier midi pour timer l'apparition des choux

export default class MelodyPlayer {

    constructor(tempo) {
        this.tempo = tempo;
        this.currentTick = 0;
        this.game = new Game(); // singleton
        this._alreadyStarted = false

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

        this.instrument2 = new Soundfont(
            this.context,
            {
                instrument: "koto"
            }
        );

        this.fetchMelody()
    }

    /**
     * Récupération du fichier MID
     */
    fetchMelody() {
        fetch('../../assets/merge.mid')
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                this.player.loadArrayBuffer(arrayBuffer);
                this.setPlayerEvents()
            })
            .catch(error => {
                console.error('Error loading the MIDI file:', error);
            });
    }

    setPlayerEvents() {

        //Update du currentTick

        this.player.on('playing', (e) => {
            this.player.tempo = this.tempo
        })

        this.player.on('endOfFile', () => {
            this.game.end();
        });

        this.player.on('midiEvent', (note) => {
            // if (note.noteName) {
            //     if (note.name === 'Note on' && note.track === 1) {
            //         this.instrument.start({
            //             note: note.noteNumber,
            //         });
            //     }
            //     if (note.name === 'Note on' && note.track === 2) {
            //         this.instrument2.start({
            //             note: note.noteNumber,
            //         });
            //     }
            // }
        })
    }

    /**
     * Cette fonction sera à call a chaque fois qu'on veut accélérer la musique. Elle va changer le tempo, et
     * regénérer des choux
     */
    startNewWave(tempo) {
        if(!this._alreadyStarted){
            this.tempo = tempo
            this.intervalBetweenBeats = (60 / tempo) * 1000;
            this.createRandomChoux()
            this._alreadyStarted = true
        }
    }

    getObjectBeats(trackIdx){
        const rythmTrack = this.player.tracks[trackIdx]
        const events = rythmTrack.events
        let indexBeat = 0
        const timeBeat = 60/this.tempo * 1000
        const objBeats = {}

        const a = this.player.totalTicks / (this.player.getSongTime() * 1000)
        const tTick =  a * timeBeat;

        function incrementBeat(e){
            const i = indexBeat*tTick
            const i2 = (indexBeat+1)*tTick
            if( i <= e.tick && i2 > e.tick){
                objBeats[indexBeat+1].push(e)
            }
            else{
                indexBeat++;
                objBeats[indexBeat+1] = []
                incrementBeat(e)
            }
        }


        const rythmNotes = events.filter((e) => {
            if(e.name === 'Note on' && e.track == trackIdx +1 ){
                if(!objBeats[indexBeat+1]){
                    objBeats[indexBeat+1] = []
                }
                incrementBeat(e)
            }
            return e.name === 'Note on' && e.track == trackIdx+1
        })

        return objBeats
    }

    /**
     * Logique de création des choux
     */
    createRandomChoux() {
        const objBeats1 = this.getObjectBeats(0)
        const objBeats2 = this.getObjectBeats(1)


        function easyStart(i,obj,key){
            if(i < 32 && i%3 === 0){
                obj[key] = []
            }
        }

        function mediumMid(i,obj,key){
            if(i < 95 && i >= 32 && i%2 === 0){
                obj[key] = []
            }
        }

        Object.keys(objBeats1).forEach((key,i) => {
            if(i < 15 && objBeats1[key].length  >= 2){
                objBeats1[key] = []
            }
             if(i > 130 && objBeats1[key].length  == 2 || i%5 == 0){
                objBeats2[key] = []
            }
            easyStart(i,objBeats1,key)
            mediumMid(i,objBeats2,key)
            this.game.targets[1].push(new Target(0,this.game.distP1,1,key,this.intervalBetweenBeats,objBeats1))
        })

        Object.keys(objBeats2).forEach((key,i) => {
            if(i < 15 && objBeats2[key].length == 1 ){
                objBeats2[key] = []
            }
             if(i > 130 && objBeats2[key].length  === 4){
                objBeats2[key] = []
            }
            easyStart(i,objBeats2,key)
            mediumMid(i,objBeats2,key)
            this.game.targets[2].push(new Target(0,this.game.distP2,2,key,this.intervalBetweenBeats,objBeats2))
        })

        console.log(objBeats1,objBeats2)

        setTimeout(() => {
            console.log("Start playing");

            this.player.play()
            this.game.audioManager.play("music")
        },this.intervalBetweenBeats)
    }
}
