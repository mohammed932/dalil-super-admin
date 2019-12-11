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
  takeUntil,
  filter
} from "rxjs/operators";
import { MatDialog, MatPaginator } from "@angular/material";
import { Subject } from "rxjs";
import { NotificationService } from "../../shared/services/notifications/notification.service";
import { TranslateService } from "@ngx-translate/core";
import { DeliveryDataSource } from './class/delivery.datasource';
import { HttpDeliveryService } from './service/delivery.service';
import { AddNewDeliveryComponent } from './components/add-new-delivery/add-new-delivery.component';
import { UpdateDeliveryComponent } from './components/update-delivery/update-delivery.component';
@Component({
  selector: "app-delivery",
  templateUrl: "./delivery.component.html",
  styleUrls: [
    "./delivery.component.scss",
    "../tabel.scss"
  ]
})
export class DeliveryComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "start",
    "end",
    "created_at",
    "updated_at",
    "Actions"
  ];
  dataSource = new DeliveryDataSource(this.httpDeliveryService);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  noCities = false;
  noAreas = false;
  totalPromotions: number;
  reset = "";
  status = "";

  selectedCategory: any;
  noClipperServices = this.dataSource
    .clipperServiceDataSubject$()
    .pipe(map(data => data.length === 0));
  // @ViewChild("searchInput") search: ElementRef;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpDeliveryService: HttpDeliveryService,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noCities = false;
    this.dataSource = new DeliveryDataSource(this.httpDeliveryService);
    this.dataSource.loadDeliveries$(
      0,
    );
    this.dataSource.mata$
      .pipe(
        filter(x => x !== undefined),
        takeUntil(this.$destroy)
      )
      .subscribe(totalNumber => this.totalPromotions = totalNumber);

    this.changeDetectorRefs.detectChanges();
  }



  addNewPromotion() {
    const dialogRef = this.dialogRef.open(AddNewDeliveryComponent, {
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


  updateDelivery(element) {
    const dialogRef = this.dialogRef.open(UpdateDeliveryComponent, {
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


  deleteDelivery(element) {
    this.httpDeliveryService.deleteDelivery(element._id).subscribe(
      data => {
        if (data.status === 200) {
          this.notificationService.successNotification(
            `Delivery time deleted`
          );
          this.refreshServicesData();
        }
      },
      err => {
        this.notificationService.errorNotification(err.error.message);
      }
    );
  }

  getSelectedCategory(element) {
    this.selectedCategory = element;
  }


  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage())).subscribe();
  }
  // pignate the Cities pages
  loadPage() {
    this.dataSource.loadDeliveries$(
      this.paginator.pageIndex,
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
