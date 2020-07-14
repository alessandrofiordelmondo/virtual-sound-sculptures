import { Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment }from '../../../environments/environment'
import { MotionTrackingService } from '../../motion-tracking.service';
import { LoadingController } from '@ionic/angular';
import { InteractiveMapService } from '../../interactive-map.service';

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.scss'],
})

export class MyMapComponent implements AfterViewInit {
  constructor(
    private loadingController: LoadingController,
    private motionTracking: MotionTrackingService,
    private interactiveMap: InteractiveMapService
  ) { }
  private pointerUrl:string = '../../assets/img/vss-icons/vss-point.svg'
  @ViewChild('map', {static: false}) mapElementRef: ElementRef;

  public zoom:number = 14;

  ngAfterViewInit(){
    this.loadingController.create({
      message: 'loading map...'
    }).then(loadEl => {
      loadEl.present()
      const mapEl = this.mapElementRef.nativeElement;
      let pointerEl = document.createElement('ion-icon');
      pointerEl.className = 'pointer';
      this.motionTracking.initializeGPS().then(data => {
        mapboxgl.accessToken = environment.mapBoxToken;
        this.interactiveMap.createMap(mapEl, data[0], data[1], this.zoom).then(() => {
          this.interactiveMap.map.getContainer().appendChild(pointerEl)
          pointerEl.setAttribute("src", this.pointerUrl);
          pointerEl.setAttribute("color", "secondary")
          pointerEl.style.backgroundSize = 40 +'px'
          pointerEl.style.width = 40 + 'px';
          pointerEl.style.height = 40 + 'px';
          
          this.interactiveMap.createPointer(pointerEl, data[0], data[1])
          this.interactiveMap.highlightArea()
          loadEl.dismiss()
        })
      })
    })
  }
}
