import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { catchError, finalize, first, map, filter, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpUsersServices } from '../../services/httpUsersServices';

@Injectable({
    providedIn: 'root'
})
export class EmployeesDataSource implements DataSource<any> {
    public employeeDataSource = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private metaSubject = new BehaviorSubject<any>({});
    public mata$ = this.metaSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public clipperServicesSubjectData = this.employeeDataSource.asObservable();
    empty = false;

    constructor(private httpUsersService: HttpUsersServices) { }

    connect(): Observable<any[]> {
        return this.employeeDataSource.pipe(
            tap(data => {
                this.empty = !data.length;
            })
        );
    }

    disconnect(): void {
        this.employeeDataSource.complete();
        this.loadingSubject.complete();
    }
    loadUsers($pageNumber, $search, role, isActive, isVerifed) {
        this.loadingSubject.next(true);
        this.httpUsersService
            .getUsersByRoles($pageNumber, $search, role, isActive, isVerifed)
            .pipe(
                first(),
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(data => {
                this.employeeDataSource.next(data.body.users);
                this.metaSubject.next(data.body.length);
            });
    }
    clipperServiceDataSubject$() {
        return this.employeeDataSource.asObservable();
    }

    isServiceEmpty$() {
        return this.employeeDataSource.pipe(
            filter(data => data.length < 1)
        );
    }

}
