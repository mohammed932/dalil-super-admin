import { Component, OnInit } from "@angular/core";
import { HttpActivityService } from "../../services/configurations.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators
} from "@angular/forms";
import { NotificationService } from "../../../../shared/services/notifications/notification.service";
import { debounceTime, debounce } from "rxjs/operators";
import { timer } from "rxjs";

@Component({
  selector: "app-chalets",
  templateUrl: "./chalets.component.html",
  styleUrls: ["./chalets.component.scss"]
})
export class ChaletsComponent implements OnInit {
  panelOpenState = false;
  cities: any;
  areas: any;
  configurationsForm: FormGroup;
  loading = false;
  selectedOptions = [];
  options: any;
  public threeSixtyImages = {
    0: [
      "https://images.unsplash.com/photo-1534294228306-bd54eb9a7ba8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2000&q=80"
    ]
  };
  categories: any;
  subCategories: Object;
  selectedCategoryObj: any;
  selectedCityObj: any;
  selectedSubCategory: any[];
  selectedOccasions: any[] = [];
  isPool: boolean = false;
  imagePreview: string | ArrayBuffer;
  occasions: any;
  center: any = {
    lat: 30.044281,
    lng: 31.340002
  };
  isDisabled = false;
  locationValues = [];
  categoryId: string;
  cityId: string;
  occasionsForm = new FormControl(["", Validators.required]);
  subCategoryForm = new FormControl(["", Validators.required]);
  optionArray: FormArray;
  categoryItem: any;
  pool_desc: string = "";
  pool_desc_ar: string = "";
  departments_count: number = 0;
  capacity: number = 1;
  isPoolExistBool: boolean = false;
  isCapacity: boolean = false;
  submitted = false;
  error = {
    name: false,
    name_ar: false,
    capacity: false,
    description: false,
    description_ar: false,
    special_conditions_ar: false,
    special_conditions: false,
    price: false
  };
  urlsImages: any[] = [];
  urlsPanoramaFiles: any[] = [];
  urls: any[] = [];
  urlsPanorama: any[] = [];
  constructor(
    private httpActivityService: HttpActivityService,
    private fg: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.configurationsForm = this.fg.group({
      name: ["", Validators.required],
      name_ar: ["", Validators.required],
      price: ["", Validators.required],
      category: [""],
      sub_category: [this.fg.array([])],
      capacity: [""],
      description: ["", Validators.required],
      description_ar: ["", Validators.required],
      location: [""],
      logo: [""],
      email: [""],
      images: [""],
      panoramic_images: [""],
      city: ["", Validators.required],
      area: ["", Validators.required],
      pool_exist: [""],
      special_conditions_ar: [""],
      special_conditions: [""],
      pool_desc: [""],
      pool_desc_ar: [""],
      options: new FormArray([])
    });
    this.initFun();
  }

  selectMarker(event) {
    this.locationValues = [event.coords.lng, event.coords.lat];
  }

  get f() {
    return this.configurationsForm.controls;
  }
  get subCate() {
    return this.subCategoryForm;
  }

  getOptions(event) {
    this.categoryId = event.value._id;
    console.log(this.categoryId, event.value._id);
    this.httpActivityService
      .getOptionForCategory(event.value._id)
      .subscribe(data => {
        this.options = data.body;
      });

    this.httpActivityService.getSubCategories(event.value._id).subscribe(
      data => {
        if (data.status === 200) {
          this.subCategories = data.body;
          console.log(this.subCategories);
        }
      },
      err => {
        console.log(err);
      }
    );

    // remove options array
    let optionArray: FormArray = this.getOptionFormArray();
    this.clearFormArray(optionArray);
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
    this.configurationsForm.patchValue({ logo: file });
    this.configurationsForm.get("logo").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  getCities() {
    this.httpActivityService.getAllCities().subscribe(
      data => {
        if (data.status === 200) {
          this.cities = data["body"];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getCategories() {
    this.httpActivityService.getCategories().subscribe(
      data => {
        if (data.status === 200) {
          console.log(data);
          this.categories = data["body"];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getOccasion() {
    this.httpActivityService.getOccasions().subscribe((data: any) => {
      this.occasions = data;
    });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        let reader = new FileReader();
        this.urlsImages.push(event.target.files[i]);
        reader.onload = (event: any) => {
          this.urls.push(event.target.result);
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  removeImg(index) {
    console.log(index);
    this.urls.splice(index, 1);
  }
  removePanorama(index) {
    this.urlsPanorama.splice(index, 1);
  }

  onSelectPanoramaFile(event) {
    console.log(event.target.files);
    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;

      if (filesAmount <= 3 && this.urlsPanorama.length < 3) {
        for (let i = 0; i < filesAmount; i++) {
          this.urlsPanoramaFiles.push(event.target.files[i]);
          let reader = new FileReader();
          reader.onload = (event: any) => {
            this.urlsPanorama.push(event.target.result);
          };
          reader.readAsDataURL(event.target.files[i]);
        }
      } else {
        // @Todo Notification message
        this.notificationService.errorNotification(
          "من فضلك الصور 360 المسموح بيها حد اقصى 3 صور"
        );
      }
    }
  }

  isPoolExist(event) {
    if (event.target.value === "true") {
      this.isPoolExistBool = true;
    } else {
      console.log("else is pool exist");
      this.isPoolExistBool = false;
      console.log("else is pool exist");
    }
    // this.configurationsForm.controls.pool_exist.setValue(this.isPool);
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== "undefined" && typeof objTwo !== "undefined") {
      return objOne._id === objTwo._id;
    }
  }

  compareWithFn(item1, item2) {
    return item1 && item2 ? item1._id === item2._id : item1 === item2;
  }

  equalsOptions(objOne, objTwo) {
    if (typeof objOne !== "undefined" && typeof objTwo !== "undefined") {
      return objOne === objTwo;
    }
  }

  selectedCity(event) {
    this.areas = [];
    this.configurationsForm.controls.area.setValue("");
    this.cityId = event.target.value;
    this.httpActivityService
      .getCityAreas(event.target.value)
      .subscribe(data => {
        if (data.status === 200) {
          this.areas = data["body"];
        }
      });
  }

  selectCategory(event) {}

  initFun() {
    this.getCities();
    this.getCategories();
    this.getOccasion();
  }

  getCategory() {
    const category = this.categories.find(
      category => this.categoryItem._id == category._id
    );
    console.log(category);
    return category._id;
  }

  getUploadedImages(formData) {
    for (var i = 0; i < this.urlsImages.length; i++) {
      console.log("images url", this.urlsImages[i]);
      formData.append("images", this.urlsImages[i]);
    }
    return formData;
  }
  getUploadedPanoramaImages(formData) {
    for (var i = 0; i < this.urlsPanoramaFiles.length; i++) {
      formData.append("panoramic_images", this.urlsPanoramaFiles[i]);
    }
    return formData;
  }
  appendImagesToActivity(formData, activityData) {
    this.getUploadedImages(formData);
    this.getUploadedPanoramaImages(formData);
    formData.append("data", JSON.stringify(activityData));
    return formData;
  }

  initialCarsForm(optionId): FormGroup {
    return this.fg.group({
      optionId: optionId,
      value: "",
      value_ar: ""
    });
  }

  getOptionFormArray() {
    return this.configurationsForm.get("options") as FormArray;
  }

  onAddNewOption(optionId) {
    this.optionArray = this.getOptionFormArray();
    this.optionArray.push(this.initialCarsForm(optionId));
  }

  // setCarsNumbers(carsData) {
  //   this.optionArray = this.getOptionFormArray();
  //   for (let i = 0; i < carsData.length; i++) {
  //     this.optionArray.push(this.fg.group({
  //       value: carsData[i].model,
  //       value_ar: carsData[i].number
  //     }))
  //   }
  // }
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };
  removeOption(index) {
    let optionArray: FormArray = this.getOptionFormArray();
    optionArray.removeAt(index);
  }
  onSelectCategory(event) {
    let optionId = event.source.value._id;
    if (event.source._selected) {
      this.onAddNewOption(optionId);
    } else {
      const options = this.configurationsForm.value.options;
      let index = options.findIndex(
        option => option._id === event.source.value._id
      );
      this.removeOption(index);
    }
    console.log(this.configurationsForm.value);
  }

  validateArText(value: string, formControlName) {
    const lastCharAr = value.substr(value.length - 1);
    const regExp = "^[\u0621-\u064A\u0660-\u0669s0-9 ]+$";
    if (!new RegExp(regExp).test(lastCharAr)) {
      value = value.substr(0, value.length - 1);
      this.error[`${formControlName}`] = true;

      this.configurationsForm.controls[`${formControlName}`].setValue(value);
    } else {
      this.error[`${formControlName}`] = false;
    }
  }

  validateEnText(value: string, formControlName) {
    const lastCharAr = value.substr(value.length - 1);
    const regExp = "^[A-Za-z-s0-9 ]";
    if (!new RegExp(regExp).test(lastCharAr)) {
      value = value.substr(0, value.length - 1);
      this.error[`${formControlName}`] = true;
      this.configurationsForm.controls[`${formControlName}`].setValue(value);
    } else {
      this.error[`${formControlName}`] = false;
    }
  }

  validateNumbersOnly(value: string, formControlName) {
    const lastCharAr = value.substr(value.length - 1);
    const regExp = "^[0-9]*$";
    if (!new RegExp(regExp).test(lastCharAr)) {
      value = value.substr(0, value.length - 1);
      this.error[`${formControlName}`] = true;
      this.configurationsForm.controls[`${formControlName}`].setValue(value);
    } else {
      this.error[`${formControlName}`] = false;
    }
  }

  createBackendSchema() {
    const activityData = {
      name: this.configurationsForm.controls.name.value,
      price: parseInt(this.configurationsForm.controls.price.value),
      category: this.getCategory(),
      sub_category: this.selectedSubCategory,
      location: [...this.locationValues],
      city: this.configurationsForm.controls.city.value,
      area: this.configurationsForm.controls.area.value,
      special_conditions: this.configurationsForm.controls.special_conditions
        .value,
      occasions: this.selectedOccasions,
      description: this.configurationsForm.controls.description.value,
      options: this.createOptions(),
      capacity: this.capacity,
      translation: {
        ar: {
          name: this.configurationsForm.controls.name_ar.value,
          description: this.configurationsForm.controls.description_ar.value,
          special_conditions: this.configurationsForm.controls
            .special_conditions_ar.value
        }
      }
    };

    return activityData;
  }

  createOptions() {
    let options = [];
    let existOptions = this.configurationsForm.value.options;
    options = existOptions.map(option => ({
      option: option.optionId,
      value: option.value,
      translation: {
        ar: {
          value: option.value_ar
        }
      }
    }));
    return options;
    // for (let index = 0; index < existOptions.length; index++) {
    //   let option = {
    //     option: '',
    //     value: '',
    //     translation: {
    //       ar: {
    //         value: ''
    //       }
    //     }
    //   };
    //   const element = existOptions[index];
    //   option['option'] = element.optionId;
    //   option['value'] = element.value;
    //   option['translation']['ar']['value'] = element.value_ar;
    //   options.push(option);
    // };
    // return options;
  }

  imuttubleActivityObj(activityData, urguments) {
    for (let index = 0; index < urguments.length; index++) {
      const element = urguments[index];
      if (element.lang !== "ar") {
        activityData[`${element["key"]}`] = element.value;
      } else if (element.lang === "both") {
        if (element.key !== "capacity" || element.key !== "departments_count") {
          activityData[`${element["key"]}`] = element.value;
          activityData.translation.ar[`${element["key"]}`] = element.value;
        } else {
          console.log("else");
          activityData[`${element["key"]}`] = parseInt(element.value);
          activityData.translation.ar[`${element["key"]}`] = parseInt(
            element.value
          );
        }
      } else {
        activityData.translation.ar[`${element["key"]}`] = element.value;
      }
    }
    return activityData;
  }
  onSubmit() {
    this.loading = true;
    this.submitted = true;
    this.isDisabled = true;
    if (!this.categoryId) {
      this.notificationService.errorNotification("من فضلك اختار فئة");
      this.isDisabled = false;
      return;
    }
    if (this.urls.length < 5) {
      this.notificationService.errorNotification(
        "من فضلك ادخل حد ادنى 5 من الصور"
      );
      this.loading = false;
      this.isDisabled = false;
      return;
    }
    // stop here if form is invalid
    if (this.configurationsForm.invalid) {
      this.loading = false;
      this.isDisabled = false;
      return;
    }

    const backEndData = this.createBackendSchema();
    if (
      this.categoryItem.translation.ar.name === "شاليه" ||
      this.categoryItem.translation.ar.name === "استراحات"
    ) {
      this.imuttubleActivityObj(backEndData, [
        {
          lang: "en",
          key: "pool_desc",
          value: this.pool_desc
        },
        {
          lang: "both",
          key: "pool_exist",
          value: this.isPoolExistBool
        },
        {
          lang: "ar",
          key: "pool_desc",
          value: this.pool_desc_ar
        },
        {
          lang: "en",
          key: "capacity",
          value: this.capacity
        }
      ]);
      console.log("category tag is ", this.categoryItem.tag);
      if (
        this.categoryItem.translation.tag === "ضيافة" ||
        this.categoryItem.tag === "خدمات_خاصة"
      ) {
        this.imuttubleActivityObj(backEndData, [
          {
            lang: "en",
            key: "capacity",
            value: 1
          }
        ]);
      }

      if (this.isPoolExistBool && (!this.pool_desc || !this.pool_desc_ar)) {
        this.notificationService.errorNotification(
          "من فضلك ادخل تفاصيل المسبح"
        );
        this.loading = false;
        this.isDisabled = false;
        return;
      }
    }

    if (this.categoryItem.translation.ar.name === "استراحات") {
      this.imuttubleActivityObj(backEndData, [
        {
          lang: "both",
          key: "departments_count",
          value: this.departments_count
        }
      ]);
    }
    const formData = new FormData();
    this.appendImagesToActivity(formData, backEndData);
    console.log(backEndData);
    this.httpActivityService
      .createProperty(formData)
      .pipe(debounce(() => timer(1000)))
      .subscribe(
        data => {
          console.log(data);
          this.notificationService.successNotification(
            `تم إضافة النشاط ${this.configurationsForm.controls.name_ar.value}`
          );
          this.loading = false;
          this.isDisabled = false;
        },
        err => {
          this.notificationService.errorNotification(err.error.message);
          this.loading = false;
          this.isDisabled = false;
        }
      );
  }
}
