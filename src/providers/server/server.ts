import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import 'rxjs/add/operator/map';

@Injectable()
export class ServerProvider {
  serverAddr: string = 'http://meonzzi.newslabfellows.com:9009/api/v1.0';

  constructor(public http: HttpClient,
    private platform: Platform) {
    console.log('Hello ServerProvider Provider');   
  }

  get(url) {
    return new Promise((resolve, reject) => {
      let serverUrl;

      if (this.platform.is('cordova')) serverUrl = this.serverAddr + url;
      else serverUrl = "http://meonzzi.newslabfellows.com:9009/api/v1.0/" + url;

      this.http.get(serverUrl)
        .subscribe((res: any) => {
          resolve(res);
        }, (err) => { reject(err) });
    })
  }

  post(url, body) {
    return new Promise((resolve, reject) => {
      let serverUrl;

      if (this.platform.is('cordova')) serverUrl = this.serverAddr + url;
      else serverUrl = "http://meonzzi.newslabfellows.com:9009/api/v1.0/" + url;

      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(serverUrl, body, { headers: headers })
        .subscribe((res: any) => {
          resolve(res);
        }, (err) => { reject(err) });
    })

  }
}
