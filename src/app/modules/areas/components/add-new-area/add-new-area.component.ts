import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { HttpAreasService } from "../../service/areas.service";
import { DatePipe } from "@angular/common";
import { MapConfigService } from "../../../../shared/services/map/map-config.service";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
@Component({
  selector: "app-add-new-area",
  templateUrl: "./add-new-area.component.html",
  styleUrls: [
    "./add-new-area.component.scss",
    "../add-new-city/add-new-city.component.scss"
  ]
})
export class AddNewAreaComponent implements OnInit {
  public pipe = new DatePipe("en-US");
  public createNewArea: FormGroup;
  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  isDisabled = false;
  drawingPaths: any;
  cityPaths = [];

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public city: any,
    private toastr: ToastrService,
    private httpAreasService: HttpAreasService,
    private mapConfigService: MapConfigService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService
  ) {}

  ngOnInit() {
    this.createNewArea = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required]
    });
    this.getCityPaths();
  }

  getCityPaths() {
    this.cityPaths = this.city.data.location.coordinates[0].map(x => {
      return {
        lat: x[1],
        lng: x[0]
      };
    });
    return this.cityPaths;
  }

  private successPopUp(): void {
    this.toastr.success(
      `<span class="now-ui-icons ui-1_bell-53"></span> You added City <b>${this.createNewArea["controls"]["name"].value}</b> - Successfully.`,
      "",
      {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        toastClass: "alert alert-success alert-with-icon",
        positionClass: "toast-" + "top" + "-" + "right"
      }
    );
  }

  onMapReady(map) {
    this.mapConfigService.initDrawingManager(map);
  }

  saveNewArea() {
    this.isDisabled = true;
    this.loading = true;
    if (this.createNewArea.invalid) {
      this.loading = false;
      this.isDisabled = false;

      return this.notificationSerive.errorNotification(
        "من فضلك تاكد من ادخال البيانات"
      );
    }
    const area = {
      name: this.createNewArea["controls"]["name"].value,
      translation: {
        ar: {
          name: this.createNewArea["controls"]["name_ar"].value
        }
      }
    };

    this.httpAreasService.createNewArea(area, this.city.data._id).subscribe(
      data => {
        this.notificationSerive.successNotification(
          `تم انشاء منطقة جديدة بنجاح`
        );
        this.isDisabled = false;
        this.loading = false;
        this.dialogRef.closeAll();
      },
      err => {
        this.loading = true;
        this.notificationSerive.errorNotification(err.error.message);
      }
    );
  }
}
