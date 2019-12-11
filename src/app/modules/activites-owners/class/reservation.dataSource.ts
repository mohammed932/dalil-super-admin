import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpUsersServices } from '../../users/services/httpUsersServices';

@Injectable({
    providedIn: "root"
})
export class ReservationDataSource implements DataSource<any> {
    public dataSubjectReservation = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private metaSubject = new BehaviorSubject<any>({});
    public mata$ = this.metaSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public reservationData$ = this.dataSubjectReservation.asObservable();
    empty = false;

    constructor(private httpUsersService: HttpUsersServices) { }

    connect(): Observable<any[]> {
        return this.dataSubjectReservation.pipe(
            tap(data => {
                this.empty = !data.length;
            })
        );
    }

    disconnect(): void {
        this.dataSubjectReservation.complete();
        this.loadingSubject.complete();
    }

    loadReservations$(ownerId, $pageNumber, $search) {
        this.loadingSubject.next(true);
        this.httpUsersService
            .getAllReservationForPropertyOwner($pageNumber, $search, ownerId)
            .pipe(
                first(),
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(data => {
                this.dataSubjectReservation.next(data.body.transactions);
                this.metaSubject.next(data.body.length);
            });
    }
}
