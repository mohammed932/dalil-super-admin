import { Component, OnInit } from '@angular/core';
import { ProductsDataSource } from '../products/class/products.datasource';
import { HttpProductsService } from '../products/service/products.service';
import { NotificationService } from '../../shared/services/notifications/notification.service';
import { BoxAnimation } from '../../shared/animations/box-animation';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  animations: [BoxAnimation]
})
export class OffersComponent implements OnInit {
  selectedProducts: any = [];
  width: number;
  height: number;
  products: any[];
  dataSource = new ProductsDataSource(this.httpProductsService);
  imagePreview: string | ArrayBuffer;
  image: any;
  constructor(
    private httpProductsService: HttpProductsService,
    private notifcationService: NotificationService
  ) { }

  ngOnInit() {
    this.refreshServicesData();
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }


  refreshServicesData() {
    this.httpProductsService.getAllProducts(0, '', 0, false).subscribe(data => {

      if (data.status === 200) {
        this.products = data.body;
      }
    })
  }


  addProductToCreateOfferForThem(product, index) {
    if (!this.selectedProducts.includes(product)) {
      this.selectedProducts.push(product);
      this.httpProductsService.setSelectedProducts(this.selectedProducts);

    } else {
      if (index === 0) {
        this.selectedProducts = [];
        this.httpProductsService.setSelectedProducts(this.selectedProducts);
        return;
      }
      this.selectedProducts.splice(index, 1);
      this.httpProductsService.setSelectedProducts(this.selectedProducts);
    }
  }

}
