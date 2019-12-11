import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { OccationRoutingModule } from './occation.routing';
import { OccationComponent } from './occation.component';
import { UpdateOccationComponent } from './components/update-occation/update-occation.component';
import { AddNewOccationComponent } from './components/add-new-occation/add-new-occation.component';

@NgModule({
  imports: [CommonModule, SharedModule, OccationRoutingModule],
  declarations: [OccationComponent, AddNewOccationComponent, UpdateOccationComponent],
  entryComponents: [AddNewOccationComponent, UpdateOccationComponent]
})
export class OccationModule { }
