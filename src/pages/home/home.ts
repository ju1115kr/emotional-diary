import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DetailDiaryPage } from '../detail-diary/detail-diary';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  recent: {
    id: number;
    context: string;
    slicedcontext: string;
    filelocate: string;
    manualValue: number;
  }
  // emotion: any = { happiness: "", sorrow: "", anger: "", surprise: "" };
  average: number;

  constructor(public navCtrl: NavController,
    private sqlite: SQLite,
    private socialSharing: SocialSharing) { }


  ionViewDidLoad() {
    this.getData();
  }

  // ionViewWillEnter() {
  //   this.getData();
  // }

  getData() {
    this.sqlite.create({
      name: 'emotionDiary.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS diary(id integer primary key, \
        filelocate text, manualValue integer, happiness integer, sorrow integer, anger integer, surprise integer, \
        context text, datetime datetime)', {})
        .then(res => {
          console.log('Executed SQL: ' + res)
        }, (err) => { console.log(err); })

      db.executeSql('select *, avg(happiness) as happiness, avg(sorrow) as sorrow from diary order by id desc limit 1', {})
        .then(res => {
          console.log(res);
          this.recent.id = res.id;
          this.recent.filelocate = res.filelocate;
          this.recent.context = res.context;
          this.recent.slicedcontext = res.context.substring(0, 16);
          this.recent.manualValue = res.manualValue;

          this.average = parseInt(res.rows.item(0).happiness) / parseInt(res.rows.item(0).sorrow) * 100;
          this.fillCircle(this.average, document.getElementById('HomeCircle'));
        }, (err) => {
          this.average = 50;
          this.fillCircle(this.average, document.getElementById('HomeCircle'));
          console.log(err);
        })
    }, (err) => { console.log(err); })
  }

  fillCircle(value, canvas) {
    let radius = 12.8;
    let lineWidth = 3;
    let context = canvas.getContext('2d');

    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let startAngle = Math.PI * -0.5;
    let endAngle = startAngle + (value * (Math.PI * 2) / 100);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.arc(x, y, radius, 0, 0, false);
    context.beginPath();
    context.arc(x, y, radius, startAngle, endAngle, false);
    context.lineWidth = lineWidth;
    context.strokeStyle = "#B0A9B5";

    context.stroke();
  }

  getDetailDiary(id) {
    this.navCtrl.push(DetailDiaryPage, {
      id: id
    })
  }

  shareFacebook() {
    this.socialSharing.shareViaFacebook(this.recent.context, this.recent.filelocate, '')
      .then(() => {
      }, (err) => { console.log(err); })
  }
}
