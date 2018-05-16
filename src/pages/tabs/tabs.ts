import { Component } from '@angular/core';

import { WritePage } from '../write/write';
import { ReadPage } from '../read/read';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = WritePage;
  tab3Root = ReadPage;

  constructor() {

  }
}
