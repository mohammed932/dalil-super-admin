import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { MapConfigService } from "../../../../shared/services/map/map-config.service";
import { HttpAreasService } from "../../service/areas.service";

@Component({
  selector: "app-edit-area",
  templateUrl: "./edit-area.component.html",
  styleUrls: [
    "./edit-area.component.scss",
    "../add-new-city/add-new-city.component.scss"
  ]
})
export class EditAreaComponent implements OnInit {
  public editCityForm: FormGroup;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  isDisabled = false;
  drawingPaths: any;
  areaPaths = {};
  cityPaths = {};
  finalPaths: any = [];
  loading = false;
  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpAreaService: HttpAreasService,
    private notificationService: NotificationService,
    private mapConfigService: MapConfigService,
    private dialogRef: MatDialog
  ) {}

  ngOnInit() {
    this.editCityForm = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required]
    });

    this.setCurrentCityData();
  }

  setCurrentCityData() {
    this.editCityForm["controls"]["name"].setValue(this.data.area.name);
    this.editCityForm["controls"]["name_ar"].setValue(
      this.data.area.translation.ar.name
    );
  }

  updateArea() {
    this.isDisabled = true;
    this.loading = true;
    // is updated but the area has invalid form or the finals paths doesn't come from the backend;
    if (this.editCityForm.invalid) {
      this.loading = false;
      this.notificationService.errorNotification("Please enter correct data");
      return;
    }
    const city = {
      name: this.editCityForm["controls"]["name"].value,
      translation: {
        ar: {
          name: this.editCityForm["controls"]["name_ar"].value
        }
      }
    };
    this.httpAreaService
      .updateArea(city, this.data.city._id, this.data.area._id)
      .subscribe(
        data => {
          this.notificationService.successNotification(
            `${data.name} is updated`
          );
          this.loading = false;
          this.dialogRef.closeAll();
          this.isDisabled = false;
        },
        err => {
          if (err.error) {
            this.loading = false;
            this.isDisabled = false;
            this.notificationService.errorNotification(`${err.error.message}`);
          }
        }
      );
  }
}
