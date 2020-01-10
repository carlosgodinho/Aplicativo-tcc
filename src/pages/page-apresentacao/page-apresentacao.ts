import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PageInicialPage } from '../page-inicial/page-inicial';

/**
 * Generated class for the PageApresentacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-apresentacao',
  templateUrl: 'page-apresentacao.html',
})
export class PageApresentacaoPage {
  usuarioApresentacao: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.usuarioApresentacao = this.navParams.get('loginUsuario')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PageApresentacaoPage');
  }
  slides = [
    {
      title: "Viu um animal perdido?",
      description: "Texto ensinando o que fazer.",
      image: "assets/img/dogperdido.png",
      class: "dog"
    },
    {
      title: "Perdeu um animal?",
      description: "Texto ensinando o que fazer.",
        // image: "assets/img/ica-slidebox-img-2.png",
    }
  ];
  irPaginaInicial(){
    localStorage.setItem(this.usuarioApresentacao, 'true');
    this.navCtrl.setRoot(PageInicialPage)
  }
}
