import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "environments/environment";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {APIResponse, MiscAPIResponse} from "../models/a-p-i-Response";
import {Pagination} from "../models/pagination";
import { CommonFunctionService } from "./common-funcation.service";

export abstract class BaseApiService<T> {
    // protected headers: HttpHeaders | { [p: string]: string | string[] };
    protected baseUrl = environment.serverApiUrl + "/api/";
    protected commonEndPoint = "";
    protected finalUrl = "";

    protected constructor(public http: HttpClient, public _authenticationService: AuthenticationService) {

        this.finalUrl = this.baseUrl + this.commonEndPoint;
    }

    get headers() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9',
            Authorization: `Bearer ${this._authenticationService.currentUserValue.authToken}`,
            OrganizationId: `${this._authenticationService.currentOrganizationValue?.organizationId || this._authenticationService.currentUserValue.organizationId}`
        };
    }

    single(id: number, httpParams?: HttpParams): Observable<APIResponse<T>> {
        return this.http.get<APIResponse<T>>(this.baseUrl + this.commonEndPoint + "/" + id, {
            params: httpParams,
            headers: this.headers
        });
    }

    all(httpParams?): Observable<APIResponse<T[]>> {
        return this.http.get<APIResponse<T[]>>(this.baseUrl + this.commonEndPoint, {
            params: httpParams,
            headers: this.headers
        });
    }

    allPagination(pagination: Pagination, httpParams?): Observable<MiscAPIResponse<T[], Pagination>> {
        return this.http.get<MiscAPIResponse<T[], Pagination>>(this.baseUrl + this.commonEndPoint, {
            params: {...pagination, ...httpParams},
            headers: this.headers
        });
    }

    post(body: T, url?: string, httpParams?: HttpParams): Observable<APIResponse<T>> {
        return this.http.post<APIResponse<T>>(((url !== null && url !== undefined) ? url : (this.baseUrl + this.commonEndPoint)), body, {
            params: httpParams,
            headers: this.headers
        });
    }

    put(body: T, httpParams?: HttpParams): Observable<APIResponse<T>> {
        return this.http.put<APIResponse<T>>(this.baseUrl + this.commonEndPoint, body, {
            params: httpParams,
            headers: this.headers
        });
    }

    delete(id: number, httpParams?: HttpParams): Observable<APIResponse<boolean>> {
        return this.http.delete<APIResponse<boolean>>(this.baseUrl + this.commonEndPoint, {
            params: {id: id},
            headers: this.headers
        });
    }

    changeIsPublic(id: number, state: boolean): Observable<APIResponse<boolean>> {
        return this.http.patch<APIResponse<boolean>>(this.baseUrl + this.commonEndPoint, null, {
            headers: this.headers,
            params: {id: id, state: state}
        });
    }

}
