import { Component} from '@angular/core';
import { Plugins, AppState } from '@capacitor/core'
import { Sculpture } from '../sculpture/sculpture';
import { SculptureInterface } from '../interfaces'
import { MotionTrackingService } from '../motion-tracking.service';
import { Subscription } from 'rxjs';
import { InteractiveMapService } from '../interactive-map.service';
import { LoadingController } from '@ionic/angular';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { SculptureService } from '../sculpture.service';

declare var AudioContext;
const { App } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage{
  isLoaded:boolean = false;
  isStarted:boolean = false;
  isActive:boolean = false;
  isBlocked:boolean = false;
  constructor(
    private motionTracking: MotionTrackingService,
    public interactiveMap: InteractiveMapService,
    private loadingCtrl: LoadingController,
    private insomnia: Insomnia,
    private sculpture: SculptureService
  ) {
  }
  ionViewDidEnter(){
    App.addListener('appStateChange', (state: AppState) => {
      if( state.isActive && this.isBlocked ){ 
        this.start();
        this.isBlocked = false;
      } else if (!state.isActive && this.isStarted){
        this.stop();
        this.isBlocked = true;
      }
    })
    this.loadingCtrl.create({
      message: "loading data..."
    }).then(loadEl => {
      loadEl.present()
      this.sculpture.loadSculpture().then(() => {
        this.isLoaded = true;
        loadEl.dismiss() 
      })
    })
  }
  start(){
    this.isStarted = true;
    this.motionTracking.start()
    this.insomnia.keepAwake()
  }
  stop(){
    this.isStarted = false;
    this.motionTracking.stop();
    this.sculpture.sculptures.forEach((s:Sculpture) => {
      if(s != undefined){
        s.stop()
      }
    })
    this.insomnia.allowSleepAgain()
  }
}

