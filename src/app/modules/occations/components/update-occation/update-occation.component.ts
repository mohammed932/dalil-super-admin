import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpOccationsService } from "../../service/occations.service";

@Component({
  selector: "app-update-occation",
  templateUrl: "./update-occation.component.html",
  styleUrls: ["./update-occation.component.scss"]
})
export class UpdateOccationComponent implements OnInit {
  isDisabled = false;
  public pipe = new DatePipe("en-US");
  public updateCategory: FormGroup;
  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  drawingPaths: any;
  cityPaths = [];

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public occasion: any,
    private toastr: ToastrService,
    // private httpAreasService: HttpAreasService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService,
    private httpOccationService: HttpOccationsService
  ) {}

  ngOnInit() {
    this.updateCategory = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required]
    });
    this.setCategoryName();
  }

  setCategoryName() {
    this.updateCategory["controls"].name.setValue(this.occasion.name);
    this.updateCategory["controls"].name_ar.setValue(
      this.occasion.translation.ar.name
    );
  }

  sendUpdatedCategory() {
    this.isDisabled = true;
    this.loading = true;
    const data = {
      name: this.updateCategory["controls"].name.value,
      translation: {
        ar: {
          name: this.updateCategory["controls"].name_ar.value
        }
      }
    };

    this.httpOccationService.updateOccasion(data, this.occasion._id).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationSerive.successNotification(`تم تعديل المناسبه نجاح`);
          this.loading = false;
          this.dialogRef.closeAll();
          this.isDisabled = false;
        }
      },
      err => {
        this.isDisabled = false;
        this.loading = false;
        this.notificationSerive.errorNotification(err.error.message);
      }
    );
  }
}
