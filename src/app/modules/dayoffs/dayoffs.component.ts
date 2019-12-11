import { Component, OnInit, Optional, ChangeDetectorRef, Inject, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { NotificationService } from '../../shared/services/notifications/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { map, takeUntil, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpDayOffsService } from './services/dayoffs.service';
import { Subject } from 'rxjs/internal/Subject';
import { fromEvent } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DayOffsDatasouce } from './classes/dayOffs.data.source';
import { AddDayOffComponent } from './components/add-dayOff/add-dayOff.component';
@Component({
  selector: 'app-day-offs',
  templateUrl: './dayoffs.component.html',
  styleUrls: ['./dayoffs.component.scss',
    '../../modules/tabel.scss']
})
export class DayOffsComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['position', 'date', 'created_at', 'updated_at', 'Actions'];
  dataSource = new DayOffsDatasouce(this.httpDayOffsService);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  noCities = false;
  noAreas = false;
  totalCitiesNumber: number;
  totalAreasNumber: number;
  isSmallScreen: boolean;
  modalWidth: string;
  modalHeight: string;
  noClipperServices = this.dataSource.clipperServiceDataSubject$().pipe(
    map(data => data.length === 0));
  @ViewChild('searchInput') search: ElementRef;
  @ViewChild('searchServices') searchServices: ElementRef;

  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpDayOffsService: HttpDayOffsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private notificationService: NotificationService,
    public translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.breakpointObserver
      .observe(["(max-width: 766px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isSmallScreen = true;
          this.modalWidth = '90%';
          this.modalHeight = '300px';
        } else {
          this.isSmallScreen = false;
          this.modalWidth = '600px';
          this.modalHeight = '300px';
        }
      });
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noCities = false;
    this.dataSource = new DayOffsDatasouce(this.httpDayOffsService);
    this.dataSource.loadClipperServices$(0, this.search.nativeElement.value);
    this.dataSource.mata$.pipe(
      takeUntil(this.$destroy)
    ).subscribe(totalNumber => this.totalCitiesNumber = totalNumber);
    this.changeDetectorRefs.detectChanges();
  }

  // open new city dialog to help us add new city and after closing it should refresh the list of citites

  addNewService = (): void => {
    const dialogRef = this.dialogRef.open(AddDayOffComponent, {
      width: this.modalWidth,
      maxWidth: this.modalWidth,
      height: this.modalHeight,
      maxHeight: this.modalHeight,
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.$destroy)
    ).subscribe(() => {
      this.refreshServicesData();
    });
  }




  deleteDayOff(day: any): void {
    this.httpDayOffsService.deleteDayOff(day._id).pipe(
      takeUntil(this.$destroy)
    ).subscribe(
      data => {
        this.notificationService.successNotification(data.body.message);
        this.refreshServicesData();
      }
    );
  }






  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPage())).subscribe();

    fromEvent(this.search.nativeElement, 'keyup')
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
    this.dataSource.loadClipperServices$(
      this.paginator.pageIndex,
      this.search.nativeElement.value
    );
  }

  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }


}
