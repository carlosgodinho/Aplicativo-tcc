import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/usuarios';
import { Storage } from '@ionic/storage'

/*
  Generated class for the SessionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const CHAVE ='avatar-usuario';

@Injectable()
export class Session {

  public isMenuPrincipal:boolean = false;

  constructor(public storage: Storage){ 

  }

  // setando uma seção e passando o tipo de usuário
  createUsuario(usuario: Usuario) {
    this.storage.set('usuario', usuario);
  }
  excluirSessionUsuario(){
    this.storage.remove('usuario')
  }
  createDadosMatch(dados) {
    this.storage.set('dadosMatch', dados);
  }
  getDadosMatch(): Promise<any> {
    return this.storage.get('dadosMatch');
  }
  getUsuario(): Promise<any> {
    return this.storage.get('usuario');
  }

  /*salvaAvatar(avatar) { // possível implementação futura
    localStorage.setItem(CHAVE, avatar);
  }*/

  obtemAvatar() {
    return localStorage.getItem(CHAVE) 
            ? localStorage.getItem(CHAVE)
            : 'assets/img/avatar-padrao.jpg';
  }
  

  // Quando deslogar deve remova do storage
  removeUsuario() {
    this.storage.remove('usuario');
  }

  removeClientes() {
    this.storage.remove('clientes');
  }

  /*exist() {
    this.get().then(res => {
        console.log('resultado >>> ', res);
        if(res) {
            console.log('resultado IF');
            return true;
        } else {
            console.log('resultado else');
            return false;
        }
    });
  }*/

}
