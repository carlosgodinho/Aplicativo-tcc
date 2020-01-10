import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { PageInicialPage } from '../page-inicial/page-inicial';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { MetodosHelper } from '../../helper/metodosHelper';
import { Session } from '../../providers/session/session';
import { NativeGeocoderOptions, NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

/**
 * Generated class for the PageAnimalPerdidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-animal-perdido',
  templateUrl: 'page-animal-perdido.html',
})
export class PageAnimalPerdidoPage {
  public fotoTirada;
  db = firebase.firestore();
  raio: number = 20;
  public nomePet;
  public especie;
  public cor;
  public manchas;
  public porte;
  public usuarioNome;
  public usuarioEmail;
  docData: { DataDoCadastro: string; NomePet:any; NomeDoUsuario: any; EmailDoUsuario: any; Especie: any; Porte: any; Status: any; Cor: any; Manchas: any; NomeFoto: any; img:any; endereco: {rua:any; cidade:any; bairro:any;}};
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy:number;
  geoAddress: any;
  endereço: { cidade: any; rua: any; cep: any; bairro: any; };
  watchLocationUpdates:any; 
  loading:any;
  isWatching:boolean;
 
  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  constructor(public navCtrl: NavController, public camera: Camera, public navParams: NavParams,
    public alertCtrl: AlertController,public session: Session,
    private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder,
    private locationAccuracy: LocationAccuracy) {
  }
  async ionViewDidEnter(){
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
    this.getGeolocation();
  }

  salvarPostagem() {
    
      this.alertCtrl.create({
        title: 'Confirmar postagem?',
        buttons: [
          {
            text: 'SIM',
            handler: data => {
              this.dadosAnimalPerdidoCadastrar(this.nomePet, this.usuarioNome, this.usuarioEmail,this.especie, this.cor, this.manchas, this.porte)
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
  dadosAnimalPerdidoCadastrar(nomePet, nome, email, especie, cor, manchas,  porte) {
    
    this.docData = {
      DataDoCadastro: MetodosHelper.formataData(new Date()),
      NomePet: nomePet,
      NomeDoUsuario: nome,
      EmailDoUsuario: email,
      Especie: especie,
      Porte: porte,
      Status: 'Não Encontrado',
      Cor: cor,
      Manchas: manchas,
      NomeFoto: email + MetodosHelper.formataData(new Date()),
      img: "",
      endereco: {
        rua: this.endereço.rua,
        cidade: this.endereço.cidade,
        bairro: this.endereço.bairro
      }
    }
    this.db.collection("Banco de animais perdidos").doc(email+this.docData.DataDoCadastro).set(this.docData).then(function () {
      alert('Postagem feita com sucesso')
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
      this.endereço = {
        cidade: addressObj.subAdministrativeArea,
        rua: addressObj.thoroughfare,
        cep: addressObj.postalCode,
        bairro: addressObj.subLocality
        
      };
      console.log('endereço',addressObj);
      
    return this.endereço;
  }

}
