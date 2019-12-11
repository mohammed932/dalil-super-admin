import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class HttpPromotionsService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAllPromotions(
    page = 0,
    $code = "",
    limit = 10
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("code", $code.toString());
    params = params.append("pagination", "true");
    return this._httpClient.get(`${this.apiUrl}promocodes`, {
      params: params,
      observe: "response"
    });
  }

  getSinglePromoCodes(promoCodeId) {
    return this._httpClient.get(`${this.apiUrl}promocodes/${promoCodeId}`, {
      observe: "response"
    });
  }

  checkPromoCodes(promoCodeId) {
    return this._httpClient.get(`${this.apiUrl}promocodes/check/${promoCodeId}`, {
      observe: "response"
    });
  }

  createNewPromoCode(body) {
    return this._httpClient.post(`${this.apiUrl}promocodes`, body, {
      observe: "response"
    });
  }

  updatePromoCode(body, promoCodeId) {
    return this._httpClient.put(`${this.apiUrl}promocodes/${promoCodeId}`, body, {
      observe: "response"
    });
  }

  deletePromoCode(promoCodeId) {
    return this._httpClient.delete(`${this.apiUrl}promocodes/${promoCodeId}`, {
      observe: "response"
    });
  }



}
