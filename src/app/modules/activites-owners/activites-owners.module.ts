import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { UpdateActivitiesComponent } from './components/update-activities/update-activities.component';
import { AddOfferActivityComponent } from './components/add-offer/add-offer-activities.component';
import { ActivitiesOwnersComponent } from './activites-owners.component';
import { AddNewActivitiesOwnerComponent } from './components/add-new-activites-owners/add-new-activites-owners.component';
import { ActivitiesOwnersRoutingModule } from './activites-owners..routing';
import { UpdateActivityFormComponent } from './components/update-activity-form/update-activity-form.component';

@NgModule({
  imports: [CommonModule, SharedModule, ActivitiesOwnersRoutingModule],
  declarations: [
    ActivitiesOwnersComponent,
    AddOfferActivityComponent,
    UpdateActivityFormComponent,
    AddNewActivitiesOwnerComponent, UpdateActivitiesComponent],
  entryComponents: [AddNewActivitiesOwnerComponent, UpdateActivitiesComponent, AddOfferActivityComponent]
})
export class ActivitiesOwnersModule { }
