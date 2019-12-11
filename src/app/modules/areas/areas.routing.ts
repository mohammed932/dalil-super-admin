import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AreasComponent } from './areas.component';
import { LocalizeRouterModule } from 'localize-router';
import { TranslateModule } from '@ngx-translate/core';


const routes: Routes = [
    {
        path: '',
        component: AreasComponent
    },

];

@NgModule({
    imports: [
        TranslateModule,
        RouterModule.forChild(routes),
        LocalizeRouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class AreasRoutringModule { }
