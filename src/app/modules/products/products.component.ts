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
import { fromEvent } from "rxjs/internal/observable/fromEvent";
import { Subject } from "rxjs";
import { NotificationService } from "../../shared/services/notifications/notification.service";
import { TranslateService } from "@ngx-translate/core";
import { ProductsDataSource } from './class/products.datasource';
import { HttpProductsService } from './service/products.service';
import { Router } from '@angular/router';
@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: [
    "./products.component.scss",
    "../tabel.scss"
  ]
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = [
    "position",
    "name",
    "max_price",
    "min_price",
    "max_size",
    "min_size",
    "created_at",
    "Actions"
  ];
  dataSource = new ProductsDataSource(this.httpProductsService);
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
  @ViewChild("searchInput") search: ElementRef;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpProductsService: HttpProductsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noCities = false;
    this.dataSource = new ProductsDataSource(this.httpProductsService);
    this.dataSource.loadProducts$(
      0,
      this.search.nativeElement.value,
    );
    this.dataSource.mata$
      .pipe(
        filter(x => x !== undefined),
        takeUntil(this.$destroy)
      )
      .subscribe(totalNumber => this.totalPromotions = totalNumber);

    this.changeDetectorRefs.detectChanges();
  }

  deleteProduct(element) {
    this.httpProductsService.deleteProduct(element._id).subscribe(data => {
      if (data.status === 200) {
        this.notificationService.successNotification(`Product ${element.name} Deleted`);
        this.refreshServicesData();
      }
    }, err => {
      this.notificationService.errorNotification(err.error.message);
    })
  }

  goToCreateProduct() {
    const getCurrentLang = localStorage.getItem('LOCALIZE_DEFAULT_LANGUAGE');
    this.router.navigate([`${getCurrentLang}/create-product`]);
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
  // pignate the Cities pages
  loadPage() {
    this.dataSource.loadProducts$(
      this.paginator.pageIndex,
      this.search.nativeElement.value,
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
