import MidiPlayer from 'midi-player-js';
import { Soundfont } from "smplr";
import Game from './Game'
import Target from "./Target";

//Onjectif de cette class : Analyser le fichier midi pour timer l'apparition des choux

export default class MelodyPlayer {


    constructor(tempo) {

        /**
         * Tempo = La vitesse d'éxécution de la musique, pour gérer la difficulté; la musique de base est à 110,
         * mais il faudrait la baisser pour la difficulté facile
         *
         * CurrentTick = le tick actuel de la musique, la valeur qui va se faire comparer à la valeur d'apparition du chou
         * Sachant que la musique loopera, elle repassera souvent à 0
         */


        this.tempo = tempo
        this.game = new Game() // singleton

        /**
         * Le Player du fichier MIDI. Il ne fait pas de son, il trigger juste un event lorsque qu'un note est jouée
         * La fonction à l'intérieur est joué à chaque note jouée, et je ne sais pas pourquoi met le tempo est reset à chaque note
         * jouée donc il faut le remettre à la bonne value à chaque fois.
         *
         */

        this.player = new MidiPlayer.Player(() => {
            this.player.setTempo(this.tempo)
        })

        this.context = new AudioContext();

        /**
         * L'instrument choisi. J'ai mis le kalimba, mais vous pouvez voir la liste disponible ici :
         * https://danigb.github.io/smplr/
         */

        this.instrument = new Soundfont(
            this.context,
            {
                instrument: "kalimba"
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
                this.startNewWave(this.tempo)
                this.setPlayerEvents()
            })
            .catch(error => {
                console.error('Error loading the MIDI file:', error);
            })


    }

    setPlayerEvents() {

        //Update du currentTick

        this.player.on('playing', (e) => {
            this.player.tempo = this.tempo
        })


        //A REMOVE, C'EST PAS PROPRE, C'EST UN LOOP DE LA MELLODY POUR LA DEMO
        this.player.on('endOfFile', () => {

        })

        /**
         * Autre fonction qui se lance à event du midi player;
         * à chaque event, on va vérifier si cette event est l'event "Note on", qui correspond au moment
         * où une note est jouée, et si cette note est de la track 2, la track de la melody,
         * et si ces 2 conditions sont réunies, on demande à l'intrument de jouer la note.
         */

        this.player.on('midiEvent', (note) => {
            if (note.noteName) {
                if (note.name === 'Note on' && note.track === 1) {
                    this.instrument.start({
                        note: note.noteNumber,
                    });
                }
            }
        })
    }

    /**
     * Cette fonction sera à call a chaque fois qu'on veut accélérer la musique. Elle va changer le tempo, et
     * regénérer des choux
     *
     */


    startNewWave(tempo) {
        console.log(tempo)
        this.tempo = tempo
        this.intervalBetweenBeats = (60 / tempo) * 1000;
        this.createRandomChoux()

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
     *
     * Logique de création des choux
     */
    createRandomChoux() {
        const objBeats1 = this.getObjectBeats(0)
        const objBeats2 = this.getObjectBeats(1)

        Object.keys(objBeats1).forEach(key => {
            this.game.targets[1].push(new Target(0,this.game.distP1,1,key,this.intervalBetweenBeats,objBeats1))

        })

        Object.keys(objBeats2).forEach(key => {
            this.game.targets[2].push(new Target(0,this.game.distP2,2,key,this.intervalBetweenBeats,objBeats2))
        })



        setTimeout(() => {
            this.player.play()
        },this.intervalBetweenBeats*3)
    }
}
