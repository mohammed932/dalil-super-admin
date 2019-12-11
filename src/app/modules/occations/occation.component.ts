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
import { OccationDataSource } from './class/occation.datasource';
import { UpdateOccationComponent } from './components/update-occation/update-occation.component';
import { AddNewOccationComponent } from './components/add-new-occation/add-new-occation.component';
import { HttpOccationsService } from './service/occations.service';

@Component({
  selector: "app-occation",
  templateUrl: "./occation.component.html",
  styleUrls: [
    "./occation.component.scss",
    "../../modules/tabel.scss"
  ]
})
export class OccationComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "name",
    "created_at",
    "updated_at",
    "Actions"
  ];
  dataSource = new OccationDataSource(this.httpOccationService);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  noCities = false;
  noAreas = false;
  totalCitiesNumber: number;
  totalAreasNumber: number;
  reset = "";
  status = "";

  selectedCategory: any;
  noClipperServices = this.dataSource
    .clipperServiceDataSubject$()
    .pipe(map(data => data.length === 0));
  @ViewChild("searchInput") search: ElementRef;
  @ViewChild("searchInputCategoryItem") searchCategoryItem: ElementRef;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpOccationService: HttpOccationsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noCities = false;
    this.dataSource = new OccationDataSource(this.httpOccationService);
    this.dataSource.loadCategories$(
      0,
      this.search.nativeElement.value,
      this.status
    );
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalCitiesNumber = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }



  addNewCategory() {
    const dialogRef = this.dialogRef.open(AddNewOccationComponent, {
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



  updateCategory(element) {
    const dialogRef = this.dialogRef.open(UpdateOccationComponent, {
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




  deleteCategory(element) {
    this.httpOccationService.deleteOccasion(element._id).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationService.successNotification(
            'تم حذف المناسبه بنجاح'
          );
          this.refreshServicesData();
        }
      },
      err => {
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }



  getSelectedCategory(category) {
    this.selectedCategory = category;
  }

  getActivationStatus(status) {
    this.status = status.value;
    this.loadPage(this.status);
  }
  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage(this.status))).subscribe();

    fromEvent(this.search.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage(this.status);
        })
      )
      .subscribe();

  }
  // pignate the Cities pages
  loadPage(status = "") {
    this.dataSource.loadCategories$(
      this.paginator.pageIndex,
      this.search.nativeElement.value,
      status
    );
  }

  clearSelection() {
    this.reset = null;
    this.status = "";
    this.loadPage(this.status);
  }

  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
