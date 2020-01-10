import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageChatPage } from './page-chat';

@NgModule({
  declarations: [
    PageChatPage,
  ],
  imports: [
    IonicPageModule.forChild(PageChatPage),
  ],
})
export class PageChatPageModule {}
