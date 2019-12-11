import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpDayOffsService } from "../../services/dayoffs.service";
import * as moment from "moment";

@Component({
  selector: "app-dayOff",
  templateUrl: "./add-dayOff.component.html",
  styleUrls: ["./add-dayOff.component.scss"]
})
export class AddDayOffComponent implements OnInit {
  createNewDayOffForm: FormGroup;
  public imagePath;
  loading = false;

  constructor(
    private fg: FormBuilder,
    private dialogRef: MatDialog,
    private httpDayOffsService: HttpDayOffsService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public city: any
  ) {}

  ngOnInit() {
    this.createNewDayOffForm = this.fg.group({
      date: ["", Validators.required]
    });
  }

  onSubmit() {
    const date = new Date(this.createNewDayOffForm["controls"].date.value);
    let formatted_date = moment(date).format("YYYY-MM-DD");
    const newDayOff = {
      date: formatted_date
    };

    if (this.createNewDayOffForm.invalid) {
      return this.notificationService.errorNotification(
        "Please make sure that you enter correct data!"
      );
    }
    this.httpDayOffsService.createNewDayOff(newDayOff).subscribe(
      data => {
        this.notificationService.successNotification(
          `${data.body.name} created`
        );
        this.dialogRef.closeAll();
      },
      err => {
        if (err.error) {
          this.notificationService.errorNotification(err.error.message);
        }
      }
    );
  }
}
