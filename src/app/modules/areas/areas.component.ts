import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  Optional,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef
} from "@angular/core";
import { MatPaginator, MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { CitiesService } from "./service/cities.service";
import { City } from "../modals/city.modal";
import { AddNewCityComponent } from "./components/add-new-city/add-new-city.component";
import { HttpAreasService } from "./service/areas.service";
import { Subject, fromEvent } from "rxjs";
import {
  tap,
  map,
  takeUntil,
  debounceTime,
  distinctUntilChanged
} from "rxjs/operators";
import { AddNewAreaComponent } from "./components/add-new-area/add-new-area.component";
import { ToastrService } from "ngx-toastr";
import { EditCityComponent } from "./components/edit-city/edit-city.component";
import { EditAreaComponent } from "./components/edit-area/edit-area.component";
import { NotificationService } from "../../shared/services/notifications/notification.service";
import { TranslateService } from "@ngx-translate/core";
import { CitiesDataSource } from "./classes/cities.data.source";
import { AreasDataSource } from "./classes/areas.data.source";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: "app-areas",
  templateUrl: "./areas.component.html",
  styleUrls: ["./areas.component.scss", "../tabel.scss"]
})
export class AreasComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    "position",
    "name",
    "created_at",
    "updated_at",
    "Actions"
  ];
  selectedRow: City;
  selectedCity: City;
  citiesData: City[] = [];
  isSmallScreen: boolean = true;
  dataSource = new CitiesDataSource(this.cityService, this.httpAreaService);
  dataSourceArea = new AreasDataSource(this.httpAreaService);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("areasPaginator") paginatorArea: MatPaginator;
  @ViewChild("searchCities") searchCities: ElementRef;
  @ViewChild("searchCitiesXs") searchCitiesXs: ElementRef;
  @ViewChild("searchAreas") searchAreas: ElementRef;
  @ViewChild("searchAreasXs") searchAreasXs: ElementRef;
  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  noCities = false;
  noAreas = false;
  totalCitiesNumber: number;
  totalAreasNumber: number;
  modalWidth: string;
  modalHeight: string;
  noAreaData = this.dataSourceArea
    .areasDataSubject$()
    .pipe(map(data => data.length === 0));

  constructor(
    private cityService: CitiesService,
    private httpAreaService: HttpAreasService,
    @Optional() public dialogRef: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService,
    public breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {

    this.breakpointObserver
      .observe(["(max-width: 766px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isSmallScreen = true;
          this.modalWidth = '90%';
          this.modalHeight = '400px';
        } else {
          this.isSmallScreen = false;
          this.modalWidth = '600px';
          this.modalHeight = '400px';
        }
      });
    this.refreshCitiesData();
  }

  refreshCitiesData() {
    this.noCities = false;
    this.dataSource = new CitiesDataSource(
      this.cityService,
      this.httpAreaService
    );
    this.dataSource.loadCities(0, this.searchCities.nativeElement.value);
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalCitiesNumber = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }

  // get all areas based for selected city

  getAreas = (city: any) => {
    this.selectedCity = city;
    this.noAreas = false;

    this.dataSourceArea = new AreasDataSource(this.httpAreaService);
    this.dataSourceArea.loadArea$(
      city["_id"],
      0,
      this.searchAreas.nativeElement.value
    );
    this.dataSourceArea.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalAreasNumber = totalNumber));
    this.changeDetectorRefs.detectChanges();
  };

  // open new city dialog to help us add new city and after closing it should refresh the list of citites

  addNewCity = (): void => {
    const dialogRef = this.dialogRef.open(AddNewCityComponent, {
      width: this.modalWidth,
      maxWidth: this.modalWidth,
      height: this.modalHeight,
      maxHeight: this.modalHeight,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.refreshCitiesData();
      });
  };

  // open new area dialog and send the selected city as data to get the coordinates for the selected city
  addNewArea = (): void => {
    const dialogRef = this.dialogRef.open(AddNewAreaComponent, {
      width: this.modalWidth,
      maxWidth: this.modalWidth,
      height: this.modalHeight,
      maxHeight: this.modalHeight,
      data: {
        data: this.selectedCity
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.getAreas(this.selectedCity);
        this.selectedRow = this.selectedCity;
      });
  };

  /* when click on tabel row get selected city data and display city areas*/

  getSelectedCity = (city: City): void => {
    this.selectedCity = city;
    this.getAreas(this.selectedCity);
  };

  // delete exist city from the list of cities
  deleteCity(city: City): void {
    this.cityService
      .deleteCity(city._id)
      .pipe(takeUntil(this.$destroy))
      .subscribe(data => {
        this.notificationService.successNotification('تم حذف المدينه بنجاح');
        this.refreshCitiesData();
      });
  }

  // delete area;
  deleteArea = area => {
    this.httpAreaService
      .deleteArea(this.selectedCity._id, area._id)
      .subscribe(data => {
        this.notificationService.successNotification('تم حذف المنطقه بنجاح');
        this.getAreas(this.selectedCity);
      });
  };

  // edit the city and send the selected city

  editCity(city) {
    const dialogRef = this.dialogRef.open(EditCityComponent, {
      width: this.modalWidth,
      maxWidth: this.modalWidth,
      height: this.modalHeight,
      maxHeight: this.modalHeight,
      data: {
        data: city
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.refreshCitiesData();
      });
  }

  // edit the selected area and send the selected city;
  editAreaForSelectedCity(area) {
    if (!this.selectedCity) {
      return;
    }
    const dialogRef = this.dialogRef.open(EditAreaComponent, {
      width: this.modalWidth,
      maxWidth: this.modalWidth,
      height: this.modalHeight,
      maxHeight: this.modalHeight,
      data: {
        city: this.selectedCity,
        area: area
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.getAreas(this.selectedCity);
      });
  }

  ngAfterViewInit() {
    this.paginatorArea.page.pipe(tap(() => this.loadAreaPage())).subscribe();
    this.paginator.page.pipe(tap(() => this.loadPage())).subscribe();

    fromEvent(this.searchCities.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage();
        })
      )
      .subscribe();

    fromEvent(this.searchAreas.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginatorArea.pageIndex = 0;
          this.loadAreaPage();
        })
      )
      .subscribe();

    fromEvent(this.searchCitiesXs.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginatorArea.pageIndex = 0;
          this.loadPage();
        })
      )
      .subscribe();

    fromEvent(this.searchAreasXs.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginatorArea.pageIndex = 0;
          this.loadAreaPage();
        })
      )
      .subscribe();
  }
  // pignate the Cities pages
  loadPage() {
    let $search;
    if (this.isSmallScreen) {
      $search = this.searchCitiesXs.nativeElement.value;
    } else {
      $search = this.searchCities.nativeElement.value;
    }
    this.dataSource.loadCities(this.paginator.pageIndex, $search);
  }
  // pignate the areas pages
  loadAreaPage() {
    let $search;
    if (this.isSmallScreen) {
      $search = this.searchAreasXs.nativeElement.value;
    } else {
      $search = this.searchAreas.nativeElement.value;
    }
    if (this.selectedCity) {
      this.dataSourceArea.loadArea$(
        this.selectedCity["_id"],
        this.paginatorArea.pageIndex,
        $search
      );
    }
  }
  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
