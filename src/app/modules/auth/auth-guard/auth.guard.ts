import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../../../shared/services/language/language.service';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {
    status: any;
    constructor(private authService: AuthService, private router: Router, private languageService: LanguageService) {
    }
    handleGuard() {
        const token = localStorage.getItem('dalelToken');
        return token !== null ? true : this.router.navigateByUrl(`${localStorage.getItem('language')}/auth/login`);
    }

    canActivate() {
        return this.handleGuard();
    }
}