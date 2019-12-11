import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HttpOrdersService } from '../service/orders.service';
import { NotificationService } from '../../../shared/services/notifications/notification.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss', "../../tabel.scss"]
})
export class OrderDetailsComponent implements OnInit {
  orderId: any;
  order: any;

  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  locationValues = [];
  marker: any;
  hideVoucherActions = false;

  checkProductLength = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private httpOrderService: HttpOrdersService,
    private notifcationService: NotificationService
  ) { }

  ngOnInit() {

    this.activeRoute.paramMap
      .pipe(
        switchMap(x => this.singleOrder(x.get('id')))
      )
      .subscribe(data => {
        this.order = data.body;
        if (this.order.products.length > 1) {
          this.checkProductLength = true;
        }
      })
  }



  singleOrder(orderId) {
    return this.httpOrderService.getSingleOrder(orderId)
  }

  sendVoucherStatus(status) {
    let message;
    const data = {
      status: status
    }
    if (status === 'confirmed') {
      message = 'Order has been confirmed';
    }

    if (status === 'rejected') {
      message = 'Order has been Rejected';
    }
    this.httpOrderService.updateOrderStatus(data, this.order._id).subscribe(data => {
      if (data.status === 200) {
        this.order = data.body;
        if (status === 'confirmed') {
          this.notifcationService.successNotification('Order has been confirmed')
        }

        if (status === 'rejected') {
          this.notifcationService.warningNotification(message);
        }
      }
    })
  }

}
