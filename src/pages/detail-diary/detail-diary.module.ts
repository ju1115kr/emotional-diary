import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailDiaryPage } from './detail-diary';

@NgModule({
  declarations: [
    DetailDiaryPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailDiaryPage),
  ],
})
export class DetailDiaryPageModule {}
