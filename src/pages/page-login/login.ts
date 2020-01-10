import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, ToastController, LoadingController } from 'ionic-angular';
import { PageApresentacaoPage } from '../page-apresentacao/page-apresentacao';
import { PageInicialPage } from '../page-inicial/page-inicial';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Session } from '../../providers/session/session';
import { Usuario } from '../../modelos/usuarios';
import { PromiseObservable } from 'rxjs/observable/PromiseObservable';
import { timeout } from 'rxjs/operators';
import { ToastService } from '../../service/toastService';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public email;
  @ViewChild('email') emailUsuario;
  @ViewChild('senha') password;
  @ViewChild('usuario') usuario;
  @ViewChild('telefone') telefone;
  db = firebase.firestore();
  usuarioRetornado;
  loginVerificado = false;
  dadosDoUsuarioNoBanco: any;
  loading;

  constructor(public navCtrl: NavController,
    public toastService: ToastService, public session: Session,
    public firebaseauth: AngularFireAuth, public loadingCtrl: LoadingController) {
      this.loading = this.loadingCtrl.create({
        content: 'Realizando login...'
      });
  }

  async criaSessionUsuario(dado: any) {
    this.usuario = new Usuario(dado);
    //disparando a sessão
    this.session.createUsuario(this.usuario);
    console.log('await this.session.createUsuario(this.usuario);', this.usuario);

  }

  public LoginComEmail(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Realizando login...'
    });
    this.loading.present();
    this.firebaseauth.auth.signInWithEmailAndPassword(this.emailUsuario.value, this.password.value)
      .then(async () => {
        this.loginVerificado = true
        // this.exibirToast('Login efetuado com sucesso');
        this.pegaDadosUsuarioNoBanco();
      })
      .catch((erro: any) => {
        this.loading.dismiss();
        this.enviarToastErro(erro, this.emailUsuario.value, this.password.value);
      });
  }
  async irApresentacao() {

    if (localStorage.getItem(this.emailUsuario.value) != 'true') {
      console.log('this.dadosDoUsuarioNoBanco',this.dadosDoUsuarioNoBanco);
      
      if (this.emailUsuario.value == this.usuario.Email) {
        this.loading.dismiss();
        this.navCtrl.setRoot(PageApresentacaoPage, {
          loginUsuario: this.emailUsuario.value
        })
      }else{
        // criaSessionUsuario
      }
    } else {
      console.log('this.dadosDoUsuarioNoBanco',this.dadosDoUsuarioNoBanco);
      if (this.emailUsuario.value == this.usuario.Email) {
        this.loading.dismiss();
        this.navCtrl.setRoot(PageInicialPage)

      }
    }
  }
  private pegaDadosUsuarioNoBanco() {
    this.dadosDoUsuarioNoBanco = undefined;
    return new Promise(async (res) =>{
    var docRef = await this.db.collection("Banco de usuários").doc(this.emailUsuario.value);
    docRef.get().then((doc) => {
      if (doc.exists) {
        this.dadosDoUsuarioNoBanco = doc.data();
        
        this.criaSessionUsuario(this.dadosDoUsuarioNoBanco).then((res) =>{
          this.irApresentacao();
        })
      }
      else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
    res();
    })
  }

  private enviarToastErro(erro, email, senha) {
    if (erro.code == "auth/invalid-email" && email.value == "") {
      this.toastService.exibirToast("O email está em branco. Insira seu email");
    }
    else if (erro.code == "auth/invalid-email") {
      this.toastService.exibirToast("Email inválido. Insira um email válido.");
    }
    else if (erro.code == "auth/user-not-found") {
      this.toastService.exibirToast("Email não cadastrado.");
    }
    else if (erro.code == 'auth/wrong-password' && senha == "") {
      this.toastService.exibirToast("Senha em branco. Insira sua senha.");
    }
    else if (erro.code == 'auth/wrong-password') {
      this.toastService.exibirToast("Senha inválida.");
    }
  }

  

}
