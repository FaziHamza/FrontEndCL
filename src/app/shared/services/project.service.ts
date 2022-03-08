import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/a-p-i-Response';
import { project } from '../models/project';
import { AuthenticationService } from './authentication.service';
import { BaseApiService } from './base-api.service';
import { CommonFunctionService } from './common-funcation.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService  extends BaseApiService<project> {
  commonEndPoint = "Project";
  constructor(private _httpClient: HttpClient,
    public _commonFunctionService: CommonFunctionService,

    public _authenticationService: AuthenticationService) {
    super(_httpClient, _authenticationService);
}

getProjectList(jobId?: number): Observable<APIResponse<project[]>> {

  debugger
   let params = new HttpParams()

   if (jobId) {
       params = params.set('jobId', jobId);
   }
   return this.http.get<APIResponse<project[]>>(this.baseUrl + this.commonEndPoint + "/Get?jobId="+jobId,{headers: this.headers});
}
  getProjectById(projectId?: number): Observable<APIResponse<project>> {

   debugger
    let params = new HttpParams()

    if (projectId) {
        params = params.set('projectId', projectId);
    }
    return this.http.get<APIResponse<project>>(this.baseUrl + this.commonEndPoint + "/ProjectbyId?projectId="+projectId,{headers: this.headers});
}
  createProject(body: project): Observable<APIResponse<project>> {
    debugger
    let params = new HttpParams()
    // return this.post(url, projModel,{headers: this.headers});
    return this.http.post<APIResponse<project>>(this.baseUrl + this.commonEndPoint + "/AddProject" , body, { headers: this.headers });
}

  
}
