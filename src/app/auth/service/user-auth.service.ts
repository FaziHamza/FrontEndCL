import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {ToastrService} from 'ngx-toastr';
import {map} from 'rxjs/operators';
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models';

@Injectable({
    providedIn: 'root'
})
export class UserAuthService {

    rootUrl: string = environment.serverApiUrl;
    public currentUser: Observable<User>;

    private currentUserSubject: BehaviorSubject<User>;

    constructor(private _http: HttpClient, private _toastrService: ToastrService, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

}
