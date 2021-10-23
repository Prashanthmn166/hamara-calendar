import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppConstants } from 'src/app/constants/app.constants';
import { CalenderService } from '../../calender.service';
@Component({
	selector: 'app-day-details',
	templateUrl: './day-details.component.html',
	styleUrls: ['./day-details.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DayDetailsComponent implements OnInit {
	@Input() fullDate: string;
	currentDate: Date;
	dateDetails: any = {};
	appConstants = AppConstants;
	constructor(private modalCtrl: ModalController, public calenderService: CalenderService) { }

	ngOnInit() {
		this.dateDetails = this.calenderService.getDateDetails(this.fullDate);
		this.currentDate = new Date(this.fullDate);
	}
	dismiss() {
		this.modalCtrl.dismiss({
			'dismissed': true
		});
	}
	onSwipeLeft() {
		this.currentDate.setDate(this.currentDate.getDate() - 1);
		this.dateDetails = this.calenderService.getDateDetails(this.currentDate.toDateString());
	}
	onSwipeRight() {
		this.currentDate.setDate(this.currentDate.getDate() + 1);
		this.dateDetails = this.calenderService.getDateDetails(this.currentDate.toDateString());
	}
}
