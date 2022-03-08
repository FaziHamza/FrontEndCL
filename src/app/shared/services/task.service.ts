import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/a-p-i-Response';
import { task } from '../models/task';
import { AuthenticationService } from './authentication.service';
import { BaseApiService } from './base-api.service';
import { CommonFunctionService } from './common-funcation.service';
import { RestApiService } from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService  extends BaseApiService<task> {
  commonEndPoint = "Task";
  constructor(private _httpClient: HttpClient,
    public _commonFunctionService: CommonFunctionService,

    public _authenticationService: AuthenticationService) {
    super(_httpClient, _authenticationService);
}

  getAllProjects(search?: string): Observable<APIResponse<task[]>> {

      let url = "/api/Tasks";
      let params = new HttpParams()

      if (search) {
          params = params.set('search', search);
      }
      return this.http.get<APIResponse<task[]>>(url);
  }
  getTaskById(projectId?: number): Observable<APIResponse<task>> {

   debugger
    let params = new HttpParams()

    if (projectId) {
        params = params.set('taskId', projectId);
    }
    return this.http.get<APIResponse<task>>(this.baseUrl + this.commonEndPoint + "/TaskbyId?taskId="+projectId,{headers: this.headers});
}
  createTask(body: task): Observable<APIResponse<task>> {
    debugger
    let params = new HttpParams()
    // return this.post(url, projModel,{headers: this.headers});
    return this.http.post<APIResponse<task>>(this.baseUrl + this.commonEndPoint + "/Addtask" , body, { headers: this.headers });
}

  
}
