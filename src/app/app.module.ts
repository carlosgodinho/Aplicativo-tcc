import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from  '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/page-login/login';
import { SignupPage } from '../pages/page-cadastro/signup';
import { PageApresentacaoPage } from '../pages/page-apresentacao/page-apresentacao';
import { PageInicialPage } from '../pages/page-inicial/page-inicial';
import { PageEscolhaPostagemPage } from '../pages/page-escolha-postagem/page-escolha-postagem';
import { PageAnimalEncontradoPage } from '../pages/page-animal-encontrado/page-animal-encontrado';
import { PageAnimalPerdidoPage } from '../pages/page-animal-perdido/page-animal-perdido';
import { Camera } from '@ionic-native/camera';
import { PageDetalheAnimalPage } from '../pages/page-detalhe-animal/page-detalhe-animal';
import { TesteImplementacoesPage } from '../pages/teste-implementacoes/teste-implementacoes';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Session } from '../providers/session/session';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { OneSignal } from '@ionic-native/onesignal';
import { PageCombinacaoFeitaPage } from '../pages/page-combinacao-feita/page-combinacao-feita';
import * as firebase from 'firebase';
import { PageChatPage } from '../pages/page-chat/page-chat';
import { ProcurarCombinacaoService } from '../service/procurar-combinacao'
import { NotificacaoService } from '../service/servico-notificacao'
import { ToastService } from '../service/toastService';
export const firebaseConfig = {
  apiKey: "AIzaSyBqHxSIvdkizU4JY1CrD9O_9l-eWMkKcb8",
  authDomain: "cade-meu-pet1.firebaseapp.com",
  databaseURL: "https://cade-meu-pet1.firebaseio.com",
  projectId: "cade-meu-pet1",
  storageBucket: "cade-meu-pet1.appspot.com",
  messagingSenderId: "45354853737",
};
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    PageEscolhaPostagemPage,
    PageApresentacaoPage,
    PageAnimalEncontradoPage,
    PageAnimalPerdidoPage,
    PageInicialPage,
    TesteImplementacoesPage,
    PageDetalheAnimalPage,
    PageCombinacaoFeitaPage,
    PageChatPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    PageEscolhaPostagemPage,
    PageAnimalEncontradoPage,
    PageAnimalPerdidoPage,
    PageApresentacaoPage,
    PageInicialPage,
    TesteImplementacoesPage,
    PageDetalheAnimalPage,
    PageCombinacaoFeitaPage,
    PageChatPage
  ],
  providers: [
    StatusBar,
    Geolocation,
    NativeGeocoder,,
    LocationAccuracy,
    SplashScreen,
    AndroidPermissions,
    Camera,
    ProcurarCombinacaoService,
    OneSignal,
    NotificacaoService,
    ToastService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Session
  ]
})
export class AppModule {}
