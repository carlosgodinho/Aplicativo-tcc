import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, Events, AlertController } from 'ionic-angular';
import { PageAnimalEncontradoPage } from '../page-animal-encontrado/page-animal-encontrado';
import { PageAnimalPerdidoPage } from '../page-animal-perdido/page-animal-perdido';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the PageEscolhaPostagemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-escolha-postagem',
  templateUrl: 'page-escolha-postagem.html',
})
export class PageEscolhaPostagemPage {

  constructor( public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public events: Events,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public camera: Camera
  ) {}
 
  

  
  onTakePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.navCtrl.push(PageAnimalEncontradoPage,{
       fototirada: imageData
     })
    }, (err) => {
     // Handle error
    });
  }

  teste(teste){
    if(teste == 'encontrou'){
      this.navCtrl.push(PageAnimalEncontradoPage)
      
    } else {
      this.navCtrl.push(PageAnimalPerdidoPage)
    }
  }

  
    

  dismiss() {
    this.events.publish('tirarBlur');
    this.viewCtrl.dismiss();
  }
}