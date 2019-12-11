import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class HttpOccationsService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAllOccations(
    page = 0,
    $search = "",
    limit = 10
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("name", $search.toString());
    params = params.append("pagination", "true");
    return this._httpClient.get(`${this.apiUrl}occasions`, {
      params: params,
      observe: "response"
    });
  }



  // accept to send reject or accept status
  sendNewOccation(body) {
    return this._httpClient.post(`${this.apiUrl}occasions`, body, {
      observe: "response"
    });
  }

  updateOccasion(body, occasionId) {
    return this._httpClient.put(`${this.apiUrl}occasions/${occasionId}`, body, {
      observe: "response"
    });
  }


  deleteOccasion(occasionId) {
    return this._httpClient.delete(`${this.apiUrl}occasions/${occasionId}`, {
      observe: "response"
    });
  }

}
