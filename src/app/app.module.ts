import { NgModule, ErrorHandler, sequence } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { WritePage } from '../pages/write/write';
import { ReadPage } from '../pages/read/read';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServerProvider } from '../providers/server/server';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DetailDiaryPageModule } from '../pages/detail-diary/detail-diary.module';

@NgModule({
  declarations: [
    MyApp,
    WritePage,
    ReadPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    DetailDiaryPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WritePage,
    ReadPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ServerProvider,
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    SQLite,
    SocialSharing,
  ]
})
export class AppModule { }
