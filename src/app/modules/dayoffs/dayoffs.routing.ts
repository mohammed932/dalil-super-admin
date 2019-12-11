import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { TranslateModule } from '@ngx-translate/core';
import { DayOffsComponent } from './dayoffs.component';


const routes: Routes = [
    {
        path: '',
        component: DayOffsComponent
    },

];

@NgModule({
    imports: [
        TranslateModule,
        LocalizeRouterModule.forChild(routes),
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class DayOffsRoutingModule { }
