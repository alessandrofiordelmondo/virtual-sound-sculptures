import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'settings', loadChildren: () => import('./home/settings/settings.module').then( m => m.SettingsPageModule)},
  { path: 'info', loadChildren: () => import('./home/info/info.module').then( m => m.InfoPageModule)},
  { path: 'sculptures-list', loadChildren: () => import('./home/sculptures-list/sculptures-list.module').then( m => m.SculpturesListPageModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
