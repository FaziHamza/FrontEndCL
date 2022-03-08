import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Organization, OrganizationConfigurationDto, OrgizationConfiguzartionLookup} from "../models/organization";
import {AuthenticationService} from "./authentication.service";
import {APIResponse} from "../models/a-p-i-Response";
import {RestApiService} from "./rest-api.service";


@Injectable({providedIn: 'root'})
export class OrganizationService extends RestApiService {

    constructor(private _httpClient: HttpClient, private _authenticationService: AuthenticationService) {
        super(_httpClient, _authenticationService);
        // Do what you need to do starting here...
    }

    getAllOrganizations(search?: string): Observable<APIResponse<Organization[]>> {

        let url = "/api/Organization";
        let params = new HttpParams()

        if (search) {
            params = params.set('search', search);
        }
        return this.get<APIResponse<Organization[]>>(url, params);
    }
    getOrganizationConfiguration(id?: number): Observable<APIResponse<any>> {

        let url = "/api/Organization/OrganizationConfiguration";
        let params = new HttpParams()

        if (id) {
            params = params.set('id', id);
        }
        return this.get<APIResponse<any>>(url, params);
    }
    getDefaultOrganizationConfiguration(catg?: string): Observable<APIResponse<OrgizationConfiguzartionLookup>> {

        let url = "/api/Organization/OrganizationConfigurationLookup";
        let params = new HttpParams()

        if (catg) {
            params = params.set('catg', catg);
        }
        return this.get<APIResponse<any>>(url, params);
    }
    createOrganizationConfiguration(orgModel: any): Observable<APIResponse<any>> {
        debugger
        let url = "/api/Organization/AddOrgConfiguration";
        return this.post(url, orgModel);
    }
 
    
    createOrganization(orgModel: Organization): Observable<APIResponse<Organization>> {
        debugger
        let url = "/api/Organization";
        return this.post(url, orgModel);
    }
 
    updateOrganization(id : number,orgModel: Organization): Observable<APIResponse<Organization>> {

        let url = "/api/Organization/Update";

        let params = new HttpParams()
            params = params.set('id', id);

        return this.put(url, orgModel,params);
    }

    deleteOrganization(id: number): Observable<APIResponse<Organization>> {

        let url = "/api/Organization/Delete?id=" + id;

        return this.delete(url);
    }


}
