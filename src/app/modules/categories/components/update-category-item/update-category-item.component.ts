import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpCategoriesService } from "../../service/categories.service";
@Component({
  selector: "app-update-category-item",
  templateUrl: "./update-category-item.component.html",
  styleUrls: [
    "./update-category-item.component.scss",
    "../add-new-category-item/add-new-category-item.component.scss"
  ]
})
export class UpdateCategoryItemComponent implements OnInit, AfterViewInit {
  public pipe = new DatePipe("en-US");
  public updateCategoryItem: FormGroup;
  loading = false;
  displayIogo = false;
  displayLogoActive = false;
  logo: any;
  logo_active: any;

  logoData: any;
  active_logo_Data: any;
  isDisabled = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  drawingPaths: any;
  cityPaths = [];
  imagePreview: any;
  image: File;

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private dialogRef: MatDialog,
    private notificationService: NotificationService,
    private httpCategoryService: HttpCategoriesService
  ) {}

  ngOnInit() {
    this.updateCategoryItem = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required]
    });
    this.setCategoryName();
  }

  setCategoryName() {
    this.updateCategoryItem["controls"].name.setValue(this.data.items.name);
    this.updateCategoryItem["controls"].name_ar.setValue(
      this.data.items.translation.ar.name
    );
    this.imagePreview = this.data.items.image;
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return this.notificationService.errorNotification(
        "This file is not supported, please upload image"
      );
    }
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  appendImage(formData, data) {
    formData.append("image", this.image);
    formData.append("data", JSON.stringify(data));
    return formData;
  }

  sendUpdatedCategory() {
    this.isDisabled = true;
    this.loading = true;
    const data = {
      name: this.updateCategoryItem["controls"].name.value,
      translation: {
        ar: {
          name: this.updateCategoryItem["controls"].name_ar.value
        }
      }
    };

    const formData = new FormData();
    this.appendImage(formData, data);

    this.httpCategoryService
      .updateCategoryItems(
        formData,
        this.data.category._id,
        this.data.items._id
      )
      .subscribe(
        data => {
          if (data.status === 200) {
            this.notificationService.successNotification(
              `تم تعديل التصنيفات الفرعيه بنجاح`
            );
            this.dialogRef.closeAll();
            this.isDisabled = false;
            this.loading = false;
          }
        },
        err => {
          this.isDisabled = false;
          this.loading = false;
          this.notificationService.errorNotification(err.error.message);
        }
      );
  }

  ngAfterViewInit() {}
}
