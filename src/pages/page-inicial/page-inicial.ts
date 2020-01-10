import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, ModalController, ViewController, Events, AlertController } from 'ionic-angular';
import { PageEscolhaPostagemPage } from '../page-escolha-postagem/page-escolha-postagem';
import { PageDetalheAnimalPage } from '../page-detalhe-animal/page-detalhe-animal';
import { Session } from '../../providers/session/session';
import * as $ from "jquery";
import * as firebase from 'firebase';
import 'firebase/firestore';
import { storage } from 'firebase';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { OneSignal } from '@ionic-native/onesignal';
import { ToastService } from '../../service/toastService';

/**
 * Generated class for the PageInicialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-inicial',
  templateUrl: 'page-inicial.html',
})
export class PageInicialPage {
  pet: string = "encontrados";
  isAndroid: boolean = false;
  classTotal: string = 'action-sheets-basic-page';
  public segment: any[] = [];
  public arrayBusca: any[] = [];
  db = firebase.firestore();
  public segmentMeusPosts: any[] = [];
  usuario: any;

  constructor(public platform: Platform,
    public session: Session,
    public actionsheetCtrl: ActionSheetController, public modalCtrl: ModalController, public events: Events,
    public alertCtrl: AlertController, public toastService: ToastService,
    public androidPermissions: AndroidPermissions, public navCtrl: NavController, public oneSignal: OneSignal) {
    this.events.subscribe('tirarBlur', () => {
      this.classTotal = 'action-sheets-basic-page';
    });

    //   this.segmentTeste =  [
    //     {
    //       "img": "assets/img/thumbnail-puppy-1.jpg",
    //       "cidade": "Jacareí",
    //       "bairro": "Jardim Luiza",
    //       "rua": "Rua das Prímulas",
    //       "data": "11/07/2019",
    //       "horario": "13:57"
    //     },
    //  {
    //       "img": "assets/img/thumbnail-kitten-1.jpg",
    //       "cidade": "São josé dos campos",
    //       "bairro": "Vila Ema",
    //       "rua": "Jorge Barbosa Moreira",
    //       "data": "20/07/2019",
    //       "horario": "09:24"
    //     },
    //   {
    //       "img": "assets/img/thumbnail-kitten-2.jpg",
    //       "cidade": "Jacareí",
    //       "bairro": "Jardim São José",
    //       "rua": "Rua São Matheus",
    //       "data": "14/06/2019",
    //       "horario": "20:15"
    //     },
    //    {
    //       "img": "assets/img/thumbnail-puppy-4.jpg",
    //       "cidade": "São josé dos campos",
    //       "bairro": "Jardim Altos do Esplanada",
    //       "rua": "Rua Armando D'Oliveira Cobra",
    //       "data": "07/06/2019",
    //       "horario": "18:41"
    //     }
    //   ]

  }

  async ionViewDidEnter() {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
    this.usuario = await this.session.getUsuario();
    console.log('session ususario', this.usuario);
    this.atualizarIdNotificacao(this.usuario.Email);
    console.log(' + usuario.Nome);', this.usuario.Nome);
    $('#usuarioLogado').html('Usuário: ' + this.usuario.Nome);
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
  buscaAnimaisPostados() {
    this.segment = [];
    this.segmentMeusPosts = [];
    this.db.collection("Banco de animais perdidos").where("EmailDoUsuario", "==", this.usuario.Email)
      .orderBy("DataDoCadastro", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          this.segmentMeusPosts.push(doc.data())
          console.log('this.segment', this.segmentMeusPosts);

          this.buscarFotos();
          console.log(doc.id, " => ", doc.data());
        });
      });
  }
  alteraStatus(pet) {
    if(pet.Status == "Não encontrado"){
    this.alertCtrl.create({
      title: 'Gostaria de mudar o status desse animal para encontrado?',
      buttons: [
        {
          text: 'Sim',
          handler: data => {
            this.db.collection("Banco de animais perdidos").doc(pet.NomeFoto)
            .update({ Status: 'Encontrado' })
            this.buscaAnimaisPostados();
          }
        },
        {
          text: 'Não'
        }
      ]
    }).present()
    
  } else {
    this.alertCtrl.create({
      title: 'Gostaria de mudar o status desse animal para encontrado?',
      buttons: [
        {
          text: 'Sim',
          handler: data => {
            this.db.collection("Banco de animais perdidos").doc(pet.NomeFoto)
            .update({ Status: 'Encontrado' })
            this.buscaAnimaisPostados();
          }
        },
        {
          text: 'Não'
        }
      ]
    }).present()
  }
  }
  private atualizarIdNotificacao(EmailUsuario) {
    this.oneSignal.getIds().then(usuario => {
      var docData = {
        idDispositivoUsuario: usuario.userId,
        emailUsuario: EmailUsuario
      };
      this.db.collection("banco de id-notificacoes").doc(EmailUsuario).set(docData).then(function () {
        console.log('idDispositivoUsuario atualizado com sucesso');
      }).catch(erro => {
        console.log('Não foi possível atualizar o idDispositivoUsuario');
      });
    });
  }

  ionViewDidLeave() {
    this.segment = [];
    this.segmentMeusPosts = [];
  }
  buscarFotos() {
    for (let i = 0; i < this.segment.length; i++) {
      storage().ref().child('fotosAnimaisEncontrados/' + this.segment[i].NomeFoto).getDownloadURL().then((url) => {
        this.segment[i].img = url;
      }).catch(e =>
        console.log(e)

      )
    };

  }



  animalEncontrado(pets) {
    this.alertCtrl.create({
      title: 'Quer ver mais detalhes desse animal?',
      buttons: [
        {
          text: 'Sim',
          handler: data => {
            this.navCtrl.push(PageDetalheAnimalPage, {
              animalADetalhar: pets
            })

          }
        },
        {
          text: 'Não'
        }
      ]
    }).present()
  }

  adicionarPostagem(characterNum) {
    this.classTotal = 'action-sheets-basic-page blur-background';
    let modal = this.modalCtrl.create(PageEscolhaPostagemPage);
    modal.present();
  }

}


