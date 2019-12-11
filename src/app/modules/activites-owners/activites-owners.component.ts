import {
  Component,
  OnInit,
  Optional,
  ElementRef,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import {
  map,
  distinctUntilChanged,
  debounceTime,
  tap,
  takeUntil
} from "rxjs/operators";
import { MatDialog, MatPaginator } from "@angular/material";
import { fromEvent } from "rxjs/internal/observable/fromEvent";
import { Subject } from "rxjs";
import { NotificationService } from "../../shared/services/notifications/notification.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivitiesDataSource } from './class/activites-owners.datasource';
import { Router } from '@angular/router';
import { AddOfferActivityComponent } from './components/add-offer/add-offer-activities.component';
import { HttpUsersServices } from '../users/services/httpUsersServices';
import { AddNewActivitiesOwnerComponent } from './components/add-new-activites-owners/add-new-activites-owners.component';
import { ReservationDataSource } from './class/reservation.dataSource';

@Component({
  selector: "app-activites-owners",
  templateUrl: "./activites-owners.component.html",
  styleUrls: [
    "./activites-owners.component.scss",
    "../../modules/configurations/components/chalets/chalets.component.scss",
    "../../modules/tabel.scss"
  ]
})
export class ActivitiesOwnersComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "name",
    "account_number",
    "email",
    "city",
    "mobile",
    "status",
    "Actions"
  ];

  displayedColumnsReservation: string[] = [
    "position",
    "property_name",
    "property_price",
    "booking_number",
    "transaction",
    "will_pay",
    "customer_money",
    "app_money",
    "isDone",
    "Actions"
  ];
  dataSource = new ActivitiesDataSource(this.httpUsersService);
  dataSourceReservation = new ReservationDataSource(this.httpUsersService)
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("reservationPaginator") reservationPaginator: MatPaginator;
  $destroy = new Subject<any>();
  loading = false;
  totalCitiesNumber: number;
  totalReservation: number;
  reset = "";
  status = "";
  selectedRow: any;
  selectedCategory: any;
  role = "property_owner";
  @ViewChild("searchInput") search: ElementRef;
  @ViewChild("searchInputCategoryItem") searchCategoryItem: ElementRef;
  noActivities: boolean;
  selectedActivity: any;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpUsersService: HttpUsersServices,
    private changeDetectorRefs: ChangeDetectorRef,
    public translate: TranslateService,
    private router: Router,
    private notifcationService: NotificationService
  ) { }

  ngOnInit() {
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noActivities = false;
    this.dataSource = new ActivitiesDataSource(this.httpUsersService);
    this.dataSource.loadUsers(
      0,
      this.search.nativeElement.value,
      this.role
    );
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalCitiesNumber = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }


  getSelectedProperty(owner) {
    this.selectedActivity = owner;
    this.dataSourceReservation = new ReservationDataSource(this.httpUsersService);
    this.dataSourceReservation.loadReservations$(
      owner._id,
      0,
      this.searchCategoryItem.nativeElement.value,
    );
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalReservation = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }

  verifyPropertyOwner(propertyId, status) {
    const body = {
      is_verified: status
    };
    this.httpUsersService.verifyPropertyOwner(propertyId, body).subscribe(data => {
      if (data.status === 200) {

        if (status === 'true') {
          this.notifcationService.successNotification('تم تفعيل الحساب');
        }
        if (status === 'false') {
          this.notifcationService.errorNotification('تم وقف الحساب');
        }
        this.refreshServicesData();
      }
    }, err => {
      this.notifcationService.errorNotification(err.error.message);
    })
  }

  deletePropertyOwner(element) {
    this.httpUsersService.deletePropertyOwner(element._id).subscribe(data => {
      if (data.status === 200) {
        this.notifcationService.successNotification('تم حذف المستخدم بنجاح');
        this.refreshServicesData();
      }
    }, err => {
      this.notifcationService.errorNotification(err.error.message);
    })
  }


  addNewActivity() {
    const dialogRef = this.dialogRef.open(AddNewActivitiesOwnerComponent, {
      maxWidth: "60%",
      width: "60%",
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.refreshServicesData();
      });
  }

  completePayment(transaction, status) {
    const body = {
      status: status
    };
    this.httpUsersService.verifyPayment(transaction.booking.property._id, transaction._id, body).subscribe(data => {
      if (data.status === 200) {
        if (status === 'true') {
          this.notifcationService.successNotification('تم استكمال الدفع ');
        }
        if (status === 'false') {
          this.notifcationService.errorNotification('الدفع غير مكتمل');
        }
        this.getSelectedProperty(this.selectedActivity._id);
      }
    }, err => {
      this.notifcationService.errorNotification(err.error.message);
    })
  }

  updateCategory(element) {
    this.router.navigate(['activities', element._id]);
  }

  openOfferDialog(element) {
    const dialogRef = this.dialogRef.open(AddOfferActivityComponent, {
      maxWidth: "60%",
      width: "60%",
      data: element
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.refreshServicesData();
      });
  }

  getSelectedActivity(activity) {
    this.selectedActivity = activity;
  }


  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage())).subscribe();
    this.reservationPaginator.page.pipe(tap(() => this.getSelectedProperty(this.selectedActivity._id))).subscribe();

    fromEvent(this.search.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage();
        })
      )
      .subscribe();

    fromEvent(this.searchCategoryItem.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadReservation();
        })
      )
      .subscribe();
  }
  loadPage() {
    this.dataSource.loadUsers(
      this.paginator.pageIndex,
      this.search.nativeElement.value,
      this.role
    );
  }

  loadReservation() {
    this.dataSourceReservation.loadReservations$(
      this.selectedActivity._id,
      0,
      this.searchCategoryItem.nativeElement.value,
    );
  }

  clearSelection() {
    this.reset = null;
    this.status = "";
    this.loadPage();
  }

  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
