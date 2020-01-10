import { Injectable } from "@angular/core";
import { ToastController } from "ionic-angular";

@Injectable()
export class ToastService {
    constructor(public toastCtrl: ToastController) {
    }
    public exibirToast(mensagem: string): void {
        let toast = this.toastCtrl.create({
            duration: 3000,
            position: 'botton'
        });
        toast.setMessage(mensagem);
        toast.present();
    }
}