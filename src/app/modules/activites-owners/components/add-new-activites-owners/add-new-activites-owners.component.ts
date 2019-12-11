import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpOccationsService } from "../../../../modules/occations/service/occations.service";

@Component({
  selector: "app-add-new-activites-owners",
  templateUrl: "./add-new-activites-owners.component.html",
  styleUrls: ["./add-new-activites-owners.component.scss"]
})
export class AddNewActivitiesOwnerComponent implements OnInit {
  public pipe = new DatePipe("en-US");
  public createNewCategory: FormGroup;

  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  drawingPaths: any;
  cityPaths = [];

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public city: any,
    private toastr: ToastrService,
    private dialogRef: MatDialog,
    private notificationService: NotificationService,
    private httpOccationService: HttpOccationsService
  ) {}

  ngOnInit() {
    this.createNewCategory = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required]
    });
  }

  saveNewCategory() {
    const data = {
      name: this.createNewCategory["controls"].name.value,
      translation: {
        ar: {
          name: this.createNewCategory["controls"].name_ar.value
        }
      }
    };

    this.httpOccationService.sendNewOccation(data).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationService.successNotification(
            `Category ${data.body["name"]} created`
          );
          this.dialogRef.closeAll();
        }
      },
      err => {
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }
}
