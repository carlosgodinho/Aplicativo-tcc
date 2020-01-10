import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import * as firebase from 'Firebase';
/**
 * Generated class for the PageChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-chat',
  templateUrl: 'page-chat.html',
})
export class PageChatPage {
  @ViewChild(Content) content: Content;
  data = { type: '', nickname: '', mensagem: '' };
  chats = [];
  key: string;
  nickname: string;
  offStatus: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.key = this.navParams.get("key") as string;
    this.nickname = this.navParams.get("nickname") as string;
    this.data.type = 'mensagem';
    this.data.nickname = this.nickname;

    let joinData = firebase.database().ref('salas/' + this.key + '/chats').push();
    joinData.set({
      type: 'join',
      user: this.nickname,
      mensagem: this.nickname + ' entrou no chat',
      sendDate: Date()
    });
    this.data.mensagem = '';

    firebase.database().ref('salas/' + this.key + '/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      setTimeout(() => {
        if (this.offStatus === false) {
          this.content.scrollToBottom(300);
        }
      }, 1000);
    });
  }
  enviarMensagem() {
    let newData = firebase.database().ref('salas/'+this.key+'/chats').push();
    newData.set({
      type:this.data.type,
      user:this.data.nickname,
      mensagem:this.data.mensagem,
      sendDate:Date()
    });
    this.data.mensagem = '';
  }
  sair() {
    let exitData = firebase.database().ref('salas/' + this.key + '/chats').push();
    exitData.set({
      type:'sair',
      user:this.nickname,
      mensagem: this.nickname + ' saiu do chat',
      sendDate:Date()
    });
   console.log('objeto exitdata',this.chats);
   
    this.offStatus = true;
   
    // this.navCtrl.setRoot(SalaPage, {
    //   nickname:this.nickname
    // });
  }

}
export const snapshotToArray = snapshot => {
  let returnArr = [];
 
  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });
 
  return returnArr;
};  
