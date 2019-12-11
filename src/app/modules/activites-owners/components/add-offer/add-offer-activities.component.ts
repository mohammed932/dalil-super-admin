import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpActivitiesOwnersService } from "../../service/activities-owners.service";

@Component({
  selector: "app-add-offer",
  templateUrl: "./add-offer-activities.component.html",
  styleUrls: ["./add-offer-activities.component.scss"]
})
export class AddOfferActivityComponent implements OnInit {
  public pipe = new DatePipe("en-US");
  public createNewOffer: FormGroup;

  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  drawingPaths: any;
  cityPaths = [];
  startOffer: string;
  endOffer: string;

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public activity: any,
    private toastr: ToastrService,
    private dialogRef: MatDialog,
    private notificationService: NotificationService,
    private httpOccationService: HttpActivitiesOwnersService,
    private datepipe: DatePipe
  ) {}

  ngOnInit() {
    this.createNewOffer = this.fg.group({
      price: ["", Validators.required]
    });
  }

  getStartOfferDate(event) {
    const START_OFFER_TIME = new Date(event.target.value);
    const startDate =
      START_OFFER_TIME.getFullYear() +
      "-" +
      (START_OFFER_TIME.getMonth() + 1) +
      "-" +
      START_OFFER_TIME.getDate();
    this.startOffer = this.formatDate(startDate);
  }

  getEndOfferDate(event) {
    const END_OFFER_TIME = new Date(event.target.value);
    this.endOffer = this.formatDate(END_OFFER_TIME);
  }

  formatDate(selectedDate) {
    const currentDate = selectedDate;
    let latest_date = this.datepipe.transform(currentDate, "yyyy-MM-dd");
    return latest_date || "";
  }

  saveNewOffer() {
    const offerData = {
      property: this.activity._id,
      offer_price: this.createNewOffer["controls"].price.value,
      offer_start: this.startOffer,
      offer_end: this.endOffer
    };

    this.httpOccationService.sendNewOffer(offerData).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationService.successNotification(
            `تم اضافة عرض لنشاط ${data.body["name"]}`
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
