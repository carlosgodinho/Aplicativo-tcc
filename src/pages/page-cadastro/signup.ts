import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  @ViewChild('email') email;
  @ViewChild('senha') password;
  @ViewChild('usuario') usuario;
  @ViewChild('telefone') telefone;
  db = firebase.firestore();

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public firebaseauth: AngularFireAuth) {
  }

  public cadastrarUsuario(): void {
    if(this.usuario.value == undefined || this.usuario.value == ''){
      this.exibirToast('Insira seu nome.')
    }else{
    this.firebaseauth.auth.createUserWithEmailAndPassword(this.email.value, this.password.value)
      .then(() => {
        this.exibirToast('Usuário criado com sucesso');
        this.dadosUsuarioCadastrar(this.email.value, this.usuario.value, this.telefone.value)
      })
      .catch((erro: any) => {
        this.enviarToastErro(erro, this.email.value, this.password.value);
      });
    }
  }
  private enviarToastErro(erro, email, senha) {
    if (erro.code == "auth/invalid-email" && email == "") {
      this.exibirToast("O email está em branco. Insira seu email");
    }
    else if (erro.code == "auth/invalid-email") {
      this.exibirToast("Email inválido. Insira um email válido.");
    }
    else if(erro.code == "auth/email-already-in-use") {
      this.exibirToast("Esse email já está em uso.");
    }
    else if (erro.code == 'auth/weak-password' && senha == "") {
      this.exibirToast("Senha em branco. Insira uma senha.");
    }
    else if (erro.code == 'auth/weak-password') {
      this.exibirToast("A senha precisa ter pelo menos 6 dígitos.");
    }
  }

  dadosUsuarioCadastrar(email, usuario, telefone) {
    
    var docData = {
      DataDoCadastro: Date(),
      Nome: usuario,
      Email: email,
      telefone: telefone
    }
    this.db.collection("Banco de usuários").doc(email).set(docData).then(function () {
      alert('Usuário ' + email + ' inserido com sucesso')
    });
  }
  public Sair(): void {
    this.firebaseauth.auth.signOut()
      .then(() => {
        this.exibirToast('Você saiu');
      })
      .catch((erro: any) => {
        this.exibirToast(erro);
      });
  }
  private exibirToast(mensagem: string): void {
    let toast = this.toastCtrl.create({
      duration: 3000,
      position: 'botton'
    });
    toast.setMessage(mensagem);
    toast.present();
  }
}
