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

  private diaries = [];

  constructor(public navCtrl: NavController,
    private sqlite: SQLite,
    private socialSharing: SocialSharing) { }

  ionViewDidLoad() {
    this.getAllDiary();
  }

  // ionViewWillEnter() {
  //   this.getAllDiary();
  // }

  getAllDiary() {
    this.sqlite.create({
      name: 'emotionDiary.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('select * from diary order by id desc', {})
        .then(res => {
          console.log(res.rows.length);
          console.log(res.rows);
          
          this.diaries = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.diaries.push({
              id: res.rows.item(i).id,
              filelocate: res.rows.item(i).filelocate, manualValue: res.rows.item(i).manualValue,
              happiness: res.rows.item(i).happiness, sorrow: res.rows.item(i).sorrow,
              anger: res.rows.item(i).anger, surprise: res.rows.item(i).surprise,
              context: res.rows.item(i).context, datetime: res.rows.item(i).datetime
            });
          }
          console.log(this.diaries);
          
        }, (err) => { console.log(err); })
    }, (err) => { console.log(err); })
  }

  getDetailDiary(id) {
    this.navCtrl.push(DetailDiaryPage, {
      id: id
    });
  }

}
