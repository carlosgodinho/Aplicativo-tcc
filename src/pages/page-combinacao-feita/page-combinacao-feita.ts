import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as $ from "jquery";
import * as firebase from 'firebase';
import 'firebase/firestore';
import { storage } from 'firebase';
import { PageChatPage } from '../page-chat/page-chat';
import { Session } from '../../providers/session/session';
import { NotificacaoService } from '../../service/servico-notificacao';
/**
 * Generated class for the PageCombinacaoFeitaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-combinacao-feita',
  templateUrl: 'page-combinacao-feita.html',
})
export class PageCombinacaoFeitaPage {
  db = firebase.firestore();
  public segment: any[] = [];
  public salaChat;
  public dadosChat;
  public usuario;
  public ref = firebase.database().ref('salas/');
  constructor(public navCtrl: NavController, public navParams: NavParams, public session: Session,
    public loadingCtrl: LoadingController, public notificacaoService: NotificacaoService) {

    this.dadosChat = navParams.get('dadosChat')
    this.salaChat = navParams.get('chaveChat');
  }

  async ionViewDidEnter() {

    this.usuario = await this.session.getUsuario();
    const loader = this.loadingCtrl.create({
      content: "Carregando publicação... ",
      duration: 1500
    });
    loader.present();
    this.db.collection("Banco de animais encontrados").orderBy("DataDoCadastro", "desc").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        this.segment.push(doc.data())
        console.log('this.segment', this.segment);

        this.buscarFotos();
        console.log(doc.id, " => ", doc.data());
      });
    });
  }
  buscarFotos() {
    for (let i = 0; i < this.segment.length; i++) {
      storage().ref().child('fotosAnimaisEncontrados/' + this.segment[i].NomeFoto).getDownloadURL().then((url) => {
        console.log("log1: " + url);
        this.segment[i].img = url;
      }).catch(e =>
        console.log(e)

      )
    };
  }

  abrirChat() {
    this.notificacaoService.notificarUsuarioPostador(this.dadosChat)
    this.navCtrl.setRoot(PageChatPage, {
      key: this.salaChat,
      nickname: this.usuario.Nome
    });
  }
}
