import { Component, OnInit } from '@angular/core';
import { HttpSettingsService } from './services/settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/services/notifications/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settingForm: FormGroup;
  settings: Object;
  loading = false;
  isDisabled = false;
  constructor(
    private fg: FormBuilder,
    private httpSettingService: HttpSettingsService,
    private notifcationService: NotificationService
  ) { }

  ngOnInit() {
    this.settingForm = this.fg.group({
      about_us: ['', Validators.required],
      about_us_ar: ['', Validators.required],
      support_number: ['', Validators.required],
      rules_of_property_owners: ['', Validators.required],
      rules_of_property_owners_ar: ['', Validators.required],
      rules_of_customers: ['', Validators.required],
      rules_of_customers_ar: ['', Validators.required],
      facebook: ['', Validators.required],
      twitter: ['', Validators.required],
      instagram: ['', Validators.required],

    })
    this.httpSettingService.getSettings().subscribe(data => {
      this.settings = data.body;
      this.setFormData(this.settings);
    });
  }
  setFormData(settings) {
    this.settingForm.controls.about_us.setValue(settings['about_us']);
    this.settingForm.controls.about_us_ar.setValue(settings['translation']['ar']['about_us']);
    this.settingForm.controls.rules_of_property_owners.setValue(settings['rules_of_property_owners']);
    this.settingForm.controls.support_number.setValue(settings['support_number']);
    this.settingForm.controls.rules_of_property_owners_ar.setValue(settings['translation']['ar']['rules_of_property_owners']);
    this.settingForm.controls.rules_of_customers.setValue(settings['rules_of_customers']);
    this.settingForm.controls.rules_of_customers_ar.setValue(settings['translation']['ar']['rules_of_customers']);
   
    this.settingForm.controls.facebook.setValue(settings['facebook']);
    this.settingForm.controls.twitter.setValue(settings['twitter']);
    this.settingForm.controls.instagram.setValue(settings['instagram']);

  }
  onSubmit() {
    this.loading = true;
    this.isDisabled = true;

    if (this.settingForm.invalid) {
      this.loading = false;
      this.isDisabled = false;
      this.notifcationService.errorNotification('من فضلك تاكد من كتابه المعلومات');
      return
    }
    const data = {
      "about_us": this.settingForm.controls.about_us.value,
      "support_number": this.settingForm.controls.support_number.value,
      "rules_of_property_owners": this.settingForm.controls.rules_of_property_owners.value,
      "rules_of_customers": this.settingForm.controls.rules_of_customers.value,
      "facebook": this.settingForm.controls.facebook.value,
      "instagram": this.settingForm.controls.instagram.value,
      "twitter": this.settingForm.controls.twitter.value,
      "translation": {
        "ar": {
          "about_us": this.settingForm.controls.about_us.value,
          "rules_of_property_owners": this.settingForm.controls.rules_of_property_owners_ar.value,
          "rules_of_customers": this.settingForm.controls.rules_of_customers_ar.value

        }
      }
    }

    this.httpSettingService.updateSettings(data).subscribe(data => {
      if (data.status === 200) {
        this.loading = false;
        this.isDisabled = false;
        this.notifcationService.successNotification('تم التعديل بنجاح')
      }
    }, err => {
      this.loading = false;
      this.isDisabled = false;
      this.notifcationService.errorNotification(err.errors.message);
    })
  }

}
