import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-detail-diary',
  templateUrl: 'detail-diary.html',
})
export class DetailDiaryPage {

  imageFileName: string;
  rangeValue: number;
  emotion: any = { happiness: "", sorrow: "", anger: "", surprise: "" };
  context: string;
  datetime: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite) {
    this.getCurrentData(navParams.get("id"))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailDiaryPage');
  }

  getCurrentData(id) {
    this.sqlite.create({
      name: 'emotionDiary.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('select * from diary where id=?', [id])
        .then(res => {
          if (res.rows.lenght != 0) {
            this.imageFileName = res.rows.item(0).filelocate;
            this.rangeValue = res.rows.item(0).manualValue;
            this.emotion.happiness = res.rows.item(0).happiness;
            this.emotion.sorrow = res.rows.item(0).sorrow;
            this.emotion.surprise = res.rows.item(0).surprise;
            this.emotion.anger = res.rows.item(0).anger;
            this.context = res.rows.item(0).context;
            this.datetime = this.formatDate(res.rows.item(0).datetime);
          }
        }, (err) => {
          console.log(err);
        })
    }, (err) => {
      console.log(err);
    })
  }

  formatDate(date) {
    let d = new Date(date + 60000 * 60 * 9);
    let localDate = d.toLocaleString('ko-KR');

    return localDate;
  }

}
