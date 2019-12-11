import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpDayOffsService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAllClipperServicesFromApi(page = 0, $search = '', limit = 10): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('limit', limit.toString());
    params = params.append('name', $search);
    params = params.append('pagination', 'true');
    return this._httpClient.get(`${this.apiUrl}dayoffs`,
      {
        params: params,
        observe: 'response'
      });
  }

  createNewDayOff(body): Observable<any> {
    return this._httpClient.post(`${this.apiUrl}dayoffs`, body, { observe: 'response' });
  }

  deleteDayOff(dayOffId): Observable<any> {
    return this._httpClient.delete(`${this.apiUrl}dayoffs/${dayOffId}`, {
      observe: 'response'
    });
  }

  getSingleService(serviceId, coordinates): Observable<any> {
    return this._httpClient.get(`${this.apiUrl}categories${serviceId}/${coordinates}`, {
      observe: 'response'
    });
  }
}
