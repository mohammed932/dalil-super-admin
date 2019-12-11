import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { LoginComponent } from './login/login.component';
import { VerfiyCodeComponent } from './verfiy-code/verfiy-code.component';
import { NavigationService } from '../../shared/router.animations.service';
import { AuthComponent } from './auth.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    VerfiyCodeComponent
  ],
  exports: [
  ],
  providers: [
    NavigationService
  ]

})

export class AuthModule { }