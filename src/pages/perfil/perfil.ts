import { Camera } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, normalizeURL } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private _camera: Camera) {
  }

  tiraFoto(){ //método para tirar foto
    this._camera.getPicture({ //acessando a camera 
      destinationType: this._camera.DestinationType.FILE_URI, //destinationType precisa ser
      //passado a maneira como irá acessar nesse caso através da uri ou seja o path do dispositivo
      saveToPhotoAlbum: true, //salva no album do dispositivo
      correctOrientation: true //para a imagem não ficar invertido
    })
    .then(fotoUri => { //retorna a uri da foto
      fotoUri = normalizeURL(fotoUri); //normaliza a uri para qualquer plataforma
    })
    .catch(err => console.log(err)); //pega o erro e exibe no console
  }




}
