import {Injectable} from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {Contact} from "../models/contact";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";
import {APIResponse, MiscAPIResponse} from "../models/a-p-i-Response";
import {Pagination} from "../models/pagination";
import {ContactTypeLookup} from "../models/lookup";

@Injectable({
    providedIn: 'root'
})
export class ContactService extends BaseApiService<Contact> {
    commonEndPoint = "Contact";

    constructor(private _httpClient: HttpClient, public _authenticationService: AuthenticationService) {
        super(_httpClient, _authenticationService);
        // Do what you need to do starting here...
    }

    create(contact: Contact): Observable<APIResponse<Contact>> {
        return this.post(contact);
    }

    addContactOnSetup(contact: Contact): Observable<APIResponse<Contact>> {
        return this.post(contact, (this.baseUrl + this.commonEndPoint + "/AddContactOnSetup"));
    }

    update(contact: Contact): Observable<APIResponse<Contact>> {
        return this.put(contact);
    }

    getContactTypes(queries?): Observable<MiscAPIResponse<ContactTypeLookup[],number>> {
        return this.http.get<MiscAPIResponse<ContactTypeLookup[],number>>(this.baseUrl + this.commonEndPoint + "/Types", {
            headers: this.headers
        });
    }

    getAll(queries?): Observable<APIResponse<Contact[]>> {
        return this.all(queries);
    }

    getAllPagination(pagination: Pagination): Observable<MiscAPIResponse<Contact[], Pagination>> {
        return this.allPagination(pagination);
    }

}
