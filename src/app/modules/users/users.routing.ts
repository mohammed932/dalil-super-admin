import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { LocalizeRouterModule } from 'localize-router';
import { TranslateModule } from '@ngx-translate/core';


const routes: Routes = [
    {
        path: '',
        component: EmployeesComponent
    },
    {
        path: ':id',
        component: EmployeeDetailsComponent
    }
];

@NgModule({
    imports: [
        TranslateModule,
        LocalizeRouterModule.forChild(routes),
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class UsersRoutringModule { }
