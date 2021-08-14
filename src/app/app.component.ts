import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CalenderService } from './calender/calender.service';
import { Subscription } from 'rxjs';
import { Plugins, ShareOptions } from '@capacitor/core';

const { App , Share} = Plugins;

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
	monthsInShort: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
	currentMothDisplayed: number = 0;
	currentMothDisplayedSubscription: Subscription;
	isSideNavOpen: boolean = false;
	currentYear = new Date().getFullYear();
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
	onMonthSelect(monthIndex: number) {
		this.calenderService.currentMonth.next(monthIndex);
	}
	ngOnInit() {
		this.currentMothDisplayedSubscription = this.calenderService.currentMonth.subscribe((currentMonth) => {
			this.currentMothDisplayed = currentMonth;
		})
		App.addListener('backButton', () => {
			if (!this.isSideNavOpen && !this.calenderService.isDayViewOpen.value) {
				if (this.currentMothDisplayed != new Date().getMonth()) {
					this.calenderService.currentMonth.next(new Date().getMonth());
				} else if (this.currentMothDisplayed == new Date().getMonth()) {
					App.exitApp();
				}
			}
		});
	}
	onClose($event) {
		this.isSideNavOpen = false;
	}
	onOpen($event) {
		this.isSideNavOpen = true;
	}
	ngOnDestroy() {
		this.currentMothDisplayedSubscription.unsubscribe();
	}
	shareApp(){
		let options: ShareOptions ={
			url: 'https://play.google.com/store/apps/details?id=com.hinid.calender',
			text: "Hindi Calendar 2021: हमारा कैलेंडर is a simple, pictorial, and informative Hindi calendar app.",
			title: "Hindi Calendar 2021 : हमारा कैलेंडर",
			dialogTitle: "Hindi Calendar 2021 : हमारा कैलेंडर"
		}
		Share.share(options);
	}
}
