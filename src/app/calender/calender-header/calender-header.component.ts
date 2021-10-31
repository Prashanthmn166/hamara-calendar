import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppConstants } from 'src/app/constants/app.constants';
import { CalenderService } from '../calender.service';

@Component({
	selector: 'app-calender-header',
	templateUrl: './calender-header.component.html',
	styleUrls: ['./calender-header.component.scss'],
})
export class CalenderHeaderComponent implements OnInit, OnDestroy {
	selectedMonthDetails : string[]= [];
	monthDetails : string[] =[];
	nativeLanguageMonthsWords: string[] =[];
	currentMonth: number;
	selectedYear: number;
	currentMonthSubscription: Subscription;
	currentMonthAndYearSubscription: Subscription;
	selectedLanguageSubscription : Subscription;
	publicHolidaysInCurrentYear: string[];
	currentMonthHolidayDetails: any[]=[];
	@ViewChild('headerSlides', {static: true}) slides: IonSlides;
	linearGradientOptions: string[] = [
		'transparent linear-gradient(287deg, #8A5CC4 0%, #FF0061 100%) 0% 0% no-repeat padding-box',
		'transparent linear-gradient(282deg, #FEC194 0%, #FF0061 100%) 0% 0% no-repeat padding-box',
		'transparent linear-gradient(102deg, #0D4DFF 0%, #00FFA9 100%) 0% 0% no-repeat padding-box',
		'transparent linear-gradient(282deg, #1FC9FD 0%, #FC0061 100%) 0% 0% no-repeat padding-box',
		'transparent linear-gradient(287deg, #8A5CC4 0%, #FF0061 100%) 0% 0% no-repeat padding-box',
		'transparent linear-gradient(101deg, #106AD2 0%, #A32CDF 100%) 0% 0% no-repeat padding-box',
		'transparent linear-gradient(281deg, #FFE53B 0%, #FF2725 100%, #FF2525 100%) 0% 0% no-repeat padding-box',
		'transparent linear-gradient(101deg, #4218B8 0%, #00C0FF 100%) 0% 0% no-repeat padding-box',
		'transparent linear-gradient(101deg, #4218B8 0%, #00C0FF 100%) 0% 0% no-repeat padding-box',
		'transparent linear-gradient(101deg, #932784 0%, #8F2E88 0%, #7A4D9A 15%, #00FFFF 100%) 0% 0% no-repeat padding-box',
		'transparent linear-gradient(101deg, #FF0A6C 0%, #4A3CDB 100%) 0% 0% no-repeat padding-box'
	]
	slideOptsOne = {
		initialSlide: 0,
		speed: 400,
		slidesPerView: 1,
		spaceBetween: 15,
		autoplay:true
	   };
	appConstants = AppConstants;
	constructor(public calenderService: CalenderService) { }
	ngOnInit() {
		this.publicHolidaysInCurrentYear= this.calenderService.publicHolidaysInCurrentYear;
		this.monthDetails=this.calenderService.monthDetails;
		this.selectedLanguageSubscription = this.calenderService.selectedLanguage.subscribe((selectedLanguage)=>{
			if(selectedLanguage==AppConstants.languageHindi) {
				this.selectedMonthDetails=this.calenderService.nativeMonthDetails;
				this.nativeLanguageMonthsWords=this.calenderService.nativeLanguageMonthsWords;
			}else{
				this.selectedMonthDetails = this.calenderService.monthDetails;
				this.nativeLanguageMonthsWords = this.calenderService.englishLanguageMonthsWords;
			};
			this.prepareCurrentMonthHoliday();
		});
		this.currentMonthAndYearSubscription = this.calenderService.currentMonthAndYear.subscribe((currentMonth: number) => {
			if(currentMonth){
				this.currentMonth = Number(Number(currentMonth.toString().slice(4,6))-1);
				this.selectedYear = Number(currentMonth.toString().slice(0,4));
			};
			this.prepareCurrentMonthHoliday();
		});
	}
	prepareCurrentMonthHoliday(){
		let currentMonthHolidays = this.publicHolidaysInCurrentYear.filter((publicHoliday)=>{ 
			return (new Date(publicHoliday).getMonth() == this.currentMonth && new Date(publicHoliday).getFullYear()== this.selectedYear);
		});
		this.currentMonthHolidayDetails=currentMonthHolidays.map((holiday)=>{
			let req ={
				...this.calenderService.getDateDetails(new Date(holiday).toDateString()), 
				linearGadientColor: this.linearGradientOptions[Math.round(Math.random()*10)]
			};
			console.log(req.linearGadientColor)
			return req
		});
		this.slides.slideTo(0, 500);
	}
	ngOnDestroy(){
		this.currentMonthSubscription.unsubscribe();
		this.currentMonthAndYearSubscription.unsubscribe();
		this.selectedLanguageSubscription.unsubscribe();
	}

}
