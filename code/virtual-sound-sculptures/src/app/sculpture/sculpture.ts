import { BackendService } from '../backend.service';
import { GranulatorNode } from './audio-node/granulator/granulator-node'
import { SculptureInterface } from '../interfaces'

export class Sculpture{
    constructor(
        public cntx: AudioContext,
        public scupture: SculptureInterface,
        private backend: BackendService,
    ){}   

    sounds: GranulatorNode[] = [];
    reverb: ConvolverNode;
    gain: GainNode;
    public isInit:boolean = false;
    public isLoaded:boolean = false;
    public isStarted:boolean = false;

    init(){
        this.isInit = true;
        this.reverb = this.cntx.createConvolver();
        this.gain = this.cntx.createGain();
        this.gain.gain.value = 0;
        this.reverb.connect(this.gain).connect(this.cntx.destination);
        this.backend.getUrl('gs://gallery-audio-database.appspot.com/reverb/Freeze 4-Audio.wav').then((url:string) => {
            this.backend.loadAudioData(url).subscribe((rBuf) => {
                this.cntx.decodeAudioData(rBuf, (revBuffer:AudioBuffer) => {
                    this.reverb.buffer = revBuffer;

                    this.backend.getStorageList(this.scupture.name).then((arrayUrl:string[]) => {
                        let idx=0;
                        arrayUrl.forEach(res => {
                            this.backend.getUrl(res).then((url:string) => {
                                let i = this.getIndex(url, this.scupture.name);
                                this.backend.loadAudioData(url).subscribe((aBuf) => {
                                    this.cntx.decodeAudioData(aBuf, (audioBuffer:AudioBuffer) => {
                                        this.sounds[i] = new GranulatorNode(
                                            this.cntx,
                                            this.scupture.soundSpec.vox[i],
                                            this.scupture.soundSpec.param[i],
                                            this.scupture.coords[i],
                                            audioBuffer
                                        )
                                        this.sounds[i].connect(this.reverb)                                    

                                        if (idx < arrayUrl.length - 1){
                                            idx += 1;
                                        } else if (idx == arrayUrl.length - 1){
                                            this.isLoaded = true;
                                        }
                                    })
                                })
                            })
                        })  
                    })
                })
            })
        })
    }

    start(){
        this.isStarted = true;
        setTimeout(() => {
            this.sounds.forEach((s:GranulatorNode) => {
                s.start()
            })
            this.gain.gain.linearRampToValueAtTime(1, this.cntx.currentTime+5)
        }, 1000)
    }

    stop(){
        for (let i in this.sounds){
            this.sounds[i].stop()
        }
        this.reverb.disconnect()
        this.isInit = false;
        this.isLoaded = false;
        this.isStarted = false;
    }

    private getIndex(url:string, name:string){
        /*
        url = http url
        name = sculpture name
        */
        const expression = new RegExp(name+'-\\d\\.mp3');
        const filename = url.match(expression)[0];
        return parseInt(filename[filename.indexOf('-')+1]) -1;
    }
}