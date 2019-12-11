import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class HttpOrdersService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAllOrders(
    page = 0,
    $code = "",
    $filter = "",
    limit = 10
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("order_number", $code.toString());
    params = params.append("status", $filter.toString());
    params = params.append("pagination", "true");
    return this._httpClient.get(`${this.apiUrl}orders`, {
      params: params,
      observe: "response"
    });
  }


  getSingleOrder(orderId) {
    return this._httpClient.get(`${this.apiUrl}orders/${orderId}`, {
      observe: "response"
    });
  }



  updateOrderStatus(status, orderId) {
    return this._httpClient.put(`${this.apiUrl}orders/${orderId}`, status, {
      observe: "response"
    })
  }




}
