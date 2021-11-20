import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { CalenderService } from './calender/calender.service';
import { Subscription } from 'rxjs';
import { Plugins, ShareOptions, StatusBarStyle } from '@capacitor/core';
import { AppConstants } from './constants/app.constants';
import { NotificationModel } from './models/notification.interface';

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
	appConstants=AppConstants;
	isLocalNotificationEnabled: boolean;
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
		// While loading the app for the first time enable local notificatio
		(localStorage.getItem(this.appConstants.isLocalNotificationAdded)==null) ?? localStorage.setItem(this.appConstants.isLocalNotificationAdded, "true");
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
		this.isLocalNotificationEnabled = (localStorage.getItem(this.appConstants.isLocalNotificationAdded)=="true") ? true : false;
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
		if(!localStorage.getItem(AppConstants.isLocalNotificationAdded) && localStorage.getItem(this.appConstants.isLocalNotificationAdded)=="true")
			this.createNotification();
	}
	createNotification(){
		let currentDate: any= new Date();
		let nextYearEnd: any = new Date('12/31/2022');
		const noOfDays = Math.ceil(Math.abs(nextYearEnd - currentDate)/(1000 * 60 * 60 * 24))+1;
		const notificationDetails = this.getNotificationDetailsForNext(noOfDays);
		LocalNotifications.schedule({
			notifications: notificationDetails
		});
		localStorage.setItem(AppConstants.isLocalNotificationAdded, "true"); 
	}
	onNotificationChange(notificationChange: CustomEvent){
		localStorage.setItem(this.appConstants.isLocalNotificationAdded,notificationChange.detail.checked);
		if(notificationChange.detail.checked==false){
			LocalNotifications.getPending().then((pendidingList)=>{
				LocalNotifications.cancel(pendidingList);
			})
			localStorage.setItem(AppConstants.isLocalNotificationAdded, ""); 
		}else{
			this.createNotification();
		}
	}
	getNotificationDetailsForNext(noOfNextDays: number): any[]{
		const notificationScheduleDetails = [];
		for(let i=0; i < noOfNextDays; i++){
			const currentDate = new Date();
			currentDate.setHours(9);
			currentDate.setMinutes(0);
			currentDate.setSeconds(0);
			currentDate.setDate(currentDate.getDate()+i);
			console.log(currentDate)
			const dateDetails = this.calenderService.getDateDetails(currentDate.toString());
			const notificationModel: NotificationModel={
				title: "जानिए आज का पंचांग",
				body: dateDetails.EVENT1 ?  dateDetails.EVENT1 : `राहुकाल : ${dateDetails.RAHUKALA}`,
				id: Number(i),
				schedule: {
					at: new Date(currentDate)
				}
			};
			notificationScheduleDetails.push(notificationModel);
		}
		return notificationScheduleDetails;
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