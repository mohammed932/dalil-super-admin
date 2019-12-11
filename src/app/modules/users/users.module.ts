import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { UsersRoutringModule } from './users.routing';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        UsersRoutringModule
    ],
    declarations: [EmployeesComponent, EmployeeDetailsComponent]
})
export class UsersModule { }
