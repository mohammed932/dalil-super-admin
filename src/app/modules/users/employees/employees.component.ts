import {
  Component,
  OnInit,
  Optional,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  ElementRef
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog, MatPaginator } from "@angular/material";
import {
  map,
  takeUntil,
  tap,
  debounceTime,
  distinctUntilChanged,
  filter,
  mergeMap,
  finalize
} from "rxjs/operators";
import { Subject } from "rxjs/internal/Subject";
import { fromEvent, Subscription } from "rxjs";
import { EmployeesDataSource } from "./classes/employees.data.source";
import { NotificationService } from "../../../shared/services/notifications/notification.service";
import { HttpUsersServices } from "../services/httpUsersServices";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { UserData, User } from "../modals/user";
@Component({
  selector: "app-employees",
  templateUrl: "./employees.component.html",
  styleUrls: [
    "./employees.component.scss",
    "../../../modules/tabel.scss"
  ]
})
export class EmployeesComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    "position",
    "name",
    "mobile",
    "role",
    "status",
    "verifyStatus",
    "Actions"
  ];
  dataSource = new EmployeesDataSource(this.httpUsersServices);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  $destroy = new Subject<any>();
  noData = false;
  loading = false;
  noCities = false;
  noAreas = false;
  totalCitiesNumber: number;
  totalAreasNumber: number;

  is_active = "";
  is_verify = "";

  role = "employee";
  sub: Subscription;
  reset;
  resetVerified;
  noClipperServices = this.dataSource
    .clipperServiceDataSubject$()
    .pipe(map(data => data.length === 0));
  @ViewChild("searchInput") search: ElementRef;
  constructor(
    @Optional() public dialogRef: MatDialog,
    private httpUsersServices: HttpUsersServices,
    private changeDetectorRefs: ChangeDetectorRef,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.refreshServicesData();
  }

  refreshServicesData() {
    this.noCities = false;
    this.dataSource = new EmployeesDataSource(this.httpUsersServices);
    this.dataSource.loadUsers(
      0,
      this.search.nativeElement.value,
      this.role,
      this.is_active,
      this.is_verify
    );
    this.dataSource.mata$
      .pipe(takeUntil(this.$destroy))
      .subscribe(totalNumber => (this.totalCitiesNumber = totalNumber));
    this.changeDetectorRefs.detectChanges();
  }

  verfiyEmployee(employeId, verify) {
    const data = {
      employeeInfo: {
        is_verified: verify
      }
    };
    this.httpUsersServices.verfiyEmployee(employeId, data).subscribe(data => {
      this.refreshServicesData();
    });
  }

  activeEmployee(employeId, status) {
    const data = {
      employeeInfo: {
        is_active: status
      }
    };
    this.httpUsersServices.verfiyEmployee(employeId, data).subscribe(data => {
      this.refreshServicesData();
    });
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(tap(() => this.loadPage(this.is_active, this.is_verify)))
      .subscribe();

    fromEvent(this.search.nativeElement, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage(this.is_active, this.is_verify);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }
  // pignate the Cities pages
  loadPage(isActive = "", is_verify = "") {
    this.loading = true;
    this.dataSource.loadUsers(
      this.paginator.pageIndex,
      this.search.nativeElement.value,
      this.role,
      isActive.toString(),
      is_verify.toString()
    );
    this.changeDetectorRefs.detectChanges();
  }
  getActivationStatus(e) {
    this.is_active = e.value;
    this.loadPage(this.is_active, this.is_verify);
  }
  getVerifyStatus(e) {
    this.is_verify = e.value;
    this.loadPage(this.is_active, this.is_verify);
  }

  clearSelection() {
    this.reset = null;
    this.resetVerified = null;
    this.is_verify = "";
    this.is_active = "";
    this.loadPage(this.is_active, this.is_verify);
  }

  checkActiveStatus(element: User) {
    return element.employeeInfo;
  }
  /*
   destroy the $destroy subject to unsubscribe from all the observable subscribtion
  */
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
    this.changeDetectorRefs.detach();
  }
}
