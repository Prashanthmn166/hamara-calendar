import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CalenderService } from './calender/calender.service';
import { Subscription } from 'rxjs';
import { Plugins, ShareOptions } from '@capacitor/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

const { App , Share} = Plugins;

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
	providers: [SocialSharing],
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
		private calenderService: CalenderService,
		private socialSharing: SocialSharing
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
	shareApp() {
		// this.socialSharing.shareViaWhatsAppToReceiver
		this.socialSharing.shareViaWhatsAppToReceiver("Plz install our app","https://play-lh.googleusercontent.com/Pms4Y7lG2yUd9VQ-mYMuEnYIxN_cPPQGzQ8wANLBr8IiXaFefMOOnGSk7xnG7kM36Uk=s180-rw","https://play.google.com/store/apps/details?id=com.hinid.calender")
		.then((success) =>{
			alert("Success");
		})
		.catch(()=>{
			alert("Could not share information");
		});
		
	}
	shareApp2(){
		let options: ShareOptions ={
			url: 'https://play.google.com/store/apps/details?id=com.hinid.calender',
			text: "Use hamara calendar",
			title: "Awesom app",
			dialogTitle: "pretty cool",

		}
		Share.share(options);
	}
}
