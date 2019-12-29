import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserlayoutComponent } from "./core/userlayout/userlayout.component";
import { CanActivateViaAuthGuard } from "./modules/auth/auth-guard/auth.guard";
import { CanActivateAdminGuard } from "./modules/auth/auth-guard/adminAuth.guard";

export const routes: Routes = [
  {
    path: "",
    component: UserlayoutComponent,
    canActivate: [CanActivateViaAuthGuard],
    children: [
      // {
      //   path: "",
      //   loadChildren: "./modules/dashboard/dashboard.module#DashBoardModule",
      //   pathMatch: "full"
      // },
      {
        path: "options",
        loadChildren: "./modules/options/options.module#OptionsModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "",
        loadChildren: "./modules/areas/areas.module#AreasModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "activities-owners",
        loadChildren:
          "./modules/activites-owners/activites-owners.module#ActivitiesOwnersModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "activities",
        loadChildren: "./modules/activites/activites.module#ActivitiesModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "occations",
        loadChildren: "./modules/occations/occation.module#OccationModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "dayoffs",
        loadChildren: "./modules/dayoffs/dayoffs.module#DayOffsModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "configurations",
        loadChildren:
          "./modules/configurations/configurations.module#ConfigurationsModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "products",
        loadChildren: "./modules/products/products.module#ProductsModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "delivery",
        loadChildren: "./modules/delivery/delivery.module#DeliveryModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "settings",
        loadChildren: "./modules/settings/settings.module#SettingsModule"
      },
      {
        path: "questions",
        loadChildren: "./modules/questions/questions.module#QuestionsModule"
      },
      {
        path: "notifications",
        loadChildren:
          "./modules/push-notifications/push-notifications.module#NotificationsModule"
      },
      {
        path: "admins",
        loadChildren: "./modules/users/admin/admin.module#AdminModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "orders",
        loadChildren: "./modules/orders/orders.module#OrdersModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "customers",
        loadChildren:
          "./modules/users/customers/customers.module#CustomersModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "offers",
        loadChildren: "./modules/offers/offers.module#OffersModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "create-product",
        loadChildren:
          "./modules/create-product/create-product.module#CreateProductModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "customers",
        loadChildren:
          "./modules/users/customers/customers.module#CustomersModule",
        canActivate: [CanActivateAdminGuard]
      },
      {
        path: "categories",
        loadChildren: "./modules/categories/categories.module#CategoriesModule"
      }
    ]
  },
  {
    path: "auth",
    loadChildren: "./modules/auth/auth.module#AuthModule"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
