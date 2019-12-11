import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products.routing';

@NgModule({
  imports: [CommonModule, SharedModule, ProductsRoutingModule],
  declarations: [ProductsComponent],
  entryComponents: []
})
export class ProductsModule { }
