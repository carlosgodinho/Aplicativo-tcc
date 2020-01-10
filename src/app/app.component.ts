import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Nav, IonicPage, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import * as firebase from 'firebase';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/page-login/login';
import { PageCombinacaoFeitaPage } from '../pages/page-combinacao-feita/page-combinacao-feita';
import { Session } from '../providers/session/session';
import { PageChatPage } from '../pages/page-chat/page-chat';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) public navCtrl: Nav;
  rootPage: any = HomePage;
  public usuario;
  db = firebase.firestore();
  dadosChat: any;

  constructor(platform: Platform, public oneSignal: OneSignal, statusBar: StatusBar,
    public alertCtrl: AlertController, splashScreen: SplashScreen, public session: Session) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    {
      platform.ready().then(async () => {


        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();

        //Aqui vocë coloca os dados que coletamos no passo 12 e 7
        this.oneSignal.startInit("bedeb72b-b3db-42d6-889b-811415104f11", "45354853737");
        //Aqui é caso vocë queria que o push apareça mesmo com o APP aberto
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
        // Aqui você vai tratar o recebimento do push notification com todos os dados
        this.oneSignal.handleNotificationOpened().subscribe(teste =>
          console.log('abriu', teste)
        );


        this.oneSignal.handleNotificationReceived().subscribe(async notificacao => {
          var usuario = await session.getUsuario();
          this.dadosChat;
          if (notificacao.payload.title == 'Animal semelhante encontrado') {
            this.db.collection("Banco matchs").doc(usuario.Email).get().then(res => {
              this.dadosChat = res.data();
              this.db.collection("Banco receber chat").doc(this.dadosChat.emailUsuarioCriadorPostagem).set(this.dadosChat).then(function () {
                alert('Postagem feita com sucesso')
              });
              this.alertUsuarioNotificado(this.dadosChat)

            }).catch(erro => {
              console.log('Não encontrou', erro);
            });
          }
          if (notificacao.payload.title == 'Contato de chat') {
            this.db.collection("Banco receber chat").doc(usuario.Email).get().then(res => {
              this.dadosChat = res.data();
              this.alertUsuarioPostador(this.dadosChat)

            }).catch(erro => {
              console.log('Não encontrou', erro);
            });
          }
        });

        this.oneSignal.endInit(); //finaliza a configuração
      });
    }
  }


  async goToLogin() {
    this.navCtrl.setRoot(LoginPage)
  }
  goToPerfil() {
    this.navCtrl.push('PerfilPage')
  }
  alertUsuarioNotificado(dadosChat) {
    this.alertCtrl.create({ //alert controler para obter mais funções do que um alert normal
      title: 'Animal semelhante encontrado',
      subTitle: 'Um animal que pode ser o seu foi encontrado. Quer ver mais detalhes?',
      buttons: [
        {
          text: 'sim',
          handler: () => { // faz algo quando o ok é clicado
            let ref = firebase.database().ref('salas/');
            let newData = ref.push();
            newData.set({
              nome: newData.key
            });
            dadosChat.chaveChat = newData.key;
            this.db.collection("Banco receber chat").doc(this.dadosChat.emailUsuarioCriadorPostagem)
            .update({chaveChat: dadosChat.chaveChat})
            this.navCtrl.push(PageCombinacaoFeitaPage, {
              chaveChat: newData.key,
              dadosChat: dadosChat

            })
          }
        },
        {
          text: 'não',
          handler: () => { // faz algo quando o ok é clicado
            this.alertCtrl.create({ //alert controler para obter mais funções do que um alert normal
              title: 'Notificação recusada',
              subTitle: 'Caso queira ver os detalhes desse animal e entrar em contato com a pessoa que o encontrou,'
                + ' abra o menu lateral e vá em notificações recebidas.',
              buttons: [
                {
                  text: 'ok'
                }
              ]
            }).present();
          }
        }
      ]
    }).present();
  }
  alertUsuarioPostador(dadosChat) {
    this.alertCtrl.create({ //alert controler para obter mais funções do que um alert normal
      title: 'Aceitar chat?',
      subTitle: 'O usuário ' + dadosChat.usuarioNotificado + ' gostaria de saber mais detalhes sobre o animal da sua postagem ' +
        'aceitar chat?',
      buttons: [
        {
          text: 'sim',
          handler: () => { // faz algo quando o ok é clicado
            this.navCtrl.push(PageChatPage, {
              key: dadosChat.chaveChat,
              nickname: dadosChat.usuarioCriadorPostagem
            })
          }
        },
        {
          text: 'não',
          handler: () => { // faz algo quando o ok é clicado
            this.alertCtrl.create({ //alert controler para obter mais funções do que um alert normal
              title: 'Chat recusado',
              subTitle: 'O usuário não entrará mais em contato com você.',
              buttons: [
                {
                  text: 'ok'
                }
              ]
            }).present();
          }
        }
      ]
    }).present();
  }

}

