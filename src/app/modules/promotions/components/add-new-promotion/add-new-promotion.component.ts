import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NotificationService } from '../../../../shared/services/notifications/notification.service';
import { HttpPromotionsService } from '../../service/promotions.service';

@Component({
  selector: 'app-add-new-promotion',
  templateUrl: './add-new-promotion.component.html',
  styleUrls: ['./add-new-promotion.component.scss']
})
export class AddNewPromotionComponent implements OnInit {
  public addNewPromotion: FormGroup;
  loading = false;
  isFixed = false;
  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public city: any,
    private httpPromotionsService: HttpPromotionsService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService,
  ) { }
  ngOnInit() {
    this.addNewPromotion = this.fg.group({
      type: ['', Validators.required],
      value: ['', Validators.required],
      limit: ['', Validators.required],
    });
  }
  checkFixed(event) {
    if (this.addNewPromotion.controls.fixed.value) {
      this.addNewPromotion.controls.percentage.disable();
    } else {
      this.addNewPromotion.controls.percentage.enable();
    }
  }
  checkPercentage() {
    if (this.addNewPromotion.controls.percentage.value) {
      this.addNewPromotion.controls.fixed.disable();
    } else {
      this.addNewPromotion.controls.fixed.enable();
    }
  }
  getSelectedType(event) {
    this.addNewPromotion.controls.type.setValue(event.target.value);
  }
  saveNewPromotion() {
    const data = {
      type: this.addNewPromotion.controls.type.value,
      value: parseInt(this.addNewPromotion.controls.value.value),
      limit: parseInt(this.addNewPromotion.controls.limit.value)
    }
    if (this.addNewPromotion.invalid) {
      this.notificationSerive.errorNotification('Please enter correct data');
      return;
    }
    this.httpPromotionsService.createNewPromoCode(data).subscribe(data => {
      if (data.status === 200) {
        this.notificationSerive.successNotification(`Category ${data.body['name']} created`)
        this.dialogRef.closeAll();
      }
    }, err => {
      this.notificationSerive.errorNotification(err.error.message);
    })
  }
}
