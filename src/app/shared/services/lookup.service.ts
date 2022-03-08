import {Injectable} from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import {AuthenticationService} from "./authentication.service";
import {Observable, throwError} from "rxjs";
import {APIResponse} from "../models/a-p-i-Response";
import {Lookup} from "../models/lookup";
import { catchError, map } from 'rxjs/operators';
//import { ToastrService } from 'ngx-toastr/toastr/toastr.service';

@Injectable({
    providedIn: 'root'
})
export class LookupService extends BaseApiService<Lookup> {
    commonEndPoint = 'Lookup';

    constructor(private _httpClient: HttpClient, public _authenticationService: AuthenticationService) {
        super(_httpClient, _authenticationService);
        // Do what you need to do starting here...
    }

    get(id: number): Observable<APIResponse<Lookup>> {
        return this.single(id);
    }

    getAll(queries?): Observable<APIResponse<Lookup[]>> {
        return this.all(queries);
    }
    getAllByParam(category, subCategory,des, value, IsValid, IsActive): Observable<APIResponse<Lookup[]>> {
        debugger
        return this.http.get<APIResponse<Lookup[]>>(this.baseUrl + this.commonEndPoint + "/GetLookByParam?cat="+ category + "&subCat=" + subCategory+ "&des=" + des+ "&value=" + value+ "&IsValid=" + IsValid+ "&IsActive=" + IsActive, {
            headers: this.headers
        });
    }

    getTypes(category, subCategory) {
        return this.http.get<APIResponse<Lookup[]>>(this.baseUrl + this.commonEndPoint + "/" + category + "/" + subCategory, {
            headers: this.headers
        });
    }

    create(orgModel: Lookup): Observable<APIResponse<Lookup>> {
        orgModel.createdDate=new Date();
        orgModel.lookupValue=0;
        orgModel.isActive=true;
        orgModel.isValid=true;
        return this.post(orgModel);
    }
    reOrderLookup(id, order): Observable<APIResponse<Lookup>> {
        return this.http.post<APIResponse<Lookup>>(this.baseUrl + this.commonEndPoint + "/" + id + "/" + order, null, {
            headers: this.headers
        });
    }
    saveLookupOrders(body:Object): Observable<any> {        
        let bodyString = JSON.stringify(body);        
        return this.http.post<any>(this.baseUrl + this.commonEndPoint + "/SaveLookups" , bodyString,{
             headers: this.headers
         }) 
        .pipe(
           catchError(this.handleError)
        );
    }
    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
           // A client-side or network error occurred. Handle it accordingly.
           console.error('An error occurred:', error.error.message);
        } 
        else if(error.status == 401 && error.statusText == "Unauthorized"){         
           window.location.href = window.location.origin + '/#/login';
         //this.router.navigateByUrl('login');
        } else {
           // The backend returned an unsuccessful response code.
           // The response body may contain clues as to what went wrong,
           console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
           error.error.message || 'Server error');
     };
    update(orgModel: Lookup): Observable<APIResponse<Lookup>> {
        return this.put(orgModel);
    }
    deleteLookup(id: number): Observable<APIResponse<boolean>> {
        return this.delete(id);
    }
}
