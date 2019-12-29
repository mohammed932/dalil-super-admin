import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotificationService } from "../../shared/services/notifications/notification.service";
import { HttpPushNotificationService } from "./services/push-notifications.service";

@Component({
  selector: "app-push-notification",
  templateUrl: "./push-notifications.component.html",
  styleUrls: ["./push-notifications.component.scss"]
})
export class PushNotificationsComponent implements OnInit {
  notificationForm: FormGroup;
  settings: Object;
  loading = false;
  isDisabled = false;
  constructor(
    private fg: FormBuilder,
    private httpNotificationService: HttpPushNotificationService,
    private notifcationService: NotificationService
  ) {}

  ngOnInit() {
    this.notificationForm = this.fg.group({
      message: ["", Validators.required],
      message_ar: ["", Validators.required],
      title: ["", Validators.required],
      title_ar: ["", Validators.required]
    });
  }

  onSubmit() {
    this.loading = true;
    this.isDisabled = true;
    if (this.notificationForm.invalid) {
      this.loading = false;
      this.isDisabled = false;
      this.notifcationService.errorNotification(
        "من فضلك تاكد من كتابه المعلومات"
      );
      return;
    }
    const data = {
      title: this.notificationForm.controls.title.value,
      message: this.notificationForm.controls.message.value,
      translation: {
        ar: {
          title: this.notificationForm.controls.title_ar.value,
          message: this.notificationForm.controls.message_ar.value
        }
      }
    };
    console.log("data is :", data);
    this.httpNotificationService.createPushNotification(data).subscribe(
      data => {
        if (data.status === 200) {
          this.loading = false;
          this.isDisabled = false;
          this.notifcationService.successNotification("تم ارسال الاشعار بنجاح");
        }
      },
      err => {
        this.loading = false;
        this.isDisabled = false;
        this.notifcationService.errorNotification(err.errors.message);
      }
    );
  }
}
