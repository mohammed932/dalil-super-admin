import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { PromotionsComponent } from './promotions.component';
import { PromotionsRoutingModule } from './promotions.routing';
import { AddNewPromotionComponent } from './components/add-new-promotion/add-new-promotion.component';
import { UpdatePromotionComponent } from './components/update-promotion/update-promotion.component';

@NgModule({
  imports: [CommonModule, SharedModule, PromotionsRoutingModule],
  declarations: [PromotionsComponent, AddNewPromotionComponent, UpdatePromotionComponent],
  entryComponents: [AddNewPromotionComponent, UpdatePromotionComponent]
})
export class PromotionsModule { }
