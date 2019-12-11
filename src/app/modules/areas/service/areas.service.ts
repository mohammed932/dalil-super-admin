import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Area, NewArea } from '../../modals/area.modal';

@Injectable({
  providedIn: 'root'
})
export class HttpAreasService {

  private baseUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAreaForCityFromApi(cityId, page = 0, $search = '', limit = 10): Observable<Area[]> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('limit', limit.toString());
    params = params.append('name', $search);
    params = params.append('pagination', 'true');
    return this._httpClient.get<Area[]>(`${this.baseUrl}cities/${cityId}/areas`, { params: params });
  }


  createNewArea(body, cityId: string): Observable<any> {
    return this._httpClient.post<NewArea>(`${this.baseUrl}cities/${cityId}/areas`, body, {
      observe: 'response'
    });
  }

  // getSingleArea(id: string): Observable<City> {
  //   return this._httpClient.get<City>(`${this.baseUrl}areas/${id}`);
  // }

  deleteArea(cityId, areaId: string): Observable<{ message: string }> {
    return this._httpClient.delete<{ message: string }>(`${this.baseUrl}cities/${cityId}/areas/${areaId}`);
  }

  updateArea(body: any, cityId: string, areaId): Observable<any> {
    return this._httpClient.put<any>(`${this.baseUrl}cities/${cityId}/areas/${areaId}`, body);
  }
}



