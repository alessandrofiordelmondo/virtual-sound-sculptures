import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { Subscription } from 'rxjs';
import { SculptureInterface, CoordHead, Coord } from './interfaces';
import { InteractiveMapService } from './interactive-map.service';
import { Sculpture } from './sculpture/sculpture';
import { GranulatorNode } from './sculpture/audio-node/granulator/granulator-node';

@Injectable({
  providedIn: 'root'
})
export class SculptureService {

  AUDIOCONTEXT: AudioContext;

  private isLoaded:boolean = false;

  constructor(
    private backend: BackendService,
    private interactiveMap: InteractiveMapService,
  ) { 
    this.AUDIOCONTEXT = new AudioContext({
      latencyHint: "balanced",
      sampleRate: 44100
    })
  }

  sculptureSub: Subscription;
  sculptureData: SculptureInterface[] = [];
  sculptures: Sculpture[] = [];

  public loadSculpture(){
    return new Promise((resolve) => {
      this.backend.authentification().then(() => {
        this.backend.fetchSculpture().subscribe(() => {
          this.sculptureSub = this.backend.sculpture.subscribe(res => {
            res.forEach((sculpture:SculptureInterface) => {
              this.sculptureData.push(sculpture)
            });
            this.interactiveMap.sculptureData = res;
            resolve()
          })
          this.isLoaded = true;
        })
      })  
    })
  }

  public generateSculpture(listener:CoordHead){
    this.sculptureData.forEach((s:SculptureInterface) => {
      for (let i in s.coords){
        if(this.positionMetchingCheck(listener, s.coords[i])){
          if(!this.checkSculptureName(s.name, this.sculptures)){
            this.sculptures.push( new Sculpture(
              this.AUDIOCONTEXT,
              s,
              this.backend
            ))
          }
        }
      }
    })
  }

  public playSculpture(listener:CoordHead){
    if(this.sculptures.length > 0){
      this.sculptures.forEach((s:Sculpture) => {
        if (s == undefined){
        return
        }
        if(!s.isInit){
          //initialize
          s.init();
        } else if (s.isInit && s.isLoaded && !s.isStarted){
          //play
          s.start()
        } else if (s.isStarted){
          //move 
          this.sculptureMove(listener, s)
        }
        // check if the listener is no more near one of the sculpture
        let del = false;
        for (let i in s.scupture.coords){
          if (this.positionMetchingCheck(listener, s.scupture.coords[i])){
            del = false;
            break
          }
          del = true
        }
        if (del){
          s.stop()
          this.sculptures[this.sculptures.indexOf(s)] = undefined;
        } 
      })
    }
  }

  private sculptureMove(listener:CoordHead, sculpture:Sculpture){
    if(!sculpture.isInit && !sculpture.isStarted){
      return
    }
    sculpture.sounds.forEach((s:GranulatorNode) => {
      let idx = sculpture.sounds.indexOf(s);
      let D = this.listener2SingleSourceDistance(listener, s.coord);
      let b = this.listener2SourceBearing(listener, s.coord);
      let B = this.relativeHeading(b, listener.head)
      B = (360 - B)%360;
      s.bin.move(B, D*1000);
    })
  }
//////////////////////////////////////////////////
  // CHECK
  private listener2SingleSourceDistance(listenerCoord:CoordHead, sourceCoord:Coord):number {
    /*
   lat1: listener latitude
   lon1: listener longitude
   lat2: source latitude
   lon2: source longitude
   */
  const R = 6371e3; // metres
  const lat1 = listenerCoord.lat * Math.PI/180; // 
  const lat2 = sourceCoord.lon * Math.PI/180;
  const delataLat = (sourceCoord.lat - listenerCoord.lat) * Math.PI/180;
  const delataLon = (sourceCoord.lon - listenerCoord.lon) * Math.PI/180;
  
  const a = Math.sin(delataLat/2)*Math.sin(delataLat/2) +
   Math.cos(lat1) * Math.cos(lat2) * Math.sin(delataLon/2) * Math.sin(delataLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c
 }
 
 private listener2SourceBearing(listenerCoord:CoordHead, sourceCoord:Coord):number {
   /*
   lat1: pointer latitude
   lon1: pointer longitude
   lat2: source latitude
   lon2: source longitude
   */
   const lat1 = listenerCoord.lat * Math.PI/180
   const lat2 = sourceCoord.lat * Math.PI/180
   const delataLon = (sourceCoord.lon-listenerCoord.lon) * Math.PI/180;

   const x = Math.cos(lat2) * Math.sin(delataLon);
   const y = Math.cos(lat1) * Math.sin(lat2) -
     Math.sin(lat1)*Math.cos(lat2)*Math.cos(delataLon)

   let b = Math.atan2(x, y)

   if (b < 0){
     b = (Math.PI*2) + b
   }

   b = b * 180/Math.PI

   return b
 }

 private relativeHeading(B:number, H:number):number {
   /*
   B = bearing
   H = absolute Heading
   */
  const alpha = ((360 - H) + B) % 360
  return alpha
 }

 private positionMetchingCheck(listenerCoord:CoordHead, sourceCoord:Coord):boolean {
   let D = this.listener2SingleSourceDistance(listenerCoord, sourceCoord)
   if (D < 180){
     return true
   } else {
     return false
   }
 }

private checkSculptureName(name:string, sculptures:Sculpture[]):boolean {
  let check = false;
  sculptures.forEach((s:Sculpture) => {
    if (name == s.scupture.name){
      check = true;
    }
  })
  return check
}

}
