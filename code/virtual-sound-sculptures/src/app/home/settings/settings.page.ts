import { Component, OnInit } from '@angular/core';
import { MotionTrackingService } from '../../motion-tracking.service';

declare var head;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor( 
    private motionTracking: MotionTrackingService,
    ) { }
  sensibility:number;
  stepSize:number;
  motiontrackingview:boolean = false;
  headseizeview:boolean = false;
  latencyview:boolean = false;

  headcircumference:number;
  
  motiontrackingsettings(){
    this.motiontrackingview = !this.motiontrackingview
  }
  headSizeSetting(){
    this.headseizeview = !this.headseizeview
  }
  latencySettings(){
    this.latencyview = !this.latencyview
  }

  setSensibility(){
    this.motionTracking.sensibility = 1 / this.sensibility;
    this.motionTracking.setSensibility()
  }
  setStepSize(){
    this.motionTracking.stepSize = this.stepSize;
    this.motionTracking.setStepSize();
  }
  getSensibility(){
    this.sensibility = 1 / this.motionTracking.sensibility;
  }
  getStepSize(){
    this.stepSize = this.motionTracking.stepSize;
  }
  
  setHeadSize(){
    head = this.headcircumference / Math.PI;
  }

  getHeadSize(){
    this.headcircumference = Math.floor(head * Math.PI);
  }
  
  ngOnInit() {
    this.getSensibility();
    this.getStepSize();
    this.getHeadSize();
  }


}

