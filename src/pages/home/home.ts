import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../page-login/login';
import { SignupPage } from '../page-cadastro/signup';
import { OneSignal } from '@ionic-native/onesignal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public oneSignal : OneSignal) {

  }

  login() {
    this.navCtrl.push(LoginPage)
  }
  signup() {
    this.navCtrl.push(SignupPage)
  }
  teste() {
    this.oneSignal.getIds().then(test => {
      console.log('suahusa', test);
      var msg = {
        contents: {
          en: "Um animal que pode ser o seu foi encontrado. Quer ver mais detalhes?"
        },
        headings: {
          en: "Animal semelhante encontrado"
        },
        include_player_ids: [test.userId]
      };
      this.oneSignal.postNotification(msg).then(teste => {
        console.log('sucesso', test.userId);

      }).catch(erro => {
        console.log('erro', erro);

      })
    });

  }

}
