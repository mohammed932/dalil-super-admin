import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { DayOffsComponent } from './dayoffs.component';
import { DayOffsRoutingModule } from './dayoffs.routing';
import { AddDayOffComponent } from './components/add-dayOff/add-dayOff.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DayOffsRoutingModule
    ],
    entryComponents: [AddDayOffComponent],
    declarations: [DayOffsComponent, AddDayOffComponent],
})
export class DayOffsModule { }
