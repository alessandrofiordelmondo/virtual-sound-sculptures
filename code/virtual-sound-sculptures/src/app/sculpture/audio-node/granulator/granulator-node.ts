import { Gran } from './gran'
import { ToGranulatorParam, Coord } from '../../../interfaces'
import { BinauralNode } from '../binaural/binaural-node';

export class GranulatorNode{
    constructor(
        public audioContext: AudioContext,
        public vox:number,
        public param: ToGranulatorParam,
        public coord: Coord,
        public buffer:AudioBuffer,
    ){
        this.gain = this.audioContext.createGain();
        this.bin = new BinauralNode(this.audioContext);

        this.gain.connect(this.bin.input)
        
        for (let i=0; i < this.vox; i++){
            this.g[i] = new Gran(
                this.audioContext,
                this.param,
                buffer
            )
            this.g[i].connect(this.gain);
        }
        this.gain.gain.value = this.param.gain;
    }

    public gain: GainNode;
    public g: Gran[] = [];
    public bin: BinauralNode;

    public connect(destination){
        this.bin.connect(destination)
    }
    
    public start(){
        for (let i in this.g){
            this.g[i].start()
        }
    }
    public stop(){
        for (let i in this.g){
            this.g[i].stop()
        }
        this.bin.disconnect()
        this.gain.disconnect()
    }
}