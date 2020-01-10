import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageInicialPage } from './page-inicial';

@NgModule({
  declarations: [
    PageInicialPage,
  ],
  imports: [
    IonicPageModule.forChild(PageInicialPage),
  ],
})
export class PageInicialPageModule {}
