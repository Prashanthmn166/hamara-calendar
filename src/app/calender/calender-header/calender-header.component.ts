import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CalenderService } from '../calender.service';

@Component({
	selector: 'app-calender-header',
	templateUrl: './calender-header.component.html',
	styleUrls: ['./calender-header.component.scss'],
})
export class CalenderHeaderComponent implements OnInit, OnDestroy {
	nativeMonthDetails : string[]= [];
	monthDetails : string[] =[];
	nativeLanguageMonthsWords: string[] =[];
	currentMonth: number;
	currentYear: number = new Date().getFullYear();
	currentMonthSubscription: Subscription;
	publicHolidaysInCurrentYear: string[];
	currentMonthHolidayDetails: any[]=[];
	@ViewChild('headerSlides', {static: true}) slides: IonSlides;
	slideOptions = {
		initialSlide: 1,
		speed: 400,
	};
	constructor(private calenderService: CalenderService) { }
	ngOnInit() {
		this.nativeMonthDetails=this.calenderService.nativeMonthDetails;
		this.monthDetails=this.calenderService.monthDetails;
		this.nativeLanguageMonthsWords=this.calenderService.nativeLanguageMonthsWords;
		this.publicHolidaysInCurrentYear= this.calenderService.publicHolidaysInCurrentYear;
		this.calenderService.currentMonth.subscribe((currentMonth: number) => {
			this.currentMonth = currentMonth;
			this.prepareCurrentMonthHoliday();
		})
	}
	prepareCurrentMonthHoliday(){
		let currentMonthHolidays = this.publicHolidaysInCurrentYear.filter((publiHoliday)=>{ return new Date(publiHoliday).getMonth() == this.currentMonth});
		this.currentMonthHolidayDetails=currentMonthHolidays.map((holiday)=>{
			return this.calenderService.getDateDetails(new Date(holiday).toDateString());
		})
		this.slides.slideTo(0, 500);
	}
	ngOnDestroy(){
		this.currentMonthSubscription.unsubscribe();
	}

}
