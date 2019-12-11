import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class HttpDeliveryService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAllDeliveries(
    page = 0,
    $code = "",
    limit = 10
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("code", $code.toString());
    params = params.append("pagination", "true");
    return this._httpClient.get(`${this.apiUrl}deliveries`, {
      params: params,
      observe: "response"
    });
  }
  createNewDelivery(body) {
    return this._httpClient.post(`${this.apiUrl}deliveries`, body, {
      observe: "response"
    });
  }

  getSingleDelivery(deliveryId) {
    return this._httpClient.get(`${this.apiUrl}deliveries/${deliveryId}`, {
      observe: "response"
    });
  }


  updateDelivery(body, deliveryId) {
    return this._httpClient.put(`${this.apiUrl}deliveries/${deliveryId}`, body, {
      observe: "response"
    });
  }

  deleteDelivery(deliveryId) {
    return this._httpClient.delete(`${this.apiUrl}deliveries/${deliveryId}`, {
      observe: "response"
    });
  }



}
