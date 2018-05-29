import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, normalizeURL } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ServerProvider } from '../../providers/server/server';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  selector: 'page-about',
  templateUrl: 'write.html'
})
export class WritePage {

  imageURI: string;
  imageFileName: string;
  serverIP: string = "http://meonzzi.newslabfellows.com:9009";
  nowDate: string;
  rangeValue: number = 5;
  emotion: any = { happiness: "", sorrow: "", anger: "", surprise: "" };
  placeholder: string = "오늘의 감정을 적어주세요";
  context: string;

  constructor(public navCtrl: NavController,
    private transfer: FileTransfer,
    private file: File,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private serverProvider: ServerProvider,
    private sqlite: SQLite) { }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.uploadFile(imageData);
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  uploadFile(imageData) {
    return new Promise((resolve, reject) => {
      let loader = this.loadingCtrl.create({
        content: "Uploading..."
      });
      loader.present();
      const fileTransfer: FileTransferObject = this.transfer.create();

      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: 'picture.png',
        chunkedMode: false,
        mimeType: "image/png",
      }
      let serverAPI = "/api/v1.0/file";

      fileTransfer.upload(imageData, this.serverIP + serverAPI, options)
        .then((data) => {
          console.log(data);
          this.imageURI = data.response;
          loader.dismiss();
          this.presentToast("Image uploaded successfully");
          this.downloadFile();
          resolve();
        }, (err) => {
          console.log(err);
          loader.dismiss();
          this.presentToast(err);
          reject(err);
        });
    });

  }

  downloadFile() {
    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.download(this.serverIP + this.imageURI, this.file.dataDirectory + Date.now().toString() + '.jpg', true)
      .then((entry) => {
        this.presentToast("Image download successful");
        this.imageFileName = entry.toURL();
        this.fetchEmotion();
      }, (err) => {
        console.log(err);
        this.presentToast(err);
      });
  }

  fetchEmotion() {
    let emotionURL = '/api/v1.0/emotion' + this.imageURI.substring(14, );

    this.serverProvider
      .get(emotionURL)
      .then((res: any) => {
        console.log(res);
        this.emotion.happiness = res.happiness.replace("%", "");
        this.emotion.sorrow = res.sorrow.replace("%", "");
        this.emotion.anger = res.anger.replace("%", "");
        this.emotion.surprise = res.surprise.replace("%", "");
      }, (err) => {
        console.log(err);
        if (err.status == "400") {
          this.emotion.happiness = "0";
          this.emotion.sorrow = "0";
          this.emotion.anger = "0";
          this.emotion.surprise = "0";
        }
      });

  }

  saveDiary() {
    this.nowDate = Date.now().toString();
    this.sqlite.create({
      name: 'emotionDiary.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('insert into diary values(null, ?, ?, ?, ?, ?, ?, ?, ?)',
        [this.imageFileName, this.rangeValue,
        this.emotion.happiness, this.emotion.sorrow,
        this.emotion.anger, this.emotion.surprise,
        this.context, this.nowDate])
        .then(res => {
          console.log(res);
          this.presentToast("Diary saved successful");
        }, (err) => {
          console.log(err);
          this.presentToast(err);
        })
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    })
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 6000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
