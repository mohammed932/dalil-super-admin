import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { TranslateModule } from '@ngx-translate/core';
import { OffersComponent } from './offers.component';
import { AddOfferComponent } from './add-offer/add-offer.component';

const routes: Routes = [
    {
        path: '',
        component: OffersComponent
    },
    {
        path: 'add-offer',
        component: AddOfferComponent
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
export class OffersRoutingModule { }
