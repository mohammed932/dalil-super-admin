import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable, from } from "rxjs";
import { City, NewCity } from "../../modals/city.modal";
import { FormGroup } from "@angular/forms";
import { MapConfigService } from "../../../shared/services/map/map-config.service";
import { NotificationService } from "../../../shared/services/notifications/notification.service";

@Injectable({
  providedIn: "root"
})
export class CitiesService {
  private baseUrl = environment.base_url;
  constructor(
    private _httpClient: HttpClient,
    private mapConfigService: MapConfigService,
    private notificationService: NotificationService
  ) {}

  getAllCities(page = 0, $search = "", limit = 10): Observable<any> {
    let params = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("limit", limit.toString());
    params = params.append("name", $search);
    params = params.append("pagination", "true");
    return this._httpClient.get<any>(`${this.baseUrl}cities`, {
      params: params
    });
  }

  createNewCity(body): Observable<any> {
    return this._httpClient.post<NewCity>(`${this.baseUrl}cities`, body, {
      observe: "response"
    });
  }

  getSingleCity(id: string): Observable<City> {
    return this._httpClient.get<City>(`${this.baseUrl}cities/${id}`);
  }

  deleteCity(id: string): Observable<{ message: string }> {
    return this._httpClient.delete<{ message: string }>(
      `${this.baseUrl}cities/${id}`
    );
  }

  updateCity(body: any, id: string): Observable<City> {
    return this._httpClient.put<City>(`${this.baseUrl}cities/${id}`, body);
  }

  sendUpdatedCity(loading: boolean, cityPaths: any, form: FormGroup, cityData) {
    loading = true;
    let finalPaths = [];

    // check if the end user draw new polygan and has coordinates is less than 3 or the form is invalid so return error notification
    if (
      this.mapConfigService.getFinalCoordinates().length < 3 ||
      form.invalid
    ) {
      loading = false;
      this.notificationService.errorNotification("Please enter correct data");
      return;
    }
    // if he didn't update the polygan so we checked first if he draw or not and if not so the final path will be the exist city coordinates
    if (
      this.mapConfigService.getFinalCoordinates().length === 0 ||
      this.mapConfigService.getFinalCoordinates() === undefined
    ) {
      finalPaths = [...cityData.data.location.coordinates[0]];
    }
    // if he draw a new polygan so updated the finalpaths to be the final coordinates that updated
    if (this.mapConfigService.getFinalCoordinates().length > 3) {
      finalPaths = [...this.mapConfigService.getFinalCoordinates()];
    }

    const city = {
      name: form["controls"]["name"].value,
      translation: {
        ar: {
          name: form["controls"]["name_ar"].value
        }
      },
      location: [...finalPaths]
    };

    this.updateCity(city, cityData.data._id).subscribe(
      data => {
        loading = false;
        this.notificationService.successNotification(`${data.name} is updated`);
        cityPaths = this.mapConfigService.getExistCoordinates(data);
      },
      err => {
        loading = false;
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }
}
