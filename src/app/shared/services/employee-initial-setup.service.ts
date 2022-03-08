import {Injectable} from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {EmployeeInitialSetup, EmployeeInitialSetupListDto} from "../models/employeeInitialSetup";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";
import {APIResponse, MiscAPIResponse} from "../models/a-p-i-Response";
import {SetupAdditionalData} from "../models/setupAdditionalData";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class EmployeeInitialSetupService extends BaseApiService<EmployeeInitialSetup> {

    commonEndPoint = "Setup/EmployeeInitial";
    url = environment.serverApiUrl + "/api/";
    constructor(private _httpClient: HttpClient, public _authenticationService: AuthenticationService) {
        super(_httpClient, _authenticationService);
    }

    create(body: EmployeeInitialSetup): Observable<APIResponse<EmployeeInitialSetup>> {
        return super.post(body);
    }
    createList(body: any[]): Observable<APIResponse<any>> {
        return this.http.post<APIResponse<any[]>>(this.url  + "Setup/AddRangeSetups", body, {
            headers: this.headers
        });
    }

    getAll(): Observable<MiscAPIResponse<EmployeeInitialSetup[], SetupAdditionalData>> {
        debugger
        return this.http.get<MiscAPIResponse<EmployeeInitialSetup[], SetupAdditionalData>>(this.baseUrl + this.commonEndPoint, {
            headers: this.headers
        });
    }

}
