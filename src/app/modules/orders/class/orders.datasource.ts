import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpOrdersService } from '../service/orders.service';

@Injectable({
  providedIn: "root"
})
export class OrdersDataSource implements DataSource<any> {
  public dataSubjectOrders = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private metaSubjectPromotions = new BehaviorSubject<any>({});
  public mata$ = this.metaSubjectPromotions.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public categoriesData$ = this.dataSubjectOrders.asObservable();
  empty = false;

  constructor(private httpOrderService: HttpOrdersService) { }

  connect(): Observable<any[]> {
    return this.dataSubjectOrders.pipe(
      tap(data => {
        this.empty = !data.length;
      })
    );
  }

  disconnect(): void {
    this.dataSubjectOrders.complete();
    this.loadingSubject.complete();
  }
  loadPromoCodes$($pageNumber, $search, $filter) {
    this.loadingSubject.next(true);
    this.httpOrderService
      .getAllOrders($pageNumber, $search , $filter)
      .pipe(
        first(),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        this.dataSubjectOrders.next(data.body.orders);
        this.metaSubjectPromotions.next(data.body.length);
      });
  }
  clipperServiceDataSubject$() {
    return this.dataSubjectOrders.asObservable();
  }

  isServiceEmpty$() {
    return this.dataSubjectOrders.pipe(
      filter(data => data.length < 1)
    );
  }
}
