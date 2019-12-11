import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OffersRoutingModule } from "./offers.routing";
import { OffersComponent } from './offers.component';
import { SharedModule } from '../../shared/shared.module';
import { AddOfferComponent } from './add-offer/add-offer.component';

@NgModule({
  imports: [CommonModule, SharedModule, OffersRoutingModule],
  declarations: [OffersComponent, AddOfferComponent],
  entryComponents: []
})
export class OffersModule { }
