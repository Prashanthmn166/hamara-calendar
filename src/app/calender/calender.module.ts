import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalenderPageRoutingModule } from './calender-routing.module';

import { CalenderPage } from './calender.page';
import { CalenderHeaderComponent } from './calender-header/calender-header.component';
import { CalenderBodyComponent } from './calender-body/calender-body.component';
import { DayDetailsComponent } from './calender-body/day-details/day-details.component';
import { SwipeDirective } from '../swipe/swipe.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalenderPageRoutingModule
  ],
  declarations: [CalenderPage, CalenderHeaderComponent, CalenderBodyComponent, DayDetailsComponent, SwipeDirective]
})
export class CalenderPageModule {}
