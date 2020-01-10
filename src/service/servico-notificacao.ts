import { Injectable } from "@angular/core";
import * as firebase from 'firebase';
import 'firebase/firestore';
import { OneSignal } from "@ionic-native/onesignal";
import { Session } from "../providers/session/session";

@Injectable()
export class NotificacaoService {
    db = firebase.firestore();
    docData: any;
    constructor(public oneSignal: OneSignal, public session: Session) { }
    notificarUsuarioNotificado(emailUsuario, retornoDaBusca) {

        console.log('emailUsuario', emailUsuario);

        if (retornoDaBusca != undefined && retornoDaBusca.length > 0) {
            this.db.collection("banco de id-notificacoes")
                .where("emailUsuario", "==", emailUsuario).get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log('Encontrou', doc.data());
                        var msg = {
                            contents: {
                                en: "Clique para ver mais detalhes."
                            },
                            headings: {
                                en: "Animal semelhante encontrado"
                            },
                            include_player_ids: [doc.data().idDispositivoUsuario]
                        };
                        this.oneSignal.postNotification(msg).then(teste => {
                            console.log('sucesso', doc.data().idDispositivoUsuario);

                        }).catch(erro => {
                            console.log('erro', erro);

                        })
                    });
                });


        }
    }
    notificarUsuarioPostador(dadosChat) {
        var msg = {
            contents: {
                en: "Clique para ver mais detalhes."
            },
            headings: {
                en: "Contato de chat"
            },
            include_player_ids: [dadosChat.idDispositivoUsuarioCriadorPostagem]
        };
        this.oneSignal.postNotification(msg).then(teste => {
            console.log('sucesso', dadosChat.idDispositivoUsuarioCriadorPostagem);

        }).catch(erro => {
            console.log('erro', erro);

        })


}
}