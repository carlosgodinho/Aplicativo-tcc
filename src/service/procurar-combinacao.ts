import { Injectable } from "@angular/core";
import * as firebase from 'firebase';
import 'firebase/firestore';
import { OneSignal } from "@ionic-native/onesignal";
import { Session } from "../providers/session/session";
import { NotificacaoService } from "./servico-notificacao";

@Injectable()
export class ProcurarCombinacaoService {
    db = firebase.firestore();
    docData: any;
    constructor(public oneSignal: OneSignal, public session: Session, 
        public notificacaoService: NotificacaoService) { }
    public retornoDaBusca: any[] = [];

    public buscarCombinacaoPostagem(dadosPostagemEncontrado) {
        this.db.collection("Banco de animais perdidos")
            .where("Cor", "==", dadosPostagemEncontrado.Cor)
            .where("Especie", "==", dadosPostagemEncontrado.Especie)
            .where("Porte", "==", dadosPostagemEncontrado.Porte)
            .get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log('Encontrou', doc.data());
                    this.retornoDaBusca.push(doc.data());
                    this.notificacaoService.notificarUsuarioNotificado(this.retornoDaBusca[0].EmailDoUsuario, this.retornoDaBusca)
                    this.gravarMatch(this.retornoDaBusca[0], dadosPostagemEncontrado)

                });
            }).catch(erro => {
                console.log('Não encontrou', erro);
            });


    }
    gravarMatch(usuarioNotificado, usuarioCriadorPostagem) {
        console.log('entrou no gravarMatch');

        console.log(usuarioCriadorPostagem);

        this.db.collection("banco de id-notificacoes").where("emailUsuario", "==", usuarioCriadorPostagem.EmailDoUsuario)
            .get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log('Banco de id-notificacoes', doc.data());

                    this.docData = {
                        usuarioNotificado: usuarioNotificado.NomeDoUsuario,
                        usuarioCriadorPostagem: usuarioCriadorPostagem.NomeDoUsuario,
                        emailUsuarioCriadorPostagem: usuarioCriadorPostagem.EmailDoUsuario,
                        idDispositivoUsuarioCriadorPostagem: doc.data().idDispositivoUsuario,
                        chaveChat: ''
                    }
                    this.db.collection("Banco matchs").doc(usuarioNotificado.EmailDoUsuario).set(this.docData).then(function () {
                        alert('Postagem feita com sucesso')
                      });
                    this.session.createDadosMatch(this.docData);
                });
            });
    }
    
}