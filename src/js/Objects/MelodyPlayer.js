import MidiPlayer from 'midi-player-js';
import { Soundfont } from "smplr";

export default class MelodyPlayer {


    constructor() {
        
        this.tempo = 80
        this.currentTick = 0

        this.player = new MidiPlayer.Player(()=>{
            this.player.setTempo(this.tempo)
        })

        this.context = new AudioContext();
        this.instrument = new Soundfont(
            this.context, 
            { 
                instrument: "kalimba"
            }
        ); 

        this.fetchMelody()
        this.setPlayerEvents()
        

    }

    fetchMelody(){
        fetch('../../assets/soupeWithTimings.MID')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            this.player.loadArrayBuffer(arrayBuffer); 
            this.startNewWave(110)
        })
        .catch(error => {
            console.error('Error loading the MIDI file:', error);
        })

        
    }

    

    setPlayerEvents(){

        this.player.on('playing',()=>{
            this.currentTick = this.player.tick
        })

        this.player.on('midiEvent',(note)=>{
            if (note.noteName) {
                if(note.name === 'Note on' && note.track === 2){
                    this.instrument.start({ 
                        note: note.noteNumber, 
                        velocity: 80, 
                        duration:0.1
                    });
                }
            }
        })
    }


    startNewWave(tempo){
        this.tempo = tempo
        this.createRandomChoux()
        this.player.play()
    }

    createRandomChoux(){

        const choux = []

        const rythmTrack = this.player.tracks[2]
        const rythmNotes = []
        
        for(const note of rythmTrack.events){
            if(note.name === 'Note on'){
                rythmNotes.push(note)
            }
        }

        let lastChouStartTime = 0
        let lastChouDuration = 0

        for(const note of rythmNotes){
            if(note.tick > lastChouStartTime + lastChouDuration + 1000){

                //Add random to choux's creation, avoiding getting the same pattern
                if(Math.random() > 1/3){
                    
                    const chouTypeIndice = Math.floor(Math.random()*2.99)
                    if(chouTypeIndice === 0){

                        //Chou type === Hit
                        choux.push({
                            type:'hit',
                            tick:note.tick,
                            duration:0
                        })
                        lastChouStartTime = note.tick
                        lastChouDuration = 0

                    }else if(chouTypeIndice === 1){
                        
                        //Chou type === Hold

                        /**
                         * TO DO : Create choux duration logic
                         * 
                         */

                        const chouDuration = Math.random()*2000+1000

                        choux.push({
                            type:'hold',
                            tick:note.tick,
                            duration:chouDuration
                        })
                        lastChouStartTime = note.tick
                        lastChouDuration = chouDuration

                    }else{

                        //Chou type === Mix

                        /**
                         * TO DO : Create choux duration logic
                         * 
                         */

                        const chouDuration = Math.random()*2000+3000

                        choux.push({
                            type:'Mix',
                            tick:note.tick,
                            duration:chouDuration
                        })
                        lastChouStartTime = note.tick
                        lastChouDuration = chouDuration

                    }

                }
            }
        }

        console.log(choux)
        
    }



}