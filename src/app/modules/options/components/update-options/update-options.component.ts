import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpOptionsService } from "../../service/httpOptionService.service";

@Component({
  selector: "app-update-options",
  templateUrl: "./update-options.component.html",
  styleUrls: ["./update-options.component.scss"]
})
export class UpdateOptionsComponent implements OnInit {
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
  imagePreview: string | ArrayBuffer;
  image: File;

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public category: any,
    private toastr: ToastrService,
    // private httpAreasService: HttpAreasService,
    private dialogRef: MatDialog,
    private notificationSerive: NotificationService,
    private httpOptionService: HttpOptionsService
  ) {}

  ngOnInit() {
    this.updateCategory = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required]
    });
    this.setCategoryName();
  }

  setCategoryName() {
    this.updateCategory["controls"].name.setValue(this.category.item.name);
    this.updateCategory["controls"].name_ar.setValue(
      this.category.item.translation.ar.name
    );
    this.imagePreview = this.category.item.image;
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return this.notificationSerive.errorNotification(
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
      name: this.updateCategory["controls"].name.value,
      translation: {
        ar: {
          name: this.updateCategory["controls"].name_ar.value
        }
      }
    };
    if (this.updateCategory.invalid) {
      this.notificationSerive.errorNotification("Please enter correct data");
      this.isDisabled = false;
      this.loading = false;
      return;
    }

    const formData = new FormData();
    this.appendImage(formData, data);

    this.httpOptionService
      .updateOption(
        formData,
        this.category.category._id,
        this.category.item._id
      )
      .subscribe(
        data => {
          if (data.status === 200) {
            this.notificationSerive.successNotification(
              `تم تعديل الخيار بنجاح`
            );
            this.dialogRef.closeAll();
            this.isDisabled = false;
            this.loading = false;
          }
        },
        err => {
          this.notificationSerive.errorNotification(err.error.message);
          this.isDisabled = false;
          this.loading = false;
        }
      );
  }
}
