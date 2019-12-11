import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { TranslateModule } from '@ngx-translate/core';
import { QuestionsComponent } from './questions.component';
const routes: Routes = [
    {
        path: '',
        component: QuestionsComponent
    },

];

@NgModule({
    imports: [
        TranslateModule,
        LocalizeRouterModule.forChild(routes),
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class QuestionsRoutingModule { }
