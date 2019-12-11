import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpPromotionsService } from '../service/promotions.service';

@Injectable({
  providedIn: "root"
})
export class PromotionsDataSource implements DataSource<any> {
  public dataSubjectPromoCodes = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private metaSubjectPromotions = new BehaviorSubject<any>({});
  public mata$ = this.metaSubjectPromotions.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public categoriesData$ = this.dataSubjectPromoCodes.asObservable();
  empty = false;

  constructor(private httpPromotionsService: HttpPromotionsService) { }

  connect(): Observable<any[]> {
    return this.dataSubjectPromoCodes.pipe(
      tap(data => {
        this.empty = !data.length;
      })
    );
  }

  disconnect(): void {
    this.dataSubjectPromoCodes.complete();
    this.loadingSubject.complete();
  }
  loadPromoCodes$($pageNumber, $search) {
    this.loadingSubject.next(true);
    this.httpPromotionsService
      .getAllPromotions($pageNumber, $search)
      .pipe(
        first(),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        this.dataSubjectPromoCodes.next(data.body.promocodes);
        this.metaSubjectPromotions.next(data.body.length);
      });
  }
  clipperServiceDataSubject$() {
    return this.dataSubjectPromoCodes.asObservable();
  }

  isServiceEmpty$() {
    return this.dataSubjectPromoCodes.pipe(
      filter(data => data.length < 1)
    );
  }
}
