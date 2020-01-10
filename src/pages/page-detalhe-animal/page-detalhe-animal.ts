import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PageDetalheAnimalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-detalhe-animal',
  templateUrl: 'page-detalhe-animal.html',
})
export class PageDetalheAnimalPage {
  public animalADetalhar;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.animalADetalhar = navParams.get('animalADetalhar');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PageDetalheAnimalPage');
  }

}
