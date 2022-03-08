import {Injectable} from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";
import {APIResponse} from "../models/a-p-i-Response";
import {Group} from "../models/group";

@Injectable({
    providedIn: 'root'
})
export class GroupService extends BaseApiService<Group> {
    commonEndPoint = "Group";

    constructor(private _httpClient: HttpClient, public _authenticationService: AuthenticationService) {
        super(_httpClient, _authenticationService);
        // Do what you need to do starting here...
    }

    create(contact: Group): Observable<APIResponse<Group>> {
        return this.post(contact);
    }

    update(contact: Group): Observable<APIResponse<Group>> {
        return this.put(contact);
    }

    getAll(): Observable<APIResponse<Group[]>> {
        return this.all({"organizationId": this._authenticationService.currentOrganizationValue.organizationId});
    }
}
