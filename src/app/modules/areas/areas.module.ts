import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { AreasRoutringModule } from './areas.routing';
import { AreasComponent } from './areas.component';
import { AddNewAreaComponent } from './components/add-new-area/add-new-area.component';
import { EditAreaComponent } from './components/edit-area/edit-area.component';
import { AddNewCityComponent } from './components/add-new-city/add-new-city.component';
import { EditCityComponent } from './components/edit-city/edit-city.component';



@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AreasRoutringModule
    ],
    entryComponents: [AddNewAreaComponent, EditAreaComponent, AddNewCityComponent, EditCityComponent],
    declarations: [AreasComponent, AddNewAreaComponent, EditAreaComponent, AddNewCityComponent, EditCityComponent],
})
export class AreasModule { }
