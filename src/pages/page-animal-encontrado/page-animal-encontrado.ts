import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PageInicialPage } from '../page-inicial/page-inicial';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { NgModel } from '@angular/forms';
import { Session } from '../../providers/session/session';
import { MetodosHelper } from '../../helper/metodosHelper';
import { storage } from 'firebase';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { ProcurarCombinacaoService } from '../../service/procurar-combinacao'

/**
 * Generated class for the PageAnimalEncontradoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-animal-encontrado',
  templateUrl: 'page-animal-encontrado.html',
})
export class PageAnimalEncontradoPage {
  public fotoTirada;
  db = firebase.firestore();
  public especie;
  public cor;
  public manchas;
  public porte;
  public usuarioNome;
  public usuarioEmail;
  public result;
  public image;
  imgUrl: any;
  docData: { DataDoCadastro: string; NomeDoUsuario: any; EmailDoUsuario: any; Especie: any; Porte: any; Cor: any; Manchas: any; NomeFoto: any; img:any; endereco: {rua:any; cidade:any; bairro:any;}};
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy:number;
  geoAddress: any;
 
  watchLocationUpdates:any; 
  loading:any;
  isWatching:boolean;
 
  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  endereco: { cidade: any; rua: any; cep: any; bairro: any; };
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public camera: Camera, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder,
    public alertCtrl: AlertController, public session: Session,
    public combinacaoService: ProcurarCombinacaoService,
    private locationAccuracy: LocationAccuracy) {
    this.fotoTirada = this.navParams.get('fototirada');
  }
  async ionViewDidEnter() {
    
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error => console.log('Error requesting location permissions', error)
        );
      }
    });
    var usuario = await this.session.getUsuario();
    this.usuarioNome = usuario.Nome;
    this.usuarioEmail = usuario.Email;
    this.getGeolocation()
  }

  salvarPostagem() {
    if (this.fotoTirada == undefined) {
      this.alertCtrl.create({
        title: 'Nenhuma foto tirada',
        subTitle: 'Gostaria de adicionar uma foto à postagem?',
        buttons: [
          {
            text: 'SIM',
            handler: data => {
              this.onTakePicture()
            }
          },
          {
            text: 'NÃO',
            handler: data => {
              this.alertCtrl.create({
                title: 'Confirmar postagem?',
                buttons: [
                  {
                    text: 'SIM',
                    handler: data => {
                      this.dadosAnimalEncontradoCadastrar(this.usuarioNome, this.usuarioEmail, this.especie, this.cor, this.manchas, this.porte)
                      this.navCtrl.setRoot(PageInicialPage)
                    }
                  },
                  {
                    text: 'NÃO',
                    handler: data => {

                    }
                  },
                ]
              }).present();
            }
          },
        ]
      }).present();

    } else {
      this.alertCtrl.create({
        title: 'Confirmar postagem?',
        buttons: [
          {
            text: 'SIM',
            handler: data => {
              this.dadosAnimalEncontradoCadastrar(this.usuarioNome, this.usuarioEmail, this.especie, this.cor, this.manchas, this.porte)
              this.alertCtrl.create({
                title: 'Obrigado por colaborar!',
                subTitle: 'Agradecemos sua colaboração, esperamos que esse animal seja encontrado.',
                buttons: [
                  {
                    text: 'OK'
                  }
                  ]
                  }).present()
              this.navCtrl.pop();
            }
          },
          {
            text: 'NÃO',
            handler: data => {

            }
          },
        ]
      }).present();
    }
  }
  async onTakePicture() {
    try {
      const options: CameraOptions = {
        quality: 50,
        targetHeight: 1200,
        targetWidth: 1200,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }

      this.result = await this.camera.getPicture(options);
      this.image = `data:image/jpeg;base64,${this.result}`;
      this.visualizarFotoTirada();
      
    }
    catch (e) {
      console.log(e);

    }
  }
  dadosAnimalEncontradoCadastrar(nome, email, especie, cor, manchas, porte) {

    this.docData = {
      DataDoCadastro: MetodosHelper.formataData(new Date()),
      NomeDoUsuario: nome,
      EmailDoUsuario: email,
      Especie: especie,
      Porte: porte,
      Cor: cor,
      Manchas: manchas,
      NomeFoto: email + MetodosHelper.formataData(new Date()),
      img: "",
      endereco: {
        rua: this.endereco.rua,
        cidade: this.endereco.cidade,
        bairro: this.endereco.bairro
      }
    }
    const pictures = storage().ref('fotosAnimaisEncontrados/' + this.docData.EmailDoUsuario + this.docData.DataDoCadastro);
    pictures.putString(this.image, 'data_url')
    this.db.collection("Banco de animais encontrados").doc(email+this.docData.DataDoCadastro).set(this.docData).then(function () {
      alert('Postagem feita com sucesso')
    });
    console.log('foi buscar combinação');
    this.combinacaoService.buscarCombinacaoPostagem(this.docData)
    console.log('fez a busca da combinação');
  }

  visualizarFotoTirada() {
    storage().ref('fotoexibicao/temporaria').putString(this.image, 'data_url').then((url) =>{
      storage().ref().child('fotoexibicao/temporaria').getDownloadURL().then((url) => {
        console.log("log1: " + url);
        this.fotoTirada = url;
        return url;
      });
    });
  }
  getGeolocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude; 
      this.geoAccuracy = resp.coords.accuracy; 
      this.getGeoencoder(this.geoLatitude,this.geoLongitude);
     }).catch((error) => {
       alert('Error getting location'+ JSON.stringify(error));
     });
  }

  //geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude,longitude){
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
    .then((result: NativeGeocoderReverseResult[]) => {
      this.geoAddress = this.generateAddress(result[0]);
    })
    .catch((error: any) => {
      alert('Error getting location'+ JSON.stringify(error));
    });
  }

  //Return Comma saperated address
  generateAddress(addressObj){
      this.endereco = {
        cidade: addressObj.subAdministrativeArea,
        rua: addressObj.thoroughfare,
        cep: addressObj.postalCode,
        bairro: addressObj.subLocality
        
      };
      console.log('endereço',addressObj);
      
    return this.endereco;
  }
}
