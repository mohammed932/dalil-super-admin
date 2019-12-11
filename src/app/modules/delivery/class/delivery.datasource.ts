import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpDeliveryService } from '../service/delivery.service';

@Injectable({
  providedIn: "root"
})
export class DeliveryDataSource implements DataSource<any> {
  public dataSubjectDeliveries = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private metaSubjectPromotions = new BehaviorSubject<any>({});
  public mata$ = this.metaSubjectPromotions.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public categoriesData$ = this.dataSubjectDeliveries.asObservable();
  empty = false;

  constructor(private httpDeliveryService: HttpDeliveryService) { }

  connect(): Observable<any[]> {
    return this.dataSubjectDeliveries.pipe(
      tap(data => {
        this.empty = !data.length;
      })
    );
  }

  disconnect(): void {
    this.dataSubjectDeliveries.complete();
    this.loadingSubject.complete();
  }
  loadDeliveries$($pageNumber) {
    this.loadingSubject.next(true);
    this.httpDeliveryService
      .getAllDeliveries($pageNumber)
      .pipe(
        first(),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        this.dataSubjectDeliveries.next(data.body.deliveries);
        this.metaSubjectPromotions.next(data.body.length);
      });
  }
  clipperServiceDataSubject$() {
    return this.dataSubjectDeliveries.asObservable();
  }

  isServiceEmpty$() {
    return this.dataSubjectDeliveries.pipe(
      filter(data => data.length < 1)
    );
  }
}
