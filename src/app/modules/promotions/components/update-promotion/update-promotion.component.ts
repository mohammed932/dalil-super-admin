import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpPromotionsService } from "../../service/promotions.service";

@Component({
  selector: "app-update-promotion",
  templateUrl: "./update-promotion.component.html",
  styleUrls: ["./update-promotion.component.scss"]
})
export class UpdatePromotionComponent implements OnInit {
  public updatePromotion: FormGroup;
  loading = false;
  isFixed = false;
  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public promotion: any,
    private httpPromotionsService: HttpPromotionsService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService
  ) {}

  ngOnInit() {
    this.updatePromotion = this.fg.group({
      type: ["", Validators.required],
      value: ["", Validators.required],
      limit: ["", Validators.required]
    });
    this.setPromotionData();
  }

  setPromotionData() {
    this.updatePromotion["controls"].type.setValue(this.promotion.type);
    this.updatePromotion["controls"].value.setValue(this.promotion.value);
    this.updatePromotion["controls"].limit.setValue(this.promotion.limit);
  }

  getSelectedType(event) {
    this.updatePromotion["controls"].type.setValue(event.target.value);
  }

  updateNewPromotion() {
    const data = {
      type: this.updatePromotion["controls"].type.value,
      value: parseInt(this.updatePromotion["controls"].value.value),
      limit: parseInt(this.updatePromotion["controls"].limit.value)
    };

    if (this.updatePromotion.invalid) {
      this.notificationSerive.errorNotification("Please enter correct data");
      return;
    }

    this.httpPromotionsService.createNewPromoCode(data).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationSerive.successNotification(
            `Category ${data.body["name"]} created`
          );
          this.dialogRef.closeAll();
        }
      },
      err => {
        this.notificationSerive.errorNotification(err.error.message);
      }
    );
  }
}
