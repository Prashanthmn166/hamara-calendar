import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { CalenderService } from '../calender.service';
import { ModalController } from '@ionic/angular';
import { DayDetailsComponent } from './day-details/day-details.component';

@Component({
	selector: 'app-calender-body',
	templateUrl: './calender-body.component.html',
	styleUrls: ['./calender-body.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CalenderBodyComponent implements OnInit {
	dayNumbers: string[];
	daysDispOrder: string[];
	monthDetails: string[];
	monthArr: string[];
	NativeLanguage: object;
	currentDate: Date;
	currentYear: number;
	currentMonth: number;
	yearCalendarContent: any = {};
	slideOpts = {};
	@ViewChild('slides', {static: true}) slides: IonSlides;
	constructor(private calenderService: CalenderService, private modalController: ModalController) {
		this.dayNumbers = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		this.daysDispOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		this.monthDetails = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		this.monthArr = [
			'Sun1', 'Mon1', 'Tue1', 'Wed1', 'Thu1', 'Fri1', 'Sat1', 
			'Sun2', 'Mon2', 'Tue2', 'Wed2', 'Thu2', 'Fri2', 'Sat2',
			'Sun3', 'Mon3', 'Tue3', 'Wed3', 'Thu3', 'Fri3', 'Sat3', 
			'Sun4', 'Mon4', 'Tue4', 'Wed4', 'Thu4', 'Fri4', 'Sat4', 
			'Sun5', 'Mon5', 'Tue5', 'Wed5', 'Thu5', 'Fri5', 'Sat5'
		];
		this.NativeLanguage = {
			Sun: 'रवि',
			Mon: 'सोम',
			Tue: 'मंगल',
			Wed: 'बुध',
			Thu: 'गुरु',
			Fri: 'शुक्र',
			Sat: 'शनि'
		};
		this.currentDate = new Date();
		this.currentYear = new Date().getFullYear();
		this.currentMonth = new Date().getMonth();
		this.generateYearCalendar(2022);
		this.generateYearCalendar(2023);
	}
	ngOnInit(){
		let currentMonth =Number(this.currentYear.toString()+("0"+Number(this.currentMonth+1)).slice(-2));
		this.slideOpts={
			loop: false,
			direction: 'vertical',
			initialSlide: this.setSliderMonthFromCurrentMonthAndYear(currentMonth),
			backdropDismiss: true,
			showBackdrop: true,
			swipeToClose:true
		};
		this.calenderService.currentMonthAndYear.next(Number(currentMonth));
		this.calenderService.currentMonthAndYear.subscribe((currentMonthAndYear: number)=>{
			this.slides.slideTo(this.setSliderMonthFromCurrentMonthAndYear(currentMonthAndYear), 500);
		})
	}
	generateYearCalendar(year: number) {
		for (var month = 1; month <= 12; month++) {
			let yearMonthKey = year.toString()+("0"+month).slice(-2);
			if(localStorage.getItem(yearMonthKey)) {
				this.yearCalendarContent[yearMonthKey] = JSON.parse(localStorage.getItem(yearMonthKey));
			}
			let daysInMonth = new Date(year, month, 0).getDate();
			let daysDetails = [];
			let finishedDaysArr = [];
			let tempMonthArr = [];
			tempMonthArr = [
				'Sun1', 'Mon1', 'Tue1', 'Wed1', 'Thu1', 'Fri1', 'Sat1', 
				'Sun2', 'Mon2', 'Tue2', 'Wed2', 'Thu2', 'Fri2', 'Sat2',
				'Sun3', 'Mon3', 'Tue3', 'Wed3', 'Thu3', 'Fri3', 'Sat3', 
				'Sun4', 'Mon4', 'Tue4', 'Wed4', 'Thu4', 'Fri4', 'Sat4', 
				'Sun5', 'Mon5', 'Tue5', 'Wed5', 'Thu5', 'Fri5', 'Sat5'
			];
			for (var i = 1; i <= daysInMonth; i++) {
				daysDetails[i] = { fullDate: '', day: '', date: '', type: 'date', image:'', isPublicHoliday : 'N'};
				daysDetails[i].fullDate = new Date(year, month - 1, i);
				daysDetails[i].date = new Date(year, month - 1, i).getDate();
				daysDetails[i].image=this.calenderService.doseDateHaveImage(daysDetails[i].fullDate);
				daysDetails[i].isPublicHoliday=this.calenderService.isPublicHoliday(daysDetails[i].fullDate);
				var day = daysDetails[i].fullDate.getDay();
				for (var j = 0; j < tempMonthArr.length; j++) {
					if (tempMonthArr[j] != undefined) {
						var tempFullDay = tempMonthArr[j];
						var tempDay = tempFullDay.substring(0, 3);
						if (this.dayNumbers[day] == tempDay && finishedDaysArr.indexOf(tempMonthArr[j]) == -1) {
							daysDetails[i].day = tempMonthArr[j];
							finishedDaysArr.push(tempMonthArr[j]);
							break;
						}
						else {
							var tempMonthdate = tempMonthArr[j];
							delete tempMonthArr[j];
							tempMonthArr.push(tempMonthdate);
						}
					}
				}
				var dispDateDetails = [];
				for (var k = 0; k < this.daysDispOrder.length; k++) {
					var tempDispDay = this.daysDispOrder[k];
					dispDateDetails[k] = [];
					var pushDefaultDay = "Y";
					for (var l = 1; l <= 6; l++) {
						if (pushDefaultDay == "Y") {
							dispDateDetails[k].push({ date: 'type', day: this.daysDispOrder[k] });
							pushDefaultDay = "N";
						}
						var gotDay = 'N';
						for (var d = 0; d < daysDetails.length; d++) {
							if (daysDetails[d] && daysDetails[d].day == (tempDispDay + l)) {
								dispDateDetails[k].push(daysDetails[d]);
								gotDay = "Y";
							}
						}
						if (gotDay == "N")
							dispDateDetails[k].push({ date: '', day: '' });
					}
				}
			}
			finishedDaysArr = [];
			var dispDateDetails = [];
			var col = 4;
			daysDetails.forEach(element => {
				if (element.day.substr(3, 1) > col)
					col = element.day.substr(3, 1);
			});
			for (var k = 0; k < this.daysDispOrder.length; k++) {
				var tempDispDay = this.daysDispOrder[k];
				dispDateDetails[k] = [];
				var pushDefaultDay = "Y";
				for (var l = 1; l <= col; l++) {
					if (pushDefaultDay == "Y") {
						dispDateDetails[k].push({ date: '', day: this.daysDispOrder[k], type: 'dow', fullDate: '' });
						pushDefaultDay = "N";
					}
					var gotDay = 'N';
					for (var d = 0; d < daysDetails.length; d++) {
						if (daysDetails[d] && daysDetails[d].day == (tempDispDay + l)) {
							dispDateDetails[k].push(daysDetails[d]);
							gotDay = "Y";
						}
					}
					if (gotDay == "N")
						dispDateDetails[k].push({ date: '', day: '', type: 'empty', fullDate: '' });
				}
			}
			this.yearCalendarContent[yearMonthKey] = dispDateDetails;
			localStorage.setItem(yearMonthKey, JSON.stringify(dispDateDetails));
		};
	}
	onSlideChange($event: any){
		this.slides.getActiveIndex().then((index: number) => {
			this.calenderService.currentMonthAndYear.next(this.getCurrentMonthAndYearFromSliderMonth(index));
		});	
	}
	async showDayDetails(fullDate: string, dayType: string){
		if(dayType != 'empty'){
			let element = document.getElementsByClassName('calender-container')[0];
			if(element)
				element.classList.add('add-blur');
			const modal = await this.modalController.create({
				component: DayDetailsComponent,
				cssClass: 'date-details-model-container',
				swipeToClose: true,
				componentProps:{
					fullDate: fullDate
				}
			});
			modal.present();
			this.calenderService.isDayViewOpen.next(true);
			await modal.onDidDismiss().then(r => {
				this.calenderService.isDayViewOpen.next(false);
				let element = document.getElementsByClassName('calender-container')[0];
				if(element)
					element.classList.remove('add-blur');
			});
		}
	}
	isCurrentDay(fulldate){
		return (new Date(fulldate).getMonth()== this.currentMonth && new Date(fulldate).getDate()== new Date(this.currentDate).getDate() && new Date(fulldate).getFullYear()== new Date(this.currentDate).getFullYear());
	}
	getCurrentMonthAndYearFromSliderMonth(sliderIndex:number): number{
		if(sliderIndex<12){
			return Number(Number(2022).toString()+("0"+Number(sliderIndex+1)).slice(-2));
		}else{
			return Number(Number(2023).toString()+("0"+Number(sliderIndex-12+1)).slice(-2));;
		};
	}
	setSliderMonthFromCurrentMonthAndYear(currentMonthAndYear: number): number{
		let seletedYear=0;
		let seletedMonth=0;
		let sliderIndex=0;
		if(currentMonthAndYear){
			seletedYear=Number(currentMonthAndYear.toString().slice(0,4));
			seletedMonth = Number(currentMonthAndYear.toString().slice(4,6));
			if(seletedYear==2022){
				sliderIndex=Number(seletedMonth-1);
			}
			else{
				sliderIndex=Number(12+seletedMonth-1);
			}
		};
		return sliderIndex;
	}
}
