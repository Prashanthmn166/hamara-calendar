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
	slideOptions = {
		initialSlide: 1,
		speed: 400,
	};
	constructor(private calenderService: CalenderService) { }
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
			return this.calenderService.getDateDetails(new Date(holiday).toDateString());
		});
		console.log(currentMonthHolidays)
		console.log(this.currentMonthHolidayDetails)
		this.slides.slideTo(0, 500);
	}
	ngOnDestroy(){
		this.currentMonthSubscription.unsubscribe();
		this.currentMonthAndYearSubscription.unsubscribe();
		this.selectedLanguageSubscription.unsubscribe();
	}

}
