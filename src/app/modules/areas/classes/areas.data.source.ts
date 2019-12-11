import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpAreasService } from '../service/areas.service';

@Injectable({
    providedIn: 'root'
})
export class AreasDataSource implements DataSource<any> {
    public dataSubjectAreas = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private metaSubject = new BehaviorSubject<any>({});
    public mata$ = this.metaSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public areasSubjectData = this.dataSubjectAreas.asObservable();

    noAreasSubject = new Subject<boolean>();
    public noAreasData = this.noAreasSubject.asObservable();
    empty = false;

    constructor(private httpAreasService: HttpAreasService) { }

    connect(): Observable<any[]> {
        return this.dataSubjectAreas.pipe(
            tap(data => this.empty = !data.length)
        );
    }

    disconnect(): void {
        this.dataSubjectAreas.complete();
        this.loadingSubject.complete();
    }
    loadArea$(cityId: string, $PageNumber: number, $search) {
        this.loadingSubject.next(true);
        this.httpAreasService
            .getAreaForCityFromApi(
                cityId,
                $PageNumber,
                $search
            )
            .pipe(
                first(),
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(data => {
                this.dataSubjectAreas.next(data['areas']);
                this.metaSubject.next(data.length);
            });
    }
    areasDataSubject$() {
        return this.dataSubjectAreas.asObservable();
    }

    connectAreaData$() {
        return this.dataSubjectAreas.pipe(
            tap(data => this.empty = !data.length)
        );
    }

    noAreasSubject$() {
        return this.noAreasSubject.asObservable();
    }

}
