import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  recent: {
    id: number,
    context: string,
    slicedcontext: string,
    filelocate: string,
    manualValue: number,
    appHappiness: string,
    appSorrow: string,
    appSurprise: string,
    appAnger: string,
  }

  constructor(public navCtrl: NavController,
    private sqlite: SQLite,
    private socialSharing: SocialSharing) {
  }

  ionViewDidLoad() {
    this.getData();
    console.log(this.recent);
  }

  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    this.sqlite.create({
      name: 'emotionDiary.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('create table if not exists diary(id integer primary key, \
        filelocate text, manualValue int, appHappiness text, appSorrow text, appAnger text, appSurprise text, \
        context text, datetime datetime', {})
        .then(res => console.log('Executed SQL: ' + res))
        .catch(e => console.log(e));

      db.executeSql('select * from diary order by id desc limit 1', {})
        .then(res => {
          console.log(res);
          this.recent.filelocate = res.filelocate;
          this.recent.context = res.context;
          this.recent.slicedcontext = res.context.substring(0, 16);
          this.recent.manualValue = res.manualValue;
        })
        .catch(e => console.log(e));

    }).catch(e => console.log(e))
  }

  shareFacebook() {
    this.socialSharing.shareViaFacebook(this.recent.context, this.recent.filelocate, '')
      .then(() => { })
      .catch((e) => {
        console.log(e);
      });
  }
}
