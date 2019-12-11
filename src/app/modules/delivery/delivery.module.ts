import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { DeliveryComponent } from './delivery.component';
import { DeliveryRoutingModule } from './delivery.routing';
import { AddNewDeliveryComponent } from './components/add-new-delivery/add-new-delivery.component';
import { UpdateDeliveryComponent } from './components/update-delivery/update-delivery.component';

@NgModule({
  imports: [CommonModule, SharedModule, DeliveryRoutingModule],
  declarations: [ DeliveryComponent, AddNewDeliveryComponent, UpdateDeliveryComponent],
  entryComponents: [AddNewDeliveryComponent, UpdateDeliveryComponent]
})
export class DeliveryModule { }
