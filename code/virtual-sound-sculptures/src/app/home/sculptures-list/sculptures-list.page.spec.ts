import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BackendService } from 'src/app/backend.service';
import { SculptureInterface } from 'src/app/interfaces';
import { PopoverController } from '@ionic/angular';
import { SculptureCardComponent } from '../sculpture-card/sculpture-card.component'

@Component({
  selector: 'app-sculptures-list',
  templateUrl: './sculptures-list.page.html',
  styleUrls: ['./sculptures-list.page.scss'],
})
export class SculpturesListPage implements OnInit {

  sculptureSub: Subscription;
  sculptureData: SculptureInterface[];

  constructor(
    private backend: BackendService,
    private popup: PopoverController
  ) { }

  ngOnInit() {
    this.sculptureSub = this.backend.sculpture.subscribe(s => {
      this.sculptureData = s;
    })
  }

  showCard(s){
    this.popup.create({
      component: SculptureCardComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'sculpture': s,
      }
    }).then(pu => {
      pu.present()
    })
  }

}
