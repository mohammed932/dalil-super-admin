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
import { ActivitiesDataSource } from './class/activites.datasource';
import { Router } from '@angular/router';
import { HttpUsersServices } from '../users/services/httpUsersServices';
import { HttpActivitiesService } from './service/activities.service';
import { Location, DatePipe } from '@angular/common';
@Component({
  selector: "app-activites",
  templateUrl: "./activites.component.html",
  styleUrls: [
    "./activites.component.scss",
    "../../modules/configurations/components/chalets/chalets.component.scss",
    "../../modules/tabel.scss"
  ]
})
export class ActivitiesComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "name",
    "category",
    "status",
    "Actions"
  ];

  dataSource = new ActivitiesDataSource(this.httpActivitiesService);
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
    private httpActivitiesService: HttpActivitiesService,
    private changeDetectorRefs: ChangeDetectorRef,
    public translate: TranslateService,
    private router: Router,
    private notifcationService: NotificationService,
    private locaiton: Location,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noActivities = false;
    this.dataSource = new ActivitiesDataSource(this.httpActivitiesService);
    this.dataSource.loadUsers(
      0,
      this.search.nativeElement.value,
    );
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalCitiesNumber = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }


  getSelectedProperty(owner) {
    this.selectedActivity = owner;
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalReservation = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }

  verifyProperty(propertyId, status) {
    this.httpActivitiesService.verifyProperty(propertyId, status).subscribe(data => {
      this.refreshServicesData();
      this.notifcationService.successNotification('تم التعديل بنجاح');
    }, err => {
      this.notifcationService.errorNotification(err.error.message);
    })
  }


  showProperty(property) {
    window.open(`https://dalel-monsabat.firebaseapp.com/ar/search-results/item-details/${property._id}`, "_blank");
  }

  updateCategory(element) {
    this.router.navigate(['activities', element._id]);
  }



  getSelectedActivity(activity) {
    this.selectedActivity = activity;
  }


  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage())).subscribe();

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
  }
  loadPage() {
    this.dataSource.loadUsers(
      this.paginator.pageIndex,
      this.search.nativeElement.value,
    );
  }

  onDate(event, element) {
    let selectedDate = this.formatDate(event);
    console.log(selectedDate);
    this.httpActivitiesService.closeSpecifcDateForActivity(selectedDate, element._id).subscribe(data => {
      console.log(data);
      if (data.status === 200) {
        this.notifcationService.successNotification(`${selectedDate} تم حجز النشاط فى يوم`);
      }
    })
  }
  formatDate(selectedDate) {
    const currentDate = new Date(selectedDate);
    let latest_date = this.datepipe.transform(currentDate, 'yyyy-MM-dd');
    return latest_date || '';
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
