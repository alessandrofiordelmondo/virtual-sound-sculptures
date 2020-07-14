import { ToGranulatorParam } from '../../../interfaces'

declare var hanning, getFrameTime, getFrameDelay

export class Gran{
    constructor(
        public audioContext:AudioContext,
        public param: ToGranulatorParam,
        public buffer: any,
    ){
        this.timeOffSet = this.audioContext.currentTime
        this.gain = this.audioContext.createGain();
    }

    private state:boolean = false;
    private timeOffSet:number;
    private gain: GainNode;
    private sound: AudioBufferSourceNode;

    connect(destination){
        this.gain.connect(destination)
    }

    private play(){
        const cue = Math.random()
        this.sound = this.audioContext.createBufferSource();
        this.sound.buffer = this.buffer;
        this.sound.connect(this.gain)

        const dur = this.sound.buffer.duration;
        
        const starPoint = cue * dur;
        let cuePoint = ((this.audioContext.currentTime - this.timeOffSet) + starPoint) % dur;
        let fTime = getFrameTime(this.param.time, this.param.timeRND);
        
        if (fTime == null || fTime == NaN || fTime < 0){
            fTime = this.param.time/1000;
        }
        
        let fCue = cuePoint - fTime;
        if (fCue < 0){
            fCue = 0;
        }
        
        let fDelay = getFrameDelay(fTime, this.param.dencity)

        this.sound.start(this.audioContext.currentTime, fCue, fTime + 0.1);
        this.gain.gain.setValueCurveAtTime(hanning, this.audioContext.currentTime, fTime)

        this.sound.onended = () => {
            this.sound.disconnect()
            if(this.state){
                setTimeout(() => {
                    this.play()
                }, fDelay)
            }
        }
    }
    public start(){
        this.state = true;
        this.play()
    }
    public stop(){
        this.state = false;
    }
}