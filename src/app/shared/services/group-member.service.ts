import {Injectable} from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {GroupMember} from "../models/group";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";
import {APIResponse} from "../models/a-p-i-Response";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GroupMemberService extends BaseApiService<GroupMember> {
    commonEndPoint = "Group/AddMember";

    constructor(private _httpClient: HttpClient, public _authenticationService: AuthenticationService) {
        super(_httpClient, _authenticationService);
        // Do what you need to do starting here...
    }

    create(contact: GroupMember): Observable<APIResponse<GroupMember>> {
        return this.post(contact);
    }

    update(contact: GroupMember): Observable<APIResponse<GroupMember>> {
        return this.put(contact);
    }

    getAll(): Observable<APIResponse<GroupMember[]>> {
        return this.all();
    }
}
