import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { TranslateModule } from '@ngx-translate/core';
import { UpdateActivityFormComponent } from './components/update-activity-form/update-activity-form.component';
import { ActivitiesOwnersComponent } from './activites-owners.component';


const routes: Routes = [
    {
        path: '',
        component: ActivitiesOwnersComponent
    },
    {
        path: 'update-activity/:id',
        component: UpdateActivityFormComponent
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
export class ActivitiesOwnersRoutingModule { }
