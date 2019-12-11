import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { CitiesService } from "../../service/cities.service";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { MapConfigService } from "../../../../shared/services/map/map-config.service";

@Component({
  selector: "app-edit-city",
  templateUrl: "./edit-city.component.html",
  styleUrls: [
    "./edit-city.component.scss",
    "../add-new-city/add-new-city.component.scss"
  ]
})
export class EditCityComponent implements OnInit {
  public editCityForm: FormGroup;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  isDisabled = false;
  drawingPaths: any;
  cityPaths = [];
  cityPolyganOptions = {
    strokeColor: "#083478",
    fillColor: "#0c2461",
    strokeWeight: "4",
    fillOpacity: "0.5"
  };
  loading = false;
  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public city: any,
    private notificationService: NotificationService,
    private dialogRef: MatDialog,
    private cityService: CitiesService,
    private mapConfigService: MapConfigService
  ) {}

  ngOnInit() {
    this.editCityForm = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required]
    });

    this.setCurrentCityData();
  }
  setCurrentCityData() {
    this.editCityForm["controls"]["name"].setValue(this.city.data.name);
    this.editCityForm["controls"]["name_ar"].setValue(
      this.city.data.translation.ar.name
    );
  }
  editCity() {
    this.loading = true;
    this.isDisabled = true;
    let finalPaths = [];
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

    this.cityService.updateCity(city, this.city.data._id).subscribe(
      data => {
        this.loading = false;
        this.notificationService.successNotification(`${data.name} is updated`);
        this.dialogRef.closeAll();
        this.isDisabled = false;
      },
      err => {
        this.loading = false;
        this.isDisabled = false;
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }
}
