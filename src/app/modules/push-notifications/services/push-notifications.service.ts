import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class HttpPushNotificationService {
  private apiUrl = environment.base_url;
  constructor(private httpClient: HttpClient) {}

  createPushNotification(body) {
    return this.httpClient.post(`${this.apiUrl}notifications`, body, {
      observe: "response"
    });
  }
}
