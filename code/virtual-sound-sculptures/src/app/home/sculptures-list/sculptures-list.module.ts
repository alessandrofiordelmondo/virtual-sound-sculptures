import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SculpturesListPage } from './sculptures-list.page';
import { SculptureCardComponent } from '../sculpture-card/sculpture-card.component';

const routes: Routes = [
  {
    path: '',
    component: SculpturesListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SculpturesListPage, SculptureCardComponent]
})
export class SculpturesListPageModule {}