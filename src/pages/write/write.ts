import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ServerProvider } from '../../providers/server/server';

@Component({
  selector: 'page-about',
  templateUrl: 'write.html'
})
export class WritePage {

  base64Image: any;
  imageURI: any;
  imageFileName: any;
  serverIP: string = "http://meonzzi.newslabfellows.com:9009";
  nowDate: string;

  constructor(public navCtrl: NavController,
    private transfer: FileTransfer,
    private file: File,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private serverProvider: ServerProvider) { }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      // this.imageURI = imageData;
      this.nowDate = Date.now().toString();
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
        fileName: 'picture.jpg',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
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
    //TODO: imageURL 정확히 알아내기
    fileTransfer.download(this.serverIP + this.imageURI, this.file.dataDirectory + this.nowDate + '.jpg')
      .then((entry) => {
        console.log(entry);
        console.log(entry.toURL());
        
        this.presentToast("Image download successful");
        this.imageFileName = entry.toURL();
        // this.fetchEmotion();
      }, (err) => {
        console.log(err);
        this.presentToast(err);
      });
  }

  fetchEmotion() {
    this.serverProvider
      .get(this.imageURI)
      .then((res: any) => {
        //TODO: Provider로 emotion JSON data 전달
        return new Promise((res, rej) => {

        })

      }, (err) => {
        console.log(err)
      });
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
