import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CalenderService } from './calender/calender.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
	monthsInShort: string[]=['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
	currentMothDisplayed: number=0;
	currentMothDisplayedSubscription: Subscription;
	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private calenderService: CalenderService
	) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}
	onMonthSelect(monthIndex: number){
		this.calenderService.currentMonth.next(monthIndex);
	}
	ngOnInit() {
		this.currentMothDisplayedSubscription=this.calenderService.currentMonth.subscribe((currentMonth)=>{
			this.currentMothDisplayed=currentMonth;
		})
	}
	ngOnDestroy(){
		this.currentMothDisplayedSubscription.unsubscribe();
	}
}
