import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { ActivitiesRoutingModule } from './activites.routing';
import { ActivitiesComponent } from './activites.component';

@NgModule({
  imports: [CommonModule, SharedModule, ActivitiesRoutingModule],
  declarations: [
    ActivitiesComponent,
  ],
  providers: [DatePipe]
})
export class ActivitiesModule { }
