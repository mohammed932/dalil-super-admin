import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { LanguageService } from '../../../shared/services/language/language.service';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private baseUrl: string = environment.base_url;
  private token: string;
  public tokenSubjectSource = new BehaviorSubject<string>('');
  public tokenSubjectData = this.tokenSubjectSource.asObservable();
  public isLogoutSubject = new BehaviorSubject<boolean>(false);
  public isLogoutState = this.isLogoutSubject.asObservable();

  public isUserOperationSource = new BehaviorSubject<boolean>(false);
  public isUserOperationState = this.isUserOperationSource.asObservable();
  constructor(
    private http: HttpClient,
    private router: Router,
    private languageService: LanguageService
  ) { }

  public saveToken(token: string): void {
    localStorage.setItem("dalelToken", token);
    this.tokenSubjectSource.next(token);
    this.token = token;
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("dalelToken");
    }
    return this.token;
  }

  public getUserIdWhenLoginIn(): string {
    return localStorage.getItem('USER_ID');
  }

  public getUserPhoneNumber(): string {
    return localStorage.getItem('userPhoneNumber');
  }

  public saveUserId(userId) {
    localStorage.setItem('USER_ID', userId);
  }

  public saveUserPhoneNumber(phoneNumber) {
    localStorage.setItem('userPhoneNumber', phoneNumber);
  }

  public saveUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
  }

  public geUserId() {
    const USER_ID = localStorage.getItem('USER_ID');
    return USER_ID
  }


  public logOut() {
    localStorage.removeItem('mobile_token');
    localStorage.removeItem('userPhoneNumber');
    localStorage.removeItem('USER_ID');
    localStorage.setItem('dalelToken', null);
    localStorage.removeItem('userData');
    this.router.navigate([`/${this.languageService.lastLocale}`]);
  }



  public logout(): void {
    this.token = "";
    localStorage.removeItem("dalelToken");
  }


  public login($userCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}login`, $userCredentials, {
      observe: "response",
    });
  }

  public varifyCode($code): Observable<any> {
    return this.http.post(`${this.baseUrl}verify`, $code, {
      observe: "response",
    });
  }

  isLoggedIn() {
    return true;
  }

  // public requestResetCode($email): Observable<any> {
  //   return this.http.post(`${this.resetBaseUrl}/email`, $email, {
  //     observe: "response",
  //   });
  // }

  // public checkResetCode($code): Observable<any> {
  //   return this.http.post(`${this.resetBaseUrl}/code`, $code, {
  //     observe: "response"
  //   });
  // }

  // public resetPassword($newPassword): Observable<any> {
  //   return this.http.post(`${this.resetBaseUrl}/reset`, $newPassword, {
  //     observe: "response"
  //   });
  // }
}
