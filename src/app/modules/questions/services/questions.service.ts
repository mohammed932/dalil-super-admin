import { Injectable } from "@angular/core";

import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class HttpQuestionService {
  private apiUrl = environment.base_url;
  constructor(private _httpClient: HttpClient) { }

  getAllQuestions(
  ): Observable<any> {
    // let params = new HttpParams();
    // params = params.append("page", page.toString());
    // params = params.append("limit", limit.toString());
    // params = params.append("code", $code.toString());
    // params = params.append("pagination", "true");
    return this._httpClient.get(`${this.apiUrl}questions`, {
      // params: params,
      observe: "response"
    });
  }

  createNewQuestion(body) {
    return this._httpClient.post(`${this.apiUrl}questions`, body, {
      observe: "response"
    });
  }

  updateQuestion(body, questionId) {
    return this._httpClient.put(`${this.apiUrl}questions/${questionId}`, body, {
      observe: "response"
    });
  }

  deleteQuestion(questionId) {
    return this._httpClient.delete(`${this.apiUrl}questions/${questionId}`, {
      observe: "response"
    });
  }

}
