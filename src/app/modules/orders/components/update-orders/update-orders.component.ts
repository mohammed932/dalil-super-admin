import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NotificationService } from '../../../../shared/services/notifications/notification.service';
import { HttpOrdersService } from '../../service/orders.service';
@Component({
  selector: 'app-update-orders',
  templateUrl: './update-orders.component.html',
  styleUrls: ['./update-orders.component.scss']
})
export class UpdateOrdersComponent implements OnInit {
  loading = false;
  isFixed = false;
  status = '';
  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public order: any,
    private httpOrdersService: HttpOrdersService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService,
  ) { }

  ngOnInit() {

    
  }


  setOrderStatus(event) {
    this.status = event.target.value;
  }

  updateNewPromotion() {
    const data = {
      status: this.status
    }
    this.httpOrdersService.updateOrderStatus(data, this.order._id).subscribe(data => {
      if (data.status === 200) {
        this.notificationSerive.successNotification(`Order status updated`);
        this.dialogRef.closeAll();
      }
    }, err => {
      this.notificationSerive.errorNotification(err.error.message);
    })
  }

}
