import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpUsersServices } from '../../users/services/httpUsersServices';

@Injectable({
  providedIn: "root"
})
export class ActivitiesDataSource implements DataSource<any> {
  public dateSourceCustomers = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private metaSubject = new BehaviorSubject<any>({});
  public mata$ = this.metaSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public categoriesData$ = this.dateSourceCustomers.asObservable();
  empty = false;

  constructor(
    private httpUsersService: HttpUsersServices
  ) { }

  connect(): Observable<any[]> {
    return this.dateSourceCustomers.pipe(
      tap(data => {
        this.empty = !data.length;
      })
    );
  }

  disconnect(): void {
    this.dateSourceCustomers.complete();
    this.loadingSubject.complete();
  }
  loadUsers($pageNumber, $search, role) {
    this.loadingSubject.next(true);
    this.httpUsersService
      .getUsersByRoles($pageNumber, $search, role)
      .pipe(
        first(),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        this.dateSourceCustomers.next(data.body.users);
        this.metaSubject.next(data.body.length);
      });
  }
}
