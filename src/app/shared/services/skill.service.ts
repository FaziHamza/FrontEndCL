import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/a-p-i-Response';
import { project } from '../models/project';
import { skill, skillDto } from '../models/skill';
import { skillCategory, skillCategoryDto } from '../models/skillCategory';
import { AuthenticationService } from './authentication.service';
import { BaseApiService } from './base-api.service';
import { CommonFunctionService } from './common-funcation.service';

@Injectable({
  providedIn: 'root'
})
export class SkillService extends BaseApiService<skill> {
  commonEndPoint = "Skill";
  constructor(private _httpClient: HttpClient,
    public _commonFunctionService: CommonFunctionService,

    public _authenticationService: AuthenticationService) {
    super(_httpClient, _authenticationService);
}

skillDtoList: skillDto[] ;
skillCategoryDtoList: skillCategoryDto[] ;

getSkillCategoryList(jobId?: number): Observable<APIResponse<skillCategory[]>> {

  
  return this.http.get<APIResponse<project[]>>(this.baseUrl + this.commonEndPoint + "/GetSkillCategoryList",{headers: this.headers});
}
getSkillList(jobId?: number): Observable<APIResponse<skillDto[]>> {

  
  return this.http.get<APIResponse<skillDto[]>>(this.baseUrl + this.commonEndPoint + "/GetSkillList",{headers: this.headers});
}

getSkillCategorybyId(SkillId?: number): Observable<APIResponse<skillCategoryDto>> {

   return this.http.get<APIResponse<skillCategoryDto>>(this.baseUrl + this.commonEndPoint + "/SkillCategorybyId?SkillId="+SkillId,{headers: this.headers});
}
getSkillbyId(SkillId?: number): Observable<APIResponse<skillDto>> {

  return this.http.get<APIResponse<skillDto>>(this.baseUrl + this.commonEndPoint + "/SkillbyId?SkillId="+SkillId,{headers: this.headers});
}
deleteSkillCategory(SkillId?: number): Observable<APIResponse<skillCategoryDto>> {
  debugger
  return this.http.get<APIResponse<skillCategoryDto>>(this.baseUrl + this.commonEndPoint + "/SkillCategoryDelete?SkillId="+SkillId,{headers: this.headers});
}
deleteSkill (SkillId?: number): Observable<APIResponse<skillCategoryDto>> {
  debugger
  return this.http.get<APIResponse<skillCategoryDto>>(this.baseUrl + this.commonEndPoint + "/SkillDelete?SkillId="+SkillId,{headers: this.headers});
}
  createSkillCategory(body: skillCategoryDto): Observable<APIResponse<skillCategoryDto>> {
    debugger
    let params = new HttpParams()
    // return this.post(url, projModel,{headers: this.headers});
    return this.http.post<APIResponse<skillCategoryDto>>(this.baseUrl + this.commonEndPoint + "/AddEditSkillCategory" , body, { headers: this.headers });
}
createSkill(body: skillDto): Observable<APIResponse<skillDto>> {
  debugger
  let params = new HttpParams()
  // return this.post(url, projModel,{headers: this.headers});
  return this.http.post<APIResponse<skillDto>>(this.baseUrl + this.commonEndPoint + "/AddEditSkill" , body, { headers: this.headers });
}

  
}
