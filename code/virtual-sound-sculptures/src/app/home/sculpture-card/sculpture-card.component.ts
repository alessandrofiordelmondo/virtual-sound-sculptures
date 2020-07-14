import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
  import { SculptureInterface } from 'src/app/interfaces';
  import { LoadingController } from '@ionic/angular';
  import { environment }from '../../../environments/environment'
  import mapboxgl from 'mapbox-gl';
  import { InteractiveMapService } from 'src/app/interactive-map.service';
  import { BackendService } from 'src/app/backend.service';

  @Component({
    selector: 'app-sculpture-card',
    templateUrl: './sculpture-card.component.html',
    styleUrls: ['./sculpture-card.component.scss'],
  })
  export class SculptureCardComponent implements OnInit {

    @Input() sculpture: SculptureInterface;
    @ViewChild('map', {static: false}) mapElementRef: ElementRef;
    
    constructor(
      private loadingCtrl: LoadingController,
      private interactiveMap: InteractiveMapService,
      private backend: BackendService
    ) { }

    address:string;
    place:string;

    ngOnInit() {
      this.loadingCtrl.create({
        message: 'loading...'
      }).then(loadEl => {
        loadEl.present()
        let center = this.interactiveMap.getCentroid(this.sculpture.coords)
        const mapEl = this.mapElementRef.nativeElement;
        mapboxgl.accessToken = environment.mapBoxToken;
        this.interactiveMap.createStaticMap(mapEl, center[1], center[0] , 15).then(() => {
          this.interactiveMap.highlightSingleArea(this.sculpture)
          this.backend.reverseGeocoding(center).subscribe((res:any) => {
            this.address = res.features[0].text;
            this.place = res.features[1].place_name;
            loadEl.dismiss()
          })
         
        })
      })


    }
    ionPopoverWillPresent(){}
      
  }
