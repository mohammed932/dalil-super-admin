import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { NotificationsRoutingModule } from "./push-notifications.routing";
import { PushNotificationsComponent } from "./push-notifications.component";

@NgModule({
  imports: [CommonModule, SharedModule, NotificationsRoutingModule],
  declarations: [PushNotificationsComponent]
})
export class NotificationsModule {}
