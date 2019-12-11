import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../../../shared/services/language/language.service';

@Injectable()
export class CanActivateAdminGuard implements CanActivate {
    status: any;
    constructor(private authService: AuthService, private router: Router, private languageService: LanguageService) {
    }

    canActivate() {
        if (localStorage.getItem('USER_ID') !== undefined) {
            return true;
        } else {
            false;
        }
    }
}