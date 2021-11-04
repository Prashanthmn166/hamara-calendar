import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { CalenderService } from './calender/calender.service';
import { Subscription } from 'rxjs';
import { Plugins, ShareOptions, StatusBarStyle } from '@capacitor/core';
import { AppConstants } from './constants/app.constants';


const { App , Share, StatusBar, LocalNotifications} = Plugins;

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit  {
	monthsInShort: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
	currentMothDisplayed: number = 0;
	currentMothDisplayedSubscription: Subscription;
	isSideNavOpen: boolean = false;
	currentYear = new Date().getFullYear();
	selectedYear: number;
	yearsToDisplay: number[] = [ 2021, 2022];
	langulageToSelection : string[] = [AppConstants.languageHindi, AppConstants.languageEnglish];
	customActionSheetLanguageOptions: any = {
		header: 'Select Language'
	  };
	  customActionSheetYearOptions: any = {
		header: 'Select Year'
	  };
	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		public calenderService: CalenderService
	) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {	
			this.splashScreen.hide();
			if(this.platform.is("android") ){
				StatusBar.setBackgroundColor({color:"#ffffff"});
				StatusBar.setStyle({style: StatusBarStyle.Light});
			};
		});
	}
	onMonthSelect(monthIndex: number) {
		this.currentMothDisplayed= monthIndex;
		this.calenderService.currentMonthAndYear.next(Number(this.selectedYear.toString()+("0"+Number(this.currentMothDisplayed+1)).slice(-2)));
	}
	async ngOnInit() {

		this.selectedYear=this.currentYear;
		this.currentMothDisplayedSubscription = this.calenderService.currentMonthAndYear.subscribe((currentMonth: number) => {
			if(currentMonth){
				this.selectedYear=Number(currentMonth.toString().slice(0,4));
				this.currentMothDisplayed = Number(Number(currentMonth.toString().slice(4,6))-1);
			};
		})
		App.addListener('backButton', () => {
			if (!this.isSideNavOpen && !this.calenderService.isDayViewOpen.value) {
				if (this.currentMothDisplayed != Number(new Date().getMonth()) || this.selectedYear != new Date().getFullYear()) {
					this.calenderService.currentMonthAndYear.next(Number(new Date().getFullYear()+("0"+Number(Number(new Date().getMonth())+1)).slice(-2)));
				} else if (this.currentMothDisplayed == new Date().getMonth()) {
					App.exitApp();
				}
			}
		});
		await LocalNotifications.requestPermission();
	}
	async ngAfterViewInit(){
		LocalNotifications.schedule({
			notifications: [
				{
					title: 'Hindi',
					body: 'This is today notification',
					id: 1
				}
			]
		})
	}
	onYearChange($event: any){
		this.selectedYear =$event.detail.value;
		setTimeout(()=>{
			this.calenderService.currentMonthAndYear.next(Number(this.selectedYear.toString()+("0"+Number(this.currentMothDisplayed+1)).slice(-2)));
		},0);
	}
	onLanguageChange($event: any){
		this.calenderService.selectedLanguage.next($event.detail.value);
		localStorage.setItem(AppConstants.languageKey,$event.detail.value);
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
			text: "Hindi Calendar 2021: हमारा कैलेंडर is a simple, pictorial, and informative Hindi calendar app.\n",
			title: "Share : Hindi Calendar 2021 हमारा कैलेंडर \n",
			dialogTitle: "Share : Hindi Calendar 2021 हमारा कैलेंडर  \n"
		}
		Share.share(options);
	}
}