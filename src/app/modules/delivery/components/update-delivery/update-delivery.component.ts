import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpDeliveryService } from "../../service/delivery.service";

@Component({
  selector: "app-update-delivery",
  templateUrl: "./update-delivery.component.html",
  styleUrls: ["./update-delivery.component.scss"]
})
export class UpdateDeliveryComponent implements OnInit {
  public updateDeliveryForm: FormGroup;
  loading = false;
  isFixed = false;
  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public delivery: any,
    private httpDeliveryService: HttpDeliveryService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService
  ) {}

  ngOnInit() {
    this.updateDeliveryForm = this.fg.group({
      start: ["", Validators.required],
      end: ["", Validators.required]
    });
    this.setDeliveryData();
  }

  setDeliveryData() {
    this.updateDeliveryForm["controls"].start.setValue(this.delivery.start);
    this.updateDeliveryForm["controls"].end.setValue(this.delivery.end);
  }

  updateDelivery() {
    const data = {
      start: parseInt(this.updateDeliveryForm["controls"].start.value),
      end: parseInt(this.updateDeliveryForm["controls"].end.value)
    };

    if (this.updateDeliveryForm.invalid) {
      this.notificationSerive.errorNotification("Please enter correct data");
      return;
    }

    this.httpDeliveryService.updateDelivery(data, this.delivery._id).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationSerive.successNotification(`Delivery Updated`);
          this.dialogRef.closeAll();
        }
      },
      err => {
        this.notificationSerive.errorNotification(err.error.message);
      }
    );
  }
}
