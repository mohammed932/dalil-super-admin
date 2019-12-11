import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpDeliveryService } from "../../service/delivery.service";

@Component({
  selector: "app-add-new-delivery",
  templateUrl: "./add-new-delivery.component.html",
  styleUrls: ["./add-new-delivery.component.scss"]
})
export class AddNewDeliveryComponent implements OnInit {
  public addNewPromotion: FormGroup;
  loading = false;
  isFixed = false;
  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public city: any,
    private httpDeliveryService: HttpDeliveryService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService
  ) {}

  ngOnInit() {
    this.addNewPromotion = this.fg.group({
      start: ["", Validators.required],
      end: ["", Validators.required]
    });
  }

  checkFixed(event) {
    if (this.addNewPromotion["controls"].fixed.value) {
      this.addNewPromotion["controls"].percentage.disable();
    } else {
      this.addNewPromotion["controls"].percentage.enable();
    }
  }

  checkPercentage() {
    if (this.addNewPromotion["controls"].percentage.value) {
      this.addNewPromotion["controls"].fixed.disable();
    } else {
      this.addNewPromotion["controls"].fixed.enable();
    }
  }

  getSelectedType(event) {
    this.addNewPromotion["controls"].type.setValue(event.target.value);
  }

  createNewDelivery() {
    const data = {
      start: parseInt(this.addNewPromotion["controls"].start.value),
      end: parseInt(this.addNewPromotion["controls"].end.value)
    };

    if (this.addNewPromotion.invalid) {
      this.notificationSerive.errorNotification("Please enter correct data");
      return;
    }

    this.httpDeliveryService.createNewDelivery(data).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationSerive.successNotification(`Delivery created`);
          this.dialogRef.closeAll();
        }
      },
      err => {
        this.notificationSerive.errorNotification(err.error.message);
      }
    );
  }
}
