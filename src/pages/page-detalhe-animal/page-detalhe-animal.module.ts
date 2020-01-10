import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageDetalheAnimalPage } from './page-detalhe-animal';

@NgModule({
  declarations: [
    PageDetalheAnimalPage,
  ],
  imports: [
    IonicPageModule.forChild(PageDetalheAnimalPage),
  ],
})
export class PageDetalheAnimalPageModule {}
