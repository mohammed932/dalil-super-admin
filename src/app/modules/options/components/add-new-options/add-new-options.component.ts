import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { HttpOptionsService } from "../../service/httpOptionService.service";

@Component({
  selector: "app-add-new-options",
  templateUrl: "./add-new-options.component.html",
  styleUrls: ["./add-new-options.component.scss"]
})
export class AddNewOptionComponent implements OnInit {
  tags = [
    {
      id: 1,
      name: "شاليهات",
      value: "شاليهات"
    },
    {
      id: 2,
      name: "قاعات",
      value: "قاعات"
    },
    {
      id: 3,
      name: "استراحات",
      value: "استرحات"
    },
    {
      id: 4,
      name: "قاعات افراح",
      value: "قاعات_افراح"
    },
    {
      id: 5,
      name: "خدمات خاصة",
      value: "خدمات_حاصة"
    },
    {
      id: 6,
      name: "ضيافة",
      value: "ضيافة"
    },
    {
      id: 7,
      name: "عروض",
      value: "مخيمات"
    }
  ];
  isDisabled = false;
  public pipe = new DatePipe("en-US");
  public createNewOption: FormGroup;
  image: any;

  loading = false;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  drawingPaths: any;
  cityPaths = [];
  imagePreview: any;

  constructor(
    private fg: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public option: any,
    private toastr: ToastrService,
    // private httpAreasService: HttpAreasService,
    private dialogRef: MatDialog,
    private notificationService: NotificationService,
    private httpOptionService: HttpOptionsService
  ) {}

  ngOnInit() {
    this.createNewOption = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required]
    });
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
  // append the image and backround to formData
  appendImagesToProduct(formData, productData) {
    formData.append("image", this.image);
    formData.append("data", JSON.stringify(productData));
  }

  saveNewOption() {
    this.isDisabled = true;
    this.loading = true;
    const data = {
      name: this.createNewOption["controls"].name.value,
      translation: {
        ar: {
          name: this.createNewOption["controls"].name_ar.value
        }
      }
    };
    if (!this.image) {
      this.notificationService.errorNotification("الصوره مطلوبه");
      this.loading = false;
      this.isDisabled = false;
      return;
    }
    const formData = new FormData();
    this.appendImagesToProduct(formData, data);
    this.httpOptionService.sendNewCategory(formData, this.option._id).subscribe(
      data => {
        if (data.status === 200) {
          this.isDisabled = false;
          this.loading = false;
          this.notificationService.successNotification(
            `تم اضافة الخيار ${data.body["translation"]["ar"]["name"]}`
          );
          this.dialogRef.closeAll();
        }
      },
      err => {
        this.isDisabled = false;
        this.loading = false;
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }
}
