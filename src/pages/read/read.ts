import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DetailDiaryPage } from '../detail-diary/detail-diary';

@Component({
  selector: 'page-contact',
  templateUrl: 'read.html'
})
export class ReadPage {

  private diary = [];

  constructor(public navCtrl: NavController,
    private sqlite: SQLite,
    private socialSharing: SocialSharing) {

  }

  ionViewDidLoad() {
    this.getAllDiary();
  }

  ionViewWillEnter() {
    this.getAllDiary();
  }

  getAllDiary() {
    this.sqlite.create({
      name: 'emotionDiary.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('select * from diary order by id desc', {})
        .then(res => {
          console.log(res);
          for (let i = 0; i < res.lenght; i++) {
            this.diary.push(res[i]);
          }
        }, (err) => { console.log(err); })
    }, (err) => { console.log(err); })
  }

  getDetailDiary(id) {
    this.navCtrl.push(DetailDiaryPage);
  }

}
