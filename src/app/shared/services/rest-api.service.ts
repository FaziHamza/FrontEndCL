import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "environments/environment";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";



export class RestApiService {
    public headers: HttpHeaders | { [p: string]: string | string[] };

    constructor(public http: HttpClient, _authenticationService: AuthenticationService) {
        this.headers = {Authorization: `Bearer ${_authenticationService.currentUserValue.authToken}`};
    }

    get<T>(url: string, httpParams?: HttpParams): Observable<T> {
        url = environment.serverApiUrl + url;
        return this.http.get<T>(url, {params: httpParams, headers: this.headers});
    }


    post<T>(url: string, body: object, httpParams?: HttpParams): Observable<T> {
        url = environment.serverApiUrl + url;
        return this.http.post<T>(url, body, {params: httpParams, headers: this.headers});
    }


    put<T>(url: string, body: object, httpParams?: HttpParams): Observable<T> {
        url = environment.serverApiUrl + url;
        return this.http.put<T>(url, body, {params: httpParams, headers: this.headers});
    }

    delete<T>(url: string, httpParams?: HttpParams): Observable<T> {
        url = environment.serverApiUrl + url;
        return this.http.delete<T>(url, {params: httpParams, headers: this.headers});
    }

}
