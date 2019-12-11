import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { catchError, finalize, filter, first, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { CitiesService } from '../service/cities.service';
import { City } from '../../modals/city.modal';
import { AreasDataSource } from './areas.data.source';
import { HttpAreasService } from '../service/areas.service';

@Injectable({
    providedIn: 'root'
})
export class CitiesDataSource implements DataSource<any> {
    public dataSubjectCities = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private metaSubject = new BehaviorSubject<any>({});
    public mata$ = this.metaSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    empty = false;
    area = new AreasDataSource(this.areasSerive);
    constructor(private citiesService: CitiesService, private areasSerive: HttpAreasService) { }

    connect(): Observable<any[]> {
        return this.dataSubjectCities.pipe(
            tap(data => {
                this.empty = !data.length;
            })
        );
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubjectCities.complete();
        this.loadingSubject.complete();
        this.area.dataSubjectAreas.next([]);
    }
    loadCities($PageNumber: number, $search) {
        this.loadingSubject.next(true);
        this.citiesService
            .getAllCities(
                $PageNumber,
                $search
            )
            .pipe(
                first(),
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(data => {
                this.dataSubjectCities.next(data['cities']);
                this.metaSubject.next(data.length);
            });
    }
    citiesDataSubject$() {
        return this.dataSubjectCities.asObservable();
    }

    isCitiesEmpty$() {
        return this.citiesDataSubject$().pipe(
            filter(data => data.length < 1)
        );
    }



}
