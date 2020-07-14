import { Injectable, NgZone } from '@angular/core';
import { Plugins, MotionEventResult } from '@capacitor/core';
import { InteractiveMapService } from './interactive-map.service';
import { CoordHead, DistBear } from './interfaces'
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { Subscription } from 'rxjs';
import { SculptureService } from './sculpture.service';

const{ Motion } = Plugins;
const{ Geolocation } = Plugins;
declare const Pedometer;

@Injectable({
  providedIn: 'root'
})
export class MotionTrackingService{
  private deg = 180 / Math.PI;
  private rad = Math.PI / 180;
  private R = 6371 * 1000 //Earth radious in m
  constructor(
    private zone: NgZone,
    private interactiveMap: InteractiveMapService,
    private deviceOrientation: DeviceOrientation,
    private sculpture: SculptureService
  ) {}
  private init:boolean = false;
  sr = 100; //Sample rate HZ
  pms = 1000 / this.sr; //period ms
  ps = 1 / this.sr // period in s
  private interval:any;
  //PEDOMETER variables
  private pedo = new Pedometer();
  private steps:number = 0;
  sensibility:number = 1/20;
  stepSize:number = 70;
  //SENSORS
  private accel = {x:NaN, y:NaN, z:NaN};
  //Heading subscruiption
  private heading: Subscription;
  //GPS Listener coordinate
  listenerCoord:CoordHead = {lat: null, lon: null, head: null};
  //GSP Source coordinate
  //sourceCoord:Coord[] = []; 
  //Listener to Source relation
  public L2S: DistBear[] = []

  watchHeading(){
    return this.deviceOrientation.watchHeading().subscribe(
      (data: DeviceOrientationCompassHeading) => 
      this.listenerCoord.head = data.trueHeading
    );
  }
  // ACCELEROMETER
  watchAccelerometer(){
    return Motion.addListener('accel', (data: MotionEventResult) => {
      this.zone.run(() => {
        this.accel.x = parseFloat(data.accelerationIncludingGravity.x.toFixed(4));
        this.accel.y = parseFloat(data.accelerationIncludingGravity.y.toFixed(4));
        this.accel.z = parseFloat(data.accelerationIncludingGravity.z.toFixed(4));
      });
    });
  }
   // GPS COORDINATES
   watchGPS(){
     return Geolocation.watchPosition({enableHighAccuracy:true}, (data, err) => {
       this.listenerCoord.lat = data.coords.latitude;
       this.listenerCoord.lon = data.coords.longitude;
     });
   }
   initializeGPS(){
     return Geolocation.getCurrentPosition().then(data => {
       return [data.coords.latitude, data.coords.longitude]
     })
   }
   // get step points in coordinate form
   updatePoint(){
    let lat1 = this.listenerCoord.lat * this.rad;
    let lon1 = this.listenerCoord.lon * this.rad;
    let h = this.listenerCoord.head * this.rad;
    let theta = this.stepSize * 0.01 / this.R; //angular dist
    let lat2 = Math.asin(Math.sin(lat1) * Math.cos(theta) + Math.cos(lat1) * Math.sin(theta) * Math.cos(h));
    let lon2 = lon1 + Math.atan2(Math.sin(h)*Math.sin(theta)*Math.cos(lat1), Math.cos(theta)-Math.sin(lat1)*Math.sin(lat2));
    this.listenerCoord.lat = lat2 * this.deg;
    this.listenerCoord.lon = lon2 * this.deg;
   }
   setSensibility(){
    this.pedo.sensibility = this.sensibility;
   }
   setStepSize(){
    this.pedo.sensibility = this.stepSize;
   }
   start(){
     this.heading = this.watchHeading()
     let accelerometerWatch = this.watchAccelerometer();
     let GPSWatch = this.watchGPS();
     this.pedo.createTable(Math.round(2 / this.ps));
     this.setSensibility();
     this.setStepSize();
     //loop 
     this.interval = setInterval(() => {
      if (this.listenerCoord.lat != null && 
        this.listenerCoord.lon != null &&
        this.listenerCoord.head != null &&
        Number.isFinite(this.listenerCoord.lat) && 
        Number.isFinite(this.listenerCoord.lon) &&
        Number.isFinite(this.listenerCoord.head)) {

          this.sculpture.generateSculpture(this.listenerCoord)
          this.sculpture.playSculpture(this.listenerCoord)

          this.interactiveMap.updateMap(this.listenerCoord.head, this.listenerCoord.lat, this.listenerCoord.lon)
          let norm = this.pedo.computeNorm(this.accel.x, this.accel.y, this.accel.z);
          this.pedo.acc_norm.push(norm);
          this.pedo.update();
          this.pedo.onStep(this.pedo.acc_norm);
          if(this.steps < this.pedo.countStep){
            this.updatePoint()
            this.steps = this.pedo.countStep

          }
      }
     }, this.pms)
  }
  stop(){
    clearInterval(this.interval)
    Motion.removeAllListeners()
    this.heading.unsubscribe()
  }
}