import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  Inject
} from "@angular/core";

import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { CitiesService } from "../../service/cities.service";
import { MapConfigService } from "../../../../shared/services/map/map-config.service";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { FormControl } from "@angular/forms";

// declare const google: any;

@Component({
  selector: "app-add-new-city",
  templateUrl: "./add-new-city.component.html",
  styleUrls: ["./add-new-city.component.scss"]
})
export class AddNewCityComponent implements OnInit {
  loading = false;
  public pipe = new DatePipe("en-US");
  public createCityForm: FormGroup;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  public zoom: number;
  isDisabled = false;
  drawingPaths: any;
  paths = [
    { lat: 0, lng: 10 },
    { lat: 0, lng: 20 },
    { lat: 10, lng: 20 },
    { lat: 10, lng: 10 },
    { lat: 0, lng: 10 }
  ];

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialog,
    private toastr: ToastrService,
    private citiesService: CitiesService,
    private mapConfigService: MapConfigService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createCityForm = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required]
    });
  }

  onMapReady(map) {
    this.mapConfigService.initDrawingManager(map);
  }

  saveNewCity() {
    this.loading = true;
    this.isDisabled = true;
    if (this.createCityForm.invalid) {
      this.loading = false;
      this.isDisabled = false;
      return this.notificationService.errorNotification(
        "من فضلك تاكد من ادخال البيانات"
      );
    }
    const city = {
      name: this.createCityForm["controls"]["name"].value,
      translation: {
        ar: {
          name: this.createCityForm["controls"]["name_ar"].value
        }
      }
    };
    this.citiesService.createNewCity(city).subscribe(
      data => {
        this.notificationService.successNotification(
          `تم انشاء مدينة جديدة بنجاح`
        );
        this.loading = false;
        this.isDisabled = false;
        this.dialogRef.closeAll();
      },
      err => {
        this.loading = false;
        this.isDisabled = false;
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }
}
